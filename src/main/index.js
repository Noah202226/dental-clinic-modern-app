import { app, shell, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Mongodb
import db from './mongoConnection'
import { Expenses, InstallmentPatient, NewPatient, NewSale, SettingsData, Users } from './shemas'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1350,
    height: 670,
    show: false,

    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.maximize()

  // Create an empty menu template
  const menuTemplate = []

  // Build the menu from the template
  const menu = Menu.buildFromTemplate(menuTemplate)

  // Set the menu as the application menu
  mainWindow.setMenu(menu)

  mainWindow.on('ready-to-show', async () => {
    mainWindow.show()
  })

  mainWindow.on('will-resize', (event) => {
    // Prevent resizing when dragging the window frame
    event.preventDefault()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('close', (event) => {
    // Prevent the window from quitting immediately
    event.preventDefault()

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

// Listen for a custom event indicating the settings have been saved
ipcMain.on('settings-saved', () => {
  // Relaunch the app to apply the updated settings
  app.relaunch()
  app.quit()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Get settings
ipcMain.on('get-settings', async (e, args) => {
  try {
    const settingsData = await SettingsData.find()

    e.reply('settings-data', JSON.stringify(settingsData))
    console.log(settingsData)
  } catch (e) {
    console.log(e)
  }
})
ipcMain.on('new-setting', async (e, args) => {
  const newSetting = await SettingsData.findByIdAndUpdate(args.id, { appTitle: args.appTitle })
})

// users
ipcMain.on('check-user', async (e, args) => {
  const user = await Users.findOne({ name: args.name, pwd: args.pwd })

  e.reply('validated-user', user)
})
ipcMain.on('get-users', async (e, args) => {
  const users = await Users.find()

  e.reply('all-users', JSON.stringify(users))
})
ipcMain.on('updateUserInfo', async (e, args) => {
  try {
    const status = await Users.findByIdAndUpdate(args.id, {
      name: args.name,
      pwd: args.pass,
      accountType: args.accountType
    })

    console.log(status)

    e.reply('updated-user', 'User Updated.')
  } catch (e) {
    console.log(e)
  }
})
ipcMain.on('delete-user', async (e, args) => {
  console.log(args)
  try {
    await Users.findByIdAndDelete(args)

    e.reply('deleted-user', 'User deleted.')
  } catch (e) {
    console.log(e)
  }
})
// New patient
ipcMain.on('new-user', async (e, args) => {
  const newUser = new Users(args)

  try {
    await newUser.save()

    console.log('User saved successfully!')
    e.reply('new-patient-record-saved', 'New Patient Record Saved.')
    // Handle any success messages or redirects
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})

// New patient
ipcMain.on('new-patient-record', async (e, args) => {
  console.log(args)

  const newPatient = new NewPatient(args)

  try {
    await newPatient.save()
    // await newPatient2.save()
    console.log('User saved successfully!')
    e.reply('new-patient-record-saved', 'New Patient Record Saved.')
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
    console.log('New sale saved successfully!')
    // Handle any success messages or redirects
  } catch (error) {
    console.error('Error saving sale:', error)
    // Handle any error messages or error handling
  }
})

// Get all patients
ipcMain.on('patients-records', async (e, args) => {
  const patients = await NewPatient.find({})
  e.reply('patients', JSON.stringify(patients))
})
// Get sales for patient
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

//New Installment Patient
// Get all patients
ipcMain.on('installment-patient-records', async (e, args) => {
  const patients = await InstallmentPatient.find({})
  e.reply('installment-patients', JSON.stringify(patients))
})

// Get installment patient info
ipcMain.on('get-installment-patient-info', async (e, args) => {
  try {
    const installmentPatientData = await InstallmentPatient.findOne({ _id: args })

    e.reply('installment-patient-info', JSON.stringify(installmentPatientData))
  } catch (error) {
    console.error('Error finding user:', args)
    // Handle any error messages or error handling
  }
})
ipcMain.on('new-installment-patient', async (e, args) => {
  const newInstallmentPatient = new InstallmentPatient(args)

  try {
    await newInstallmentPatient.save()
    // await newPatient2.save()
    console.log('Installment Patient Saved successfully!')
    // Handle any success messages or redirects

    e.reply('installment-patient-saved', 'patient info updated .')
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})
ipcMain.on('delete-installment-patient', async (e, args) => {
  try {
    await InstallmentPatient.findByIdAndDelete(args)
    // await newPatient2.save()
    console.log('Installment Patient Deleted successfully!')
    // Handle any success messages or redirects

    e.reply('installment-patient-deleted', 'delete now.')
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})

ipcMain.on('update-installment-patient-gives', async (e, args) => {
  console.log(args)
  try {
    const data = await InstallmentPatient.updateOne(
      { _id: args.patientID },
      {
        $push: { gives: { givenDate: args.givenDate, amountGive: args.amountGive } },
        remainingBal: args.remainingBal
      }
    )
    // await newPatient2.save()
    console.log('Installment Patient Give Updated successfully!', data)
    // Handle any success messages or redirects

    e.reply('installment-patient-gives-updated', args.patientID)
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})
// ipcMain.on('update-installment-patient-gives', async (e, args) => {
//   console.log(args)
//   try {
//     const data = await InstallmentPatient.updateOne(
//       { _id: args.patientID },
//       { $set: { gives: args.gives, remainingBal: args.remainingBal } }
//     )
//     // await newPatient2.save()
//     console.log('Installment Patient Give Updated successfully!', data)
//     // Handle any success messages or redirects

//     e.reply('installment-patient-gives-updated', args.patientID)
//   } catch (error) {
//     console.error('Error saving user:', error)
//     // Handle any error messages or error handling
//   }
// })

// Sales Report
ipcMain.on('get-filtered-sales-record', async (e, args) => {
  try {
    const data = await NewSale.find({
      dateTransact: { $gte: args.firstDay, $lte: args.lastDay }
    }).sort({ dateTransact: 'asc' })
    // Handle any success messages or redirects
    e.reply('filted-sales', JSON.stringify(data))
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})
ipcMain.on('get-filtered-expenses-record', async (e, args) => {
  try {
    const data = await Expenses.find({
      dateTransact: { $gte: args.firstDay, $lte: args.lastDay }
    }).sort({ dateTransact: 'asc' })
    // Handle any success messages or redirects
    e.reply('filted-expenses', JSON.stringify(data))
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})

// Expenses
// New Expense
ipcMain.on('new-expense', async (e, args) => {
  const data = new Expenses(args)
  try {
    await data.save()
    // Handle any success messages or redirects
    e.reply('new-expense-saved')
  } catch (error) {
    console.error('Error saving expense:', error)
    // Handle any error messages or error handling
  }
})

// Get tx info
ipcMain.on('get-sale-tx-info', async (e, args) => {
  try {
    const data = await NewSale.findOne({
      _id: args
    })
    // Handle any success messages or redirects
    e.reply('sale-tx-info', JSON.stringify(data))
  } catch (error) {
    console.error('Error getting tx:', error)
    // Handle any error messages or error handling
  }
})
// Delete tx
ipcMain.on('delete-sale-tx', async (e, args) => {
  try {
    await NewSale.findByIdAndDelete({
      _id: args
    })
    // Handle any success messages or redirects
    e.reply('tx-deleted', 'Transaction deleted')
  } catch (error) {
    console.error('Error getting tx:', error)
    // Handle any error messages or error handling
  }
})
ipcMain.on('update-sale-tx', async (e, args) => {
  try {
    await NewSale.findByIdAndUpdate(args.txID, args.newData)
    // Handle any success messages or redirects
    e.reply('tx-updated', 'Transaction updated')
  } catch (error) {
    console.error('Error getting tx:', error)
    // Handle any error messages or error handling
  }
})

// Exit app
ipcMain.on('exit-app', (e, args) => {
  app.exit()
})
