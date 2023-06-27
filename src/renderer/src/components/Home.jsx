import { Button, Grid, Stack, TablePagination, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Header from './Home/Header'
import PatientList from './Home/PatientList'
import PatientInfo from './Home/PatientInfo'
import Search from './Home/Search'
import Actions from './Home/Actions'

// tables
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

const Home = () => {
  const ipcRenderer = window.ipcRenderer

  const [patientsRecord, setPatientsRecord] = useState([])
  const [installmentPatients, setInstallmentPatients] = useState([])

  const [search, setsearch] = useState('')
  const [filterPatientsData, setFilterPatientsData] = useState([])
  const [filteredInstallmentPatientsData, setFilteredInstallmentPatientsData] = useState([])

  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Transaction refs
  const transactionReportRef = useRef()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [firstDayOfMonth, setFirstDayOfMonth] = useState()
  const [lastDayOfMonth, setLastDayOfMonth] = useState()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein }
  }

  const [rows, setRows] = useState([
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),

    createData('Frozen yoghurt2', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich2', 237, 9.0, 37, 4.3),
    createData('Eclair2', 262, 16.0, 24, 6.0),
    createData('Cupcake2', 305, 3.7, 67, 4.3),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),

    createData('Frozen yoghurt2', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich2', 237, 9.0, 37, 4.3),
    createData('Eclair2', 262, 16.0, 24, 6.0),
    createData('Cupcake2', 305, 3.7, 67, 4.3),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),

    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),

    createData('Frozen yoghurt2', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich2', 237, 9.0, 37, 4.3),
    createData('Eclair2', 262, 16.0, 24, 6.0),
    createData('Cupcake2', 305, 3.7, 67, 4.3),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),

    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Frozen yoghurt2', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich2', 237, 9.0, 37, 4.3),
    createData('Eclair2', 262, 16.0, 24, 6.0),
    createData('Cupcake2', 305, 3.7, 67, 4.3),
    createData('Gingerbread2', 356, 16.0, 49, 3.9),

    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),

    createData('Frozen yoghurt2', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich2', 237, 9.0, 37, 4.3),
    createData('Eclair2', 262, 16.0, 24, 6.0),
    createData('Cupcake2', 305, 3.7, 67, 4.3),
    createData('Gingerbread2', 356, 16.0, 49, 3.9)
  ])

  // Date
  const getFirstAndLastDayOfMonth = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1 // Adding 1 since getMonth() returns zero-based month

    // Formatting the first day of the month
    const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`

    // Calculating the last day of the month
    const lastDay = `${year}-${month.toString().padStart(2, '0')}-${new Date(
      year,
      month,
      0
    ).getDate()}`

    return { firstDay, lastDay }
  }

  const { firstDay, lastDay } = getFirstAndLastDayOfMonth()

  const getDataRange = () => {
    // setGoFilter(!goFilter)

    console.log(firstDay, lastDay)
    console.log(firstDayOfMonth, lastDayOfMonth)
    ipcRenderer.send('get-filtered-sales-record', {
      firstDay: firstDayOfMonth,
      lastDay: lastDayOfMonth
    })
  }

  // search
  useEffect(() => {
    if (isInitialLoad) {
      // Skip running the code on the initial load
      setIsInitialLoad(false)
      return
    }

    const filteredPatients = patientsRecord.filter((patient) =>
      patient.patientName.toLowerCase().includes(search.toLowerCase())
    )
    const filteredInstallmentPatients = installmentPatients.filter((patient) =>
      patient.patientName.toLowerCase().includes(search.toLowerCase())
    )

    setFilterPatientsData(filteredPatients)
    setFilteredInstallmentPatientsData(filteredInstallmentPatients)
  }, [search])

  // load data
  useEffect(() => {
    // Example usage
    ipcRenderer.send('patients-records')
    ipcRenderer.send('installment-patient-records')
    ipcRenderer.send('get-filtered-sales-record', { firstDay, lastDay })

    setFirstDayOfMonth(firstDay)
    setLastDayOfMonth(lastDay)

    ipcRenderer.on('patients', (e, args) => {
      const data = JSON.parse(args)

      setPatientsRecord([])

      data.forEach((doc) => {
        setPatientsRecord((prevDocuments) => [...prevDocuments, doc])
      })
    })

    ipcRenderer.on('installment-patients', (e, args) => {
      const data = JSON.parse(args)
      console.log(data)

      setInstallmentPatients([])

      data.forEach((doc) => {
        setInstallmentPatients((prevDocuments) => [...prevDocuments, doc])
      })
    })

    ipcRenderer.on('filted-sales', (e, args) => {
      const txs = JSON.parse(args)
      setRows(txs)
    })
  }, [])

  return (
    <Stack>
      <Header />

      <Grid container spacing={1} p={1}>
        <Grid item xs={8}>
          <Search search={search} setsearch={setsearch} />
        </Grid>

        <Grid item xs={4}>
          <Actions transactionReportRef={transactionReportRef} />
        </Grid>
      </Grid>

      <Grid container spacing={1} p={1}>
        <Grid item xs={6}>
          <PatientList
            patients={search === '' ? installmentPatients : filteredInstallmentPatientsData}
          />
        </Grid>

        <Grid item xs={6}>
          <PatientInfo patients={search === '' ? patientsRecord : filterPatientsData} />
        </Grid>
      </Grid>

      <dialog
        ref={transactionReportRef}
        style={{ position: 'relative', zIndex: 9999999, width: 1300, height: 700 }}
      >
        <Typography variant="h4">Transactions Report</Typography>

        <Stack flexDirection={'row'}>
          <TextField
            type="date"
            value={firstDayOfMonth}
            onChange={(e) => setFirstDayOfMonth(e.target.value)}
          />
          <TextField
            type="date"
            value={lastDayOfMonth}
            onChange={(e) => setLastDayOfMonth(e.target.value)}
          />
          <Button variant="contained" onClick={getDataRange}>
            Get date
          </Button>
        </Stack>

        <TableContainer component={Paper} sx={{ width: 700, mt: 2 }}>
          <Typography variant="h5" textAlign={'center'}>
            Sales
          </Typography>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <caption style={{ captionSide: 'top' }}>A basic table example with a caption</caption>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="center">Patient Name</TableCell>
                <TableCell align="right">Treatment Rendered</TableCell>
                <TableCell align="right">Treatment Type</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {new Date(row?.dateTransact).toLocaleString(undefined, {
                      // year: '2-digit',
                      // month: '2-digit',
                      // day: '2-digit',
                      dateStyle: 'long'
                    })}
                  </TableCell>
                  <TableCell align="center">{row.patientName}</TableCell>
                  <TableCell align="right">{row.treatmentRendered}</TableCell>
                  <TableCell align="right">{row.treatmentType}</TableCell>
                  <TableCell align="right">{row.amountPaid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[-1]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage=""
            showFirstButton={true}
            showLastButton={true}
          />
        </TableContainer>
      </dialog>
    </Stack>
  )
}

export default Home
