var ws = require("nodejs-websocket");
var moment = require('moment');
let robot = require("robotjs");   //控制鼠标键盘等操作

console.log("开始建立连接...")

let users = [];
let conns = {};

function boardcast(obj) {
    // bridge用来实现一对一的主要参数
    if (obj.bridge && obj.bridge.length) {
        obj.bridge.forEach(item => {
            conns[item].sendText(JSON.stringify(obj));
        })
        return;
    }
    server.connections.forEach((conn, index) => {
        conn.sendText(JSON.stringify(obj));
    })
}
const handle = () => {
    let screenSize = robot.getScreenSize();
    robot.moveMouseSmooth(screenSize.width - 120, screenSize.height - 100);	//移动鼠标
    robot.setMouseDelay(1000); // 设置延迟，避免立即执行下面的点击
    robot.mouseClick();	 //鼠标点击

    robot.moveMouseSmooth(screenSize.width - 120, screenSize.height - 580);
    robot.setMouseDelay(2000);
    robot.mouseClick();

    robot.moveMouseSmooth(screenSize.width - 750, screenSize.height - 470);
    robot.setMouseDelay(1000);
    robot.mouseClick();

}
var server = ws.createServer(function (conn) {
    conn.on("text", function (obj) {
        console.log(obj, 'obj');
        obj = JSON.parse(obj);
        // 将所有uid对应的连接conn存到一个对象里面
        conns['' + obj.uid + ''] = conn;
        if (obj.type === 1) {
            let isuser = users.some(item => {
                return item.uid === obj.uid
            })
            if (!isuser) {
                users.push({
                    nickname: obj.nickname,
                    uid: obj.uid
                });
            }
            boardcast({
                type: 1,
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
            });
        } else {
            boardcast({
                type: 2,
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
            });
        }
        handle()
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8001)
console.log("WebSocket建立完毕")
