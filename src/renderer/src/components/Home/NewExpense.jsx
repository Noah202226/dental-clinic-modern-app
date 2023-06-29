import { Button, ButtonGroup, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

const NewExpense = ({ expenseModalRef }) => {
  const ipcRenderer = window.ipcRenderer

  const [expenseName, setexpenseName] = useState('')
  const [expenseDate, setexpenseDate] = useState('')
  const [expenseAmount, setexpenseAmount] = useState('')
  const submitExpense = () => {
    const data = {
      expenseName,
      dateTransact: expenseDate,
      amountPaid: expenseAmount
    }

    ipcRenderer.send('new-expense', data)
  }

  useEffect(() => {
    ipcRenderer.on('new-expense-saved', (e, args) => {
      toast.warning('Expense saved', { position: 'bottom-left' })
      setexpenseName('')
      setexpenseDate('')
      setexpenseAmount('')
    })
  }, [])
  return (
    <dialog ref={expenseModalRef} style={{ width: 800, height: 350, padding: 12 }}>
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography variant="h4">New Expense</Typography>
        <Button variant="contained" color="error" onClick={() => expenseModalRef.current.close()}>
          Close
        </Button>
      </Stack>

      <Stack mt={2} p={1}>
        <Stack
          flexDirection={'row'}
          alignItems={'flex-start'}
          justifyContent={'space-between'}
          gap={3}
        >
          <TextField
            type="text"
            helperText="Expense Name"
            value={expenseName}
            onChange={(e) => setexpenseName(e.target.value)}
            fullWidth
          />
          <ButtonGroup fullWidth>
            <Button className="expense-button-grouped" onClick={() => setexpenseName('Meralco')}>
              Meralco
            </Button>
            <Button
              className="expense-button-grouped"
              onClick={() => setexpenseName('Prime Water')}
            >
              Prime Water
            </Button>
            <Button className="expense-button-grouped" onClick={() => setexpenseName('Internet')}>
              Internet
            </Button>
          </ButtonGroup>
        </Stack>
        <TextField
          type="date"
          helperText="Date"
          value={expenseDate}
          onChange={(e) => setexpenseDate(e.target.value)}
        />
        <TextField
          type="number"
          helperText="Amount"
          value={expenseAmount}
          onChange={(e) => setexpenseAmount(e.target.value)}
        />
      </Stack>

      <Button variant="contained" color="info" onClick={submitExpense}>
        Submit
      </Button>
    </dialog>
  )
}

export default NewExpense
