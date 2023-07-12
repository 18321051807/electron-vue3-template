import { lstat } from 'node:fs/promises'
import { cwd } from 'node:process'
import { ipcRenderer } from 'electron'

ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})

lstat(cwd()).then(stats => {
  console.log('[fs.lstat]', stats)
}).catch(err => {
  console.error(err)
})


// 监听从主进程发送的消息
ipcRenderer.on('server-data', (event, data) => {
  // this.output += data;
  console.log(data,'456');
  
});
ipcRenderer.on('server-error', (event, data) => {
  // this.output += 'Error: ' + data;
  console.log(data,'123');
  
});
