// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    handleCallSign: (callback) => ipcRenderer.on('callsign-value', callback),
    setSoundFilePath: (arg) => ipcRenderer.send('set-sound-file-path', arg),
    setAllTxtFilePath: (arg) => ipcRenderer.send('set-all-txt-file-path', arg),
    setCallSign: (arg) => ipcRenderer.send('set-callsign', arg),
    setConfigData: (arg) => ipcRenderer.send('set-config-data', arg),
    storageToRender: (callback) => ipcRenderer.on('storage-to-render', callback)
})
