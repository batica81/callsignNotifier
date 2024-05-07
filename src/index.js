const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const Tail = require('tail-file');
const Store = require('electron-store');
const store = new Store ();
const _ = require('lodash');

let mainWindow
// let callsign = 'YU4HAK'

// let tailFilePath = "/home/voja/.local/share/WSJT-X/test.txt"  //lin
// let tailFilePath = "/Users/Voja/AppData/Local/WSJT-X/test.txt"  //win
// let tailFilePath = "/Users/Voja/AppData/Local/WSJT-X/all.txt"  //win

let soundFileLocation = ""
let callsign = ''
let tailFile = '';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Define a debounced version of the send function
const debouncedSend = _.debounce((message) => {
  mainWindow.webContents.send("callsign-value", message);
}, 2000); // 4 seconds debounce time


function setTextFile(allTxtFilePath){
  // tailFilePath = allTxtFilePath
  tailFile = new Tail(allTxtFilePath)

  tailFile.on('line', line => {
    const lineArray = line.split(' ').filter(word => word !== '')
    if (lineArray.length > 8) {
      let messageArray = [lineArray[7].replace('<', '').replace('>', ''), lineArray[8].replace('<', '').replace('>', ''), lineArray[9]]
      let messageString = messageArray.join(" ").trim()
      console.log(line, ' Line read!!!!!')

      // alerting only if message for us, and is a response to CQ
      if (lineArray[7].replace('<', '').replace('>', '') === callsign && lineArray[9].length > 2) {
        console.log('Alerting ' + callsign)

        // Call the debounced send function instead of directly calling send
        debouncedSend(messageString);
      }
    }
  })

  tailFile.start()
  console.log('setting allTxtFilePath: ', allTxtFilePath)
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'lion.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Timeout has to be used!
  setTimeout(() => {

    // store.set('dataFromStorage', {'some' : 'data'})
    let dataFromStorage =  store.get('dataFromStorage', {
      'callSignText' : '',
      'selectedFilePath' : '',
      'audioVolume' : 0.1
    })

    callsign = dataFromStorage['callSignText']
    tailFile = dataFromStorage['selectedFilePath'];

    setTextFile(tailFile)

    mainWindow.webContents.send("storage-to-render", dataFromStorage)
  }, 1500)
};

app.whenReady().then(() => {

  ipcMain.on('set-sound-file-path', (event, soundFilePath) => {
    soundFileLocation = soundFilePath
  })

  ipcMain.on('set-config-data', (event, newSettings) => {
    console.log(newSettings)
    store.set('dataFromStorage', newSettings)
  })

  ipcMain.on('set-all-txt-file-path', (event, allTxtFilePath) => setTextFile(allTxtFilePath))




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
