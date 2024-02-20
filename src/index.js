const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const Tail = require('tail-file');

let mainWindow
let callsign = 'YU4HAK'

// let tailFilePath = "/home/voja/.local/share/WSJT-X/test.txt"  //lin
let tailFilePath = "/Users/Voja/AppData/Local/WSJT-X/test.txt"  //win
// let tailFilePath = "/Users/Voja/AppData/Local/WSJT-X/all.txt"  //win

let soundFileLocation = ""

let tailFile = '';


// todo: move from here and make it work for persistence
const Store = require('electron-store');

const store = new Store();

store.set('unicorn', '🦄');
console.log(store.get('unicorn'));
//=> '🦄'

// Use dot-notation to access nested properties
store.set('foo.bar', true);
console.log(store.get('foo'));
//=> {bar: true}

store.delete('unicorn');
console.log(store.get('unicorn'));
//=> undefined







// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'lion.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();



};


app.whenReady().then(() => {

  ipcMain.on('set-sound-file-path', (event, soundFilePath) => {
    soundFileLocation = soundFilePath
    console.log(soundFileLocation)
  })

  ipcMain.on('set-all-txt-file-path', (event, allTxtFilePath) => {
    tailFilePath = allTxtFilePath
    tailFile = new Tail(tailFilePath)

    tailFile.on('line', line => {
      const lineArray = line.split(' ').filter(word => word !== '')
      let messageArray = [lineArray[7], lineArray[8], lineArray[9]]
      let messageString = messageArray.join(" ").trim()

      console.log(line, 'line read!!!!!')

      // alerting only if message for us, and is a response to CQ
      if (lineArray[7] === callsign && lineArray[9].length > 2) {
        console.log('Alerting ' + callsign)
        mainWindow.webContents.send("counter-value", messageString)

      }
    })

    tailFile.start()
    console.log(tailFilePath)
  })

  ipcMain.on('set-callsign', (event, userCallSign) => {
    callsign = userCallSign;
    console.log(userCallSign)
  })


  createWindow()

  app.on('activate', function () {
    if (mainWindow.getAllWindows().length === 0) createWindow()
  })
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

// tailFile.on('line', line => {
//   const lineArray = line.split(' ').filter(word => word !== '')
//   let messageArray = [lineArray[7], lineArray[8], lineArray[9]]
//   let messageString = messageArray.join(" ").trim()
//
//   console.log(line, 'line read!!!!!')
//
//   // alerting only if message for us, and is a response to CQ
//   if (lineArray[7] === callsign && lineArray[9].length > 2) {
//     console.log('Alerting ' + callsign)
//     mainWindow.webContents.send("counter-value", messageString)
//
//   }
// })

// tailFile.start()
