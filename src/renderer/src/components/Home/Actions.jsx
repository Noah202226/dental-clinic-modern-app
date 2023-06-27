import { Button, Stack } from '@mui/material'
import React from 'react'

const Actions = ({ transactionReportRef, expenseModalRef }) => {
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

      <Button variant="contained" color="warning">
        Settings
      </Button>
    </Stack>
  )
}

export default Actions
