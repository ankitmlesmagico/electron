const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const os = require('os')

let pythonProcess = null

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  win.loadFile('index.html')
}

ipcMain.on('start-python', (event) => {
  if (pythonProcess) return // Prevent multiple starts

  // Explicitly separate dev and production path logic
  let basePath, scriptPath
  if (app.isPackaged) {
    basePath = path.join(process.resourcesPath, 'webautomate_ai')
    scriptPath = path.join(basePath, 'agent.py')
  } else {
    basePath = path.join(__dirname, 'webautomate_ai')
    scriptPath = path.join(basePath, 'agent.py')
  }

  console.log('process.resourcesPath:', process.resourcesPath)
  console.log('__dirname:', __dirname)
  console.log('basePath:', basePath)
  console.log('scriptPath:', scriptPath)

  // Use user's home directory as cwd to avoid read-only issues
  const userHome = os.homedir()

  pythonProcess = spawn('python3', [scriptPath], {
    cwd: userHome,
    env: process.env,
  })

  pythonProcess.stdout.on('data', (data) => {
    event.sender.send('python-output', data.toString())
  })

  pythonProcess.stderr.on('data', (data) => {
    event.sender.send('python-output', `[ERROR] ${data.toString()}`)
  })

  pythonProcess.on('close', (code) => {
    event.sender.send('python-output', `\n[Agent exited with code ${code}]`)
    pythonProcess = null
  })
})

// Listen for user input and send to the process
ipcMain.on('python-input', (event, input) => {
  if (pythonProcess) {
    pythonProcess.stdin.write(input + '\n')
  }
})

app.whenReady().then(createWindow)
