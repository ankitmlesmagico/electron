const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  runPython: () => ipcRenderer.send('start-python'),
  sendPythonInput: (input) => ipcRenderer.send('python-input', input),
  onPythonOutput: (callback) =>
    ipcRenderer.on('python-output', (event, data) => callback(data)),
})
