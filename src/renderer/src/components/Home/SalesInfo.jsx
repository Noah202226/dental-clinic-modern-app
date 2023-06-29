import { Button, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const SalesInfo = ({ saleTransactionRef, txID, firstDay, lastDay }) => {
  const ipcRenderer = window.ipcRenderer

  const [patientName, setpatientName] = useState()
  const [treatmentRendered, settreatmentRendered] = useState()
  const [treatmentType, settreatmentType] = useState()

  const deleteTx = () => {
    ipcRenderer.send('delete-sale-tx', txID)
  }
  const udpateTx = () => {
    const newData = {
      patientName,
      treatmentRendered,
      treatmentType
    }
    ipcRenderer.send('update-sale-tx', { txID, newData })
  }

  useEffect(() => {
    if (txID) {
      ipcRenderer.send('get-sale-tx-info', txID)

      ipcRenderer.on('sale-tx-info', (e, args) => {
        const tx = JSON.parse(args)

        setpatientName(tx.patientName)
        settreatmentRendered(tx.treatmentRendered)
        settreatmentType(tx.treatmentType)
      })

      ipcRenderer.on('tx-deleted', (e, args) => {
        toast.success(args, { position: 'top-center', containerId: 'transactionsNofity' })

        ipcRenderer.send('get-filtered-sales-record', { firstDay, lastDay })
        ipcRenderer.send('get-filtered-expenses-record', { firstDay, lastDay })

        saleTransactionRef.current.close()
      })

      ipcRenderer.on('tx-updated', (e, args) => {
        toast.success(args, { position: 'top-center', containerId: 'transactionsNofity' })

        ipcRenderer.send('get-filtered-sales-record', { firstDay, lastDay })
        ipcRenderer.send('get-filtered-expenses-record', { firstDay, lastDay })

        saleTransactionRef.current.close()
      })
    }
  }, [txID])

  return (
    <dialog ref={saleTransactionRef}>
      <Typography>Sale transaction info - txID: {txID}</Typography>

      <TextField
        type="text"
        label="Patient Name"
        value={patientName}
        onChange={(e) => setpatientName(e.target.value)}
      />
      <TextField
        type="text"
        label="Treatment Rendered"
        value={treatmentRendered}
        onChange={(e) => settreatmentRendered(e.target.value)}
      />
      <TextField
        type="text"
        label="Treatment Type"
        value={treatmentType}
        onChange={(e) => settreatmentType(e.target.value)}
      />

      <Stack flexDirection={'row'}>
        <Button variant="contained" onClick={udpateTx}>
          Update
        </Button>
        <Button variant="contained" color="error" onClick={deleteTx}>
          Delete
        </Button>
      </Stack>
    </dialog>
  )
}

export default SalesInfo
