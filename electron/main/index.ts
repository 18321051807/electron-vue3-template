import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path';
const path = require('path');
const { spawn } = require('child_process');
import './server.js'

// const url = require('url');
// import robotjs from 'robotjs'
// const robot = require('robotjs');
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      sandbox: false,
      // preload: path.join(__dirname, 'robot.js'),
      // preload,

      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // const server = spawn('node', [path.join(__dirname, 'server.js')]);


  // // 在主进程中启动 Node.js 服务
  // const server = spawn('node', [path.join(__dirname, 'server.js')]);

  // // 将 Node.js 服务的 stdout 数据发送到渲染进程
  // server.stdout.on('data', (data) => {
  //   win.webContents.send('server-data', data.toString());
  // });

  // // 将 Node.js 服务的 stderr 数据发送到渲染进程
  // server.stderr.on('data', (data) => {
  //   win.webContents.send('server-error', data.toString());
  // });

  // 当 Node.js 服务退出时，关闭 Electron 应用程序
  // server.on('exit', () => {
  //   app.quit();
  // });

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow)

const createNodeServer = () => {
  // 在主进程中启动 Node.js 服务
  const server = spawn('node', [path.join(__dirname, 'server.js')]);

  // 将 Node.js 服务的 stdout 数据发送到渲染进程
  server.stdout.on('data', (data) => {
    win.webContents.send('server-data', data.toString());
  });

  // 将 Node.js 服务的 stderr 数据发送到渲染进程
  server.stderr.on('data', (data) => {
    win.webContents.send('server-error', data.toString());
  });

}

// app.on("ready", createNodeServer)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// 监听从渲染进程发送的消息
ipcMain.on('server-command', (event, command) => {
  // 将命令发送到 Node.js 服务
  console.log(command, 'command');

  // server.stdin.write(command);
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
