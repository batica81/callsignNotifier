const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const Tail = require('tail-file');

let mainWindow
const callsign = 'YU4HAK'
let mytail
const isWin = process.platform === 'win32'

console.log('starting app')

if (isWin) {
  // Windows:
  // mytail = new Tail(process.env.WIN_ALL_PATH)
  mytail = new Tail("/Users/Voja/AppData/Local/WSJT-X/test.txt")
} else {
  // Linux:
  // mytail = new Tail(process.env.LIN_ALL_PATH)
  mytail = new Tail("/home/voja/.local/share/WSJT-X/test.txt")
}


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);

app.whenReady().then(() => {
  // ipcMain.on('counter-value', (_event, value) => {
  //   console.log(value) // will print value to Node console
  // })
  createWindow()

  // app.on('activate', function () {
  //   if (mainWindow.getAllWindows().length === 0) createWindow()
  // })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

mytail.on('line', line => {
  const lineArray = line.split(' ').filter(word => word !== '')

  if (lineArray[7] === callsign) {
    console.log('alerting ' + callsign)
    mainWindow.webContents.send("counter-value", line)

  }
})

mytail.start()
