import { Box, Button, Typography } from '@mui/material'
import React from 'react'

const Settings = ({ settingModalRef }) => {
  const ipcRenderer = window.ipcRenderer

  const saveSettings = () => {
    ipcRenderer.send('settings-saved')
  }
  return (
    <dialog ref={settingModalRef}>
      <Typography>Settings</Typography>
      <Button variant="contained" color="warning" onClick={saveSettings}>
        Save settings
      </Button>
    </dialog>
  )
}
export default Settings
