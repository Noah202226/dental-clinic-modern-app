import { Button, Stack } from '@mui/material'
import React from 'react'
import { toast } from 'react-toastify'

const Actions = ({ transactionReportRef, expenseModalRef, settingModalRef }) => {
  // Export functions
  const notyetworking = () => {
    console.log('.')
    toast.warn('Its not yet work. Sorry', {
      position: 'top-center',
      containerId: 'homeToastifyContainer'
    })
  }
  return (
    <Stack
      display={'flex'}
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'space-evenly'}
    >
      <Button variant="contained" color="error" onClick={() => expenseModalRef.current.showModal()}>
        New Expense
      </Button>

      <Button
        variant="contained"
        color="success"
        onClick={() => transactionReportRef.current.showModal()}
      >
        Reports
      </Button>

      <Button
        variant="contained"
        color="warning"
        onClick={() => settingModalRef.current.showModal()}
      >
        Settings
      </Button>
    </Stack>
  )
}

export default Actions
