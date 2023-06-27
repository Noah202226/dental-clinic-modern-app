import {
  Button,
  ButtonGroup,
  Grid,
  Stack,
  TablePagination,
  TextField,
  Typography
} from '@mui/material'
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
import NewExpense from './Home/NewExpense'

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

  // Sale Transaction refs
  const saleTransactionRef = useRef()

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

  const [rows, setRows] = useState([])
  const [filterRows, setfilterRows] = useState([])

  // Expense Ref
  const expenseModalRef = useRef()

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
      setfilterRows(txs)
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
          <Actions transactionReportRef={transactionReportRef} expenseModalRef={expenseModalRef} />
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
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Typography variant="h4">Transactions Report</Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => transactionReportRef.current.close()}
          >
            Close
          </Button>
        </Stack>

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

        <TableContainer component={Paper} sx={{ width: 850, mt: 2 }}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
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
              {filterRows
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    onClick={() => saleTransactionRef.current.showModal()}
                    key={row._id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': { background: 'rgba(10,10,60,0.2)', color: 'whitesmoke' }
                    }}
                  >
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
            <caption style={{ captionSide: 'top' }}>
              <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography>SALES</Typography>
                <ButtonGroup size="small" variant="text">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setfilterRows(rows)
                    }}
                  >
                    All
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setfilterRows(rows)
                      setfilterRows((prev) =>
                        prev.filter((sale) => sale.treatmentRendered === 'oral-prophylaxis')
                      )
                    }}
                  >
                    Oral Prophylaxis
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setfilterRows(rows)
                      setfilterRows((prev) =>
                        prev.filter((sale) => sale.treatmentRendered === 'oral-surgery')
                      )
                    }}
                  >
                    Oral Surgery
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setfilterRows(rows)
                      setfilterRows((prev) =>
                        prev.filter((sale) => sale.treatmentRendered === 'restorative')
                      )
                    }}
                  >
                    Restorative
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setfilterRows(rows)
                      setfilterRows((prev) =>
                        prev.filter((sale) => sale.treatmentRendered === 'prosthodontics')
                      )
                    }}
                  >
                    Prosthodontics
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setfilterRows(rows)
                      setfilterRows((prev) =>
                        prev.filter((sale) => sale.treatmentRendered === 'orthodontics')
                      )
                    }}
                  >
                    Orthodontics
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setfilterRows(rows)
                      setfilterRows((prev) =>
                        prev.filter((sale) => sale.treatmentRendered === 'endodontics')
                      )
                    }}
                  >
                    Endodontics
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setfilterRows(rows)
                      setfilterRows((prev) =>
                        prev.filter((sale) => sale.treatmentRendered === 'cosmetics')
                      )
                    }}
                  >
                    Cosmetics
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setfilterRows(rows)
                      setfilterRows((prev) =>
                        prev.filter((sale) => sale.treatmentRendered === 'check-up')
                      )
                    }}
                  >
                    Check Up
                  </Button>
                </ButtonGroup>
              </Stack>
            </caption>
            <caption style={{ captionSide: 'bottom', textAlign: 'end', fontSize: 18 }}>
              <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography>No. of transaction: {filterRows.length}</Typography>
                <Typography>
                  Total Amount: {filterRows.reduce((a, b) => a + b.amountPaid, 0)}
                </Typography>
              </Stack>
            </caption>
          </Table>

          <TablePagination
            rowsPerPageOptions={[-1]}
            component="div"
            count={filterRows.length}
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

      <dialog ref={saleTransactionRef}>
        <Typography>Sale transaction info</Typography>
      </dialog>

      <NewExpense expenseModalRef={expenseModalRef} />
    </Stack>
  )
}

export default Home
