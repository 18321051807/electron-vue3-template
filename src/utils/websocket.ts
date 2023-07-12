/*
 * @Author: kkle
 * @Date: 2022-09-02 16:41:39
 * @LastEditTime: 2023-07-12 13:23:25
 * @LastEditors: kkle
 * @Description: 
 * @FilePath: /electron-vite-vue/src/utils/websocket.ts
 */

import Cookies from "js-cookie";

interface Ioption {
    url: string,
    webSocketType: string,
    onMessageCallBack: any
}

interface IheartCheck {
    timeout: number,
    timeoutObj: any,
    reset(): IheartCheck,
    start(): void
}

type TUrl = string

export default class {

    /**
     * @param option:{
     *url:地址 
     */
    url: string
    webSocketType: string
    option: Ioption
    websocket: any
    $message: any
    constructor(option: Ioption) {
        this.url = option.url
        this.webSocketType = option.webSocketType
        this.option = option
        this.websocket = null
        this.init()
    }
    init() {
        var _this = this;
        if (typeof WebSocket === 'undefined') {
            this.$message.error('您的浏览器不支持socket')
        } else {
            this.websocket = new WebSocket(this.url);

            this.websocket.onopen = (evt: TUrl) => {
                _this.onOpen(evt)
            }
            this.websocket.onmessage = (evt: TUrl) => {
                _this.onMessage(evt)
            }
            this.websocket.onclose = (evt: TUrl) => {
                _this.onClose()
            }
            this.websocket.onerror = (evt: TUrl) => {
                _this.onError(evt)
            }
        }
    }

    onOpen(evt: TUrl) {
        let _this = this;
        // 心跳检验
        var heartCheck: IheartCheck = {
            timeout: 5000,//5秒
            timeoutObj: null,
            reset: function (): IheartCheck {
                clearInterval(this.timeoutObj);
                return this;
            },
            start: function (): void {
                // let thisHeartCheck = this;
                // this.timeoutObj = setInterval(function () {
                //     if (_this.websocket.readyState != 1 ||
                //         (_this.webSocketType && _this.webSocketType == 'XXX' &&
                //             Cookies.get('XXX') == "false")) {
                //         thisHeartCheck.reset()
                //         _this.onClose()
                //     } else {
                //         _this.websocket.send("HeartBeat"); // 发送心跳信息，保持不断
                //     }

                // }, this.timeout)
            }
        }

        console.log("websock连接成功");
        heartCheck.reset().start();

    }

    doSend(message: any) {
        this.websocket.send(message);
    }

    // 从后台接收参数
    onMessage(evt: any) {
        if (this.option && this.option.onMessageCallBack instanceof Function) {
            this.option.onMessageCallBack(evt.data ? JSON.parse(evt.data) : '')
        }
        // this.websocket.close();
    }

    onError(evt: any) {
        console.log('websocket发生错误')
        this.onClose()
    }
    // 最后关闭
    onClose() {
        this.websocket.close()
        console.log('websocket关闭')
    }
}