import { Button, Stack } from '@mui/material'
import React from 'react'

const Actions = () => {
  return (
    <Stack
      display={'flex'}
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'space-evenly'}
    >
      <Button variant="contained" color="error">
        New Expense
      </Button>

      <Button variant="contained" color="success">
        Sales report
      </Button>

      <Button variant="contained" color="warning">
        Settings
      </Button>
    </Stack>
  )
}

export default Actions
