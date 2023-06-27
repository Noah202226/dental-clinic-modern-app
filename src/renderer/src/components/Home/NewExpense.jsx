import { Button, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

const NewExpense = ({ expenseModalRef }) => {
  const ipcRenderer = window.ipcRenderer

  const expenseName = useRef()
  const expenseDate = useRef()
  const expenseAmount = useRef()
  const submitExpense = () => {
    const data = {
      expenseName: expenseName.current.children[0].children[0].value,
      dateTransact: expenseDate.current.children[0].children[0].value,
      amountPaid: expenseAmount.current.children[0].children[0].value
    }

    ipcRenderer.send('new-expense', data)
  }

  useEffect(() => {
    ipcRenderer.on('new-expense-saved', (e, args) => {
      toast.warning('Expense saved', { position: 'bottom-left' })
    })

    expenseName.current.children[0].children[0].value = ''
  }, [])
  return (
    <dialog ref={expenseModalRef} style={{ width: 800, height: 500 }}>
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography variant="h4">New Expense</Typography>
        <Button variant="contained" color="error" onClick={() => expenseModalRef.current.close()}>
          Close
        </Button>
      </Stack>

      <Stack>
        <TextField type="text" helperText="Expense Name" ref={expenseName} />
        <TextField type="date" helperText="Date" ref={expenseDate} />
        <TextField type="number" helperText="Amount" ref={expenseAmount} />
      </Stack>

      <Button variant="contained" color="info" onClick={submitExpense}>
        Submt
      </Button>
    </dialog>
  )
}

export default NewExpense
