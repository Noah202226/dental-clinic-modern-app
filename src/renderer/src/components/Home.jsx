import { Grid, Stack } from '@mui/material'
import React from 'react'
import Header from './Home/Header'
import PatientList from './Home/PatientList'
import PatientInfo from './Home/PatientInfo'

const Home = () => {
  return (
    <Stack>
      <Header />

      <Grid container spacing={1} p={1}>
        <Grid item xs={6}>
          <PatientList />
        </Grid>

        <Grid item xs={6}>
          <PatientInfo />
        </Grid>
      </Grid>
    </Stack>
  )
}

export default Home
