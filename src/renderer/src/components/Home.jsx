import { Grid, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from './Home/Header'
import PatientList from './Home/PatientList'
import PatientInfo from './Home/PatientInfo'
import Search from './Home/Search'
import Actions from './Home/Actions'

const Home = () => {
  const ipcRenderer = window.ipcRenderer

  const [patientsRecord, setPatientsRecord] = useState([])

  useEffect(() => {
    ipcRenderer.send('patients-records')

    ipcRenderer.on('patients', (e, args) => {
      const data = JSON.parse(args)

      setPatientsRecord([])

      data.forEach((doc) => {
        setPatientsRecord((prevDocuments) => [...prevDocuments, doc])
      })
    })
  }, [])

  return (
    <Stack>
      <Header />

      <Grid container spacing={1} p={1}>
        <Grid item xs={8}>
          <Search />
        </Grid>

        <Grid item xs={4}>
          <Actions />
        </Grid>
      </Grid>

      <Grid container spacing={1} p={1}>
        <Grid item xs={6}>
          <PatientList />
        </Grid>

        <Grid item xs={6}>
          <PatientInfo patients={patientsRecord} />
        </Grid>
      </Grid>
    </Stack>
  )
}

export default Home