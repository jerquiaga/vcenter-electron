// Module that everything is built on.
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Module to manage file system paths
const path = require('path')
// Module to persist user settings
const settings = require('electron-settings')
// Module to persist window state
const windowStateKeeper = require('electron-window-state')
// Module to send information between pages and main process
const ipcMain = require('electron').ipcMain
// Require the custom menu
const mainMenu = require('./mainmenu.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create the main window.
function createWindow () {
  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 800
  });

  // Settings are stored at %APPDATA%\vcenter-electron\Settings
  // Check to see if the user has stored settings. If not, initialize
  // settings with the defaults for the organization.
  if (settings.has('server.URL') === false) {
    settings.set('server', { URL: 'file://' + __dirname + '/connect.html',
                             type: 'esxi'
                           })
  }
  if (settings.has('extensions.html5') === false) {
    settings.set('extensions', { html5: '/ui',
                                 flash: '/vsphere-client/?csp'
                               })
  }
  if (settings.has('format.preference') === false) {
    settings.set('format', { preference: 'html5' })
  }

  // Watch the format preference setting and reload the URL if the user
  // chooses to change which interface they want to use.
  settings.watch('format.preference', function handler(newValue) {
    if (settings.get('server.URL') === 'file://' + __dirname + '/connect.html') {
      mainWindow.loadURL(settings.get('server.URL'))
    } else {
      if (settings.get('server.type') === 'esxi') { mainMenu.setHostMode('esxi') }
      mainWindow.loadURL('file://' + __dirname + '/loader.html')
    }
  })

  // Watch the base URL setting and reload the URL if the user
  // chooses to change which interface they want to use.
  settings.watch('server.URL', function handler(newValue) {
    if (settings.get('server.URL') === 'file://' + __dirname + '/connect.html') {
      mainWindow.loadURL(settings.get('server.URL'))
    } else {
      if (settings.get('server.type') === 'esxi') { mainMenu.setHostMode('esxi') }
      mainWindow.loadURL('file://' + __dirname + '/loader.html')
    }
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({  
                    webPreferences: {
                      plugins: true,
                      nodeIntegration: true,
                      webviewTag: true,
                      enableRemoteModule: true,
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
  if (settings.get('server.URL') === 'file://' + __dirname + '/connect.html') {
    mainWindow.loadURL(settings.get('server.URL'))
  } else {
    if (settings.get('server.type') === 'esxi') { mainMenu.setHostMode('esxi') }
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

// Load the Flash plugin for Flash mode.
pepperPath = __dirname.replace('\\resources\\app.asar','') + '\\resources\\plugin\\pepflashplayer.dll'
app.commandLine.appendSwitch('ppapi-flash-path', pepperPath)
// Ignore certificate errors because VMware uses self-signed certs.
app.commandLine.appendSwitch('ignore-certificate-errors')
// Disable caching
app.commandLine.appendSwitch('disable-http-cache')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Allow server updates from connect.html renderer process.
ipcMain.on('server-update', (event, arg1, arg2, arg3) => {
  //console.log("Received new server and format, " + arg1 + ", " + arg2)
  settings.set('server', { URL: arg1, type: arg3 })
  settings.set('format', { preference: arg2 })

  mainMenu.changeMenu(arg2)
  if (arg3 === 'esxi' || arg3 === 'vcenter') { mainMenu.setHostMode(arg3) }
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