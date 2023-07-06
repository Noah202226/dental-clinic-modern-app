import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { writeFileSync } from 'fs'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    contextBridge.exposeInMainWorld('ipcRenderer', {
      send: (channel, args) => ipcRenderer.send(channel, args),
      on: (channel, args) => ipcRenderer.on(channel, args)
    })

    contextBridge.exposeInMainWorld('electronFs', writeFileSync)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
