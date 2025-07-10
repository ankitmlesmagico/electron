document.getElementById('startBtn').addEventListener('click', () => {
  window.electronAPI.runPython()
})

window.electronAPI.onPythonOutput((data) => {
  document.getElementById('output').textContent += data
})

// NEW: Handle user input
// Assumes there is a form with id 'inputForm' and an input with id 'inputBox'
document.getElementById('inputForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const input = document.getElementById('inputBox').value
  window.electronAPI.sendPythonInput(input)
  document.getElementById('inputBox').value = ''
})
