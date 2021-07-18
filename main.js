// Module that everything is built on.
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Module to manage file system paths
const path = require('path')
// Module to persist user settings
const Store = require('electron-store')
// Module to persist window state
const windowStateKeeper = require('electron-window-state')
// Module to send information between pages and main process
const ipcMain = require('electron').ipcMain
// Require the custom menu
const mainMenu = require('./mainmenu.js')

// Initialize settings store
const store = new Store({ watch: true })

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create the main window.
function createWindow () {
  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 1024
  });

  // Settings are stored at %APPDATA%\vcenter-electron\Settings
  // Check to see if the user has stored settings. If not, initialize
  // settings with the defaults for the organization.
  if (store.has('server.URL') === false) {
    store.set('server', { URL: 'file://' + __dirname + '/connect.html'})
  }

  // Watch the base URL setting and reload the URL if the user
  // chooses to change which interface they want to use.
  store.onDidChange('server.URL', function (newValue, oldValue) {
    if (store.get('server.URL') === 'file://' + __dirname + '/connect.html') {
      mainWindow.loadURL(store.get('server.URL'))
    } else {
      mainWindow.loadURL('file://' + __dirname + '/loader.html')
    }
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({  
                    webPreferences: {
                      nodeIntegration: true,
                      webviewTag: true,
                      contextIsolation: false,
                    }, 
                    'x': mainWindowState.x,
                    'y': mainWindowState.y,
                    'width': mainWindowState.width,
                    'height': mainWindowState.height,
                    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
                    backgroundColor: '#3075ab'
                  })
                  
  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow);

  // Load the page.
  if (store.get('server.URL') === 'file://' + __dirname + '/connect.html') {
    mainWindow.loadURL(store.get('server.URL'))
  } else {
    mainWindow.loadURL('file://' + __dirname + '/loader.html')
  }

  // Uncomment if you want to open the DevTools by default.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  
}

// Ignore certificate errors because VMware uses self-signed certs.
app.commandLine.appendSwitch('ignore-certificate-errors')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Allow server updates from connect.html renderer process.
ipcMain.on('server-update', (event, arg1) => {
  //console.log("Received new server, " + arg1)
  store.set('server', { URL: arg1})
})

// Allow start service messages from loader.html renderer process.
ipcMain.on('start-service', (event) => {
  var sudo = require('sudo-prompt')
  var options = {
    name: 'vCenter',
    icns: './assets/icons/win/vcenter.ico'
  }
  sudo.exec('net start \"VMware Cip Message Proxy Service\"',options,
    function(error,stdout,stderr) {
      if (error) throw error
      console.log(stdout)
    }
  )
  mainWindow.webContents.send('updateinfo', 'CIP Message Service started.')
})