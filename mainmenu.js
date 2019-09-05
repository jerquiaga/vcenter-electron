// Builds the menu for the application
const {Menu} = require('electron')
const electron = require('electron')
const app = electron.app
const settings = require('electron-settings')

const template = [
  {
    label: 'File',
    submenu: [
        {
            // This option is hidden when using the HTML interface
            label: 'Switch to HTML5...',
            click () { settings.set('format', { preference: 'html5' })
                       menu.items[0].submenu.items[0].visible = false
                       menu.items[0].submenu.items[1].visible = true
                       menu.items[0].submenu.items[1].enabled = true
                     }
        },
        {
            // This option is hidden when using the Flash interface
            label: 'Switch to Flash...',
            click () { settings.set('format', { preference: 'flash' })
                       menu.items[0].submenu.items[0].visible = true
                       menu.items[0].submenu.items[1].visible = false
                       menu.items[0].submenu.items[0].enabled = true
                     }
        },
        {
            type: 'separator'
        },
        /* BEGIN CUSTOM MENU
        {
            label: 'vCenters',
            submenu: [
              {
                label: 'vCenter 1',
                click() { settings.set('server', { URL: 'vcenter1.example.com', type: 'vcenter' })
                          menu.items[0].submenu.items[0].enabled = true
                          menu.items[0].submenu.items[1].enabled = true
                        }
              },
              {
                label: 'vCenter 2',
                click() { settings.set('server', { URL: 'vcenter2.example.com', type: 'vcenter' })
                          menu.items[0].submenu.items[0].enabled = true
                          menu.items[0].submenu.items[1].enabled = true
                        }
              }
            ]
        },
        {
            label: 'ESXi Hosts',
            submenu: [
              {
                label: 'Cluster 1',
                submenu: [
                  {
                    label: 'host1',
                    click() { settings.set('server', { URL: 'host1.example.com', type: 'esxi' })
                              settings.set('format', { preference: 'html5'} )
                              hostMode()
                            }
                  },
                  {
                    label: 'host2',
                    click() { settings.set('server', { URL: 'host2.example.com', type: 'esxi' })
                              settings.set('format', { preference: 'html5'} )
                              hostMode()
                            }
                  }
                ]
              },
              {
                label: 'Cluster 2',
                submenu: [
                  {
                    label: 'host3',
                    click() { settings.set('server', { URL: 'host3.example.com', type: 'esxi' })
                              settings.set('format', { preference: 'html5'} )
                              hostMode()
                            }
                  },
                  {
                    label: 'host4',
                    click() { settings.set('server', { URL: 'host4.example.com', type: 'esxi' })
                              settings.set('format', { preference: 'html5'} )
                              hostMode()
                            }
                  }
                ]
              },
              {
                label: 'host5',
                click() { settings.set('server', { URL: 'host5.example.com', type: 'esxi' })
                          settings.set('format', { preference: 'html5'} )
                          hostMode()
                        }
              }
            ]
        },
        {
          label: 'View Servers',
          submenu: [
            {
              label: 'View Connection 1',
              click() { settings.set('server', { URL: 'viewconnection1.example.com', type: 'view' })
                        viewMode()
                      }
            },
            {
              label: 'View Connection 2',
              click() { settings.set('server', { URL: 'viewconnection2.example.com', type: 'view' })
                        viewMode()
                      }
            },
            {
              label: 'App Volume 1',
              click() { settings.set('server', { URL: 'appvolume1.example.com', type: 'appv' })
                        hostMode()
                      }
            }
          ]
        },
        END CUSTOM MENU */ 
        {
            label: 'Connect to server...',
            click() { settings.set('server', { URL: 'file://' + __dirname + '/connect.html', type: 'esxi' })
                      settings.set('format', { preference: 'html5'} )
                      menu.items[0].submenu.items[1].enabled = false
                      menu.items[0].submenu.items[0].visible = false
                      menu.items[0].submenu.items[1].visible = true
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Exit',
            role: 'close'
        }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        // Opens the vCenter documentation site
        label: 'vCenter Documentation',
        click () { require('electron').shell.openExternal('https://www.vmware.com/support/pubs/vsphere-esxi-vcenter-server-6-pubs.html') }
      },
      {
        // Opens the VMware Host Client Documentation site
        label: 'VMware Host Client Documentation',
        click () { require('electron').shell.openExternal('https://www.vmware.com/support/pubs/') }
      },
      {
        label: 'About...',
        click () {
          var aboutMessage = "Created by Josh Erquiaga as a standalone client to fill the gap left behind by VMware when they discontinued the thick client.\n\n"
          aboutMessage += "vCenter Client Version: " + electron.app.getVersion() + "\n"
          aboutMessage += "Node Version: " + process.versions.node + "\n"
          aboutMessage += "Chrome Version: " + process.versions.chrome + "\n"
          aboutMessage += "Electron Version: " + process.versions.electron + "\n"

          electron.dialog.showMessageBox({ message: aboutMessage, buttons: ["Close"] })
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)

// Used in initial menu build to hide the switch option that is in use.
if (settings.get('format.preference') === 'html5') {
    menu.items[0].submenu.items[0].visible = false
} else if (settings.get('format.preference') === 'flash') {
    menu.items[0].submenu.items[1].visible = false
}

// Set vCenter options
function vcenterMode() {
    menu.items[0].submenu.items[1].enabled = true
}

// Turns off switch to Flash for hosts
function hostMode() {
  settings.set('format', { preference: 'html5'} )
  menu.items[0].submenu.items[1].enabled = false
  menu.items[0].submenu.items[0].visible = false
  menu.items[0].submenu.items[1].visible = true
}

// Turns off switch to HTML5 for view servers
function viewMode() {
  settings.set('format', { preference: 'flash'} )
  menu.items[0].submenu.items[0].enabled = false
  menu.items[0].submenu.items[1].visible = false
  menu.items[0].submenu.items[0].visible = true
}

// Function to allow main.js to turn on either the switch to HTML5 or
// switch to Flash option, used when a user connects to a host.
exports.changeMenu = arg => {
  if (arg === 'html5') {
      menu.items[0].submenu.items[0].visible = false
      menu.items[0].submenu.items[1].visible = true
      menu.items[0].submenu.items[1].enabled = true
  } else if (arg === 'flash') {
      menu.items[0].submenu.items[0].visible = true
      menu.items[0].submenu.items[1].visible = false
      menu.items[0].submenu.items[0].enabled = true
  } else { console.log("Invalid menu change specification") }
}

exports.setHostMode = arg => {
  hostMode()
}

Menu.setApplicationMenu(menu)