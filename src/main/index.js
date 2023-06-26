import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Mongodb
import db from './mongoConnection'
import { NewPatient, NewSale, Users } from './shemas'
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.maximize()
  mainWindow.on('ready-to-show', async () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('close', (event) => {
    // Prevent the window from quitting immediately
    event.preventDefault()

    console.log('close button clicked')

    mainWindow.webContents.send('closing-app', 'data')
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron-dental-app')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('check-user', async (e, args) => {
  const user = await Users.findOne({ name: args.name, pwd: args.pwd })

  e.reply('validated-user', user)
})

ipcMain.on('new-patient-record', async (e, args) => {
  console.log(args)

  const newPatient = new NewPatient(args)

  try {
    await newPatient.save()
    // await newPatient2.save()
    console.log('User saved successfully!')
    // Handle any success messages or redirects
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})

// New Sale
ipcMain.on('new-sale-record', async (e, args) => {
  const newSale = new NewSale(args)

  try {
    await newSale.save()
    // await newPatient2.save()
    console.log('User saved successfully!')
    // Handle any success messages or redirects
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})

// Get all patients
ipcMain.on('patients-records', async (e, args) => {
  const patients = await NewPatient.find({})
  e.reply('patients', JSON.stringify(patients))
})
// Get all patients
ipcMain.on('get-sales-record', async (e, args) => {
  console.log(args)
  const patients = await NewSale.find({ patientName: args })
  e.reply('sales-record', JSON.stringify(patients))
})

// Get patient Info
ipcMain.on('get-patient-info', async (e, args) => {
  const patientData = await NewPatient.findOne({ _id: args })

  e.reply('patient-info', JSON.stringify(patientData))
})

ipcMain.on('delete-patient', async (e, args) => {
  console.log(args)
  try {
    await NewPatient.findByIdAndDelete(args)
    // await newPatient2.save()
    console.log('Patient Deleted successfully!')
    // Handle any success messages or redirects

    e.reply('patient-deleted', 'delete now.')
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})

// Update patient Info
ipcMain.on('update-patient-info', async (e, args) => {
  console.log(args.id, args.updatedData)

  try {
    await NewPatient.findByIdAndUpdate(args.id, args.updatedData)
    // await newPatient2.save()
    console.log('Patient updated successfully!')
    // Handle any success messages or redirects

    e.reply('patient-updated', 'patient info updated .')
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})

// Exit app
ipcMain.on('exit-app', (e, args) => {
  app.exit()
})
