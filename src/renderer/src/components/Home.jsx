import {
  Button,
  ButtonGroup,
  Grid,
  IconButton,
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
import SalesInfo from './Home/SalesInfo'
import { ToastContainer, toast } from 'react-toastify'
import { CloseOutlined, DatasetLinked, ImportExport } from '@mui/icons-material'

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
  const [page2, setPage2] = React.useState(0)
  const [rowsPerPage2, setRowsPerPage2] = React.useState(10)

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
  // expense
  const handleChangePageExpense = (event, newPage) => {
    setPage2(newPage)
  }

  const handleChangeRowsPerPageExpense = (event) => {
    setRowsPerPage2(+event.target.value)
    setPage2(0)
  }

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein }
  }

  const [rows, setRows] = useState([])
  const [filterRows, setfilterRows] = useState([])

  const [expenseRows, setexpenseRows] = useState([])
  const [filterExpenseRows, setfilterExpenseRows] = useState([])

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
    ipcRenderer.send('get-filtered-expenses-record', {
      firstDay: firstDayOfMonth,
      lastDay: lastDayOfMonth
    })
  }

  // Export functions
  const exportIt = () => {
    toast.warn('Its not yet work. Sorry', {
      position: 'top-center',
      containerId: 'transactionsNofity'
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

  // Get transaction info
  const [txID, setTxID] = useState()

  // load data
  useEffect(() => {
    // Example usage
    ipcRenderer.send('patients-records')
    ipcRenderer.send('installment-patient-records')

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

    // Getting sales and expenses
    ipcRenderer.send('get-filtered-sales-record', { firstDay, lastDay })
    ipcRenderer.send('get-filtered-expenses-record', { firstDay, lastDay })

    setFirstDayOfMonth(firstDay)
    setLastDayOfMonth(lastDay)

    ipcRenderer.on('filted-sales', (e, args) => {
      const txs = JSON.parse(args)
      setRows(txs)
      setfilterRows(txs)
    })
    ipcRenderer.on('filted-expenses', (e, args) => {
      const txs = JSON.parse(args)
      setexpenseRows(txs)
      setfilterExpenseRows(txs)
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
        style={{ position: 'relative', zIndex: 9999999, width: '100%', height: '100%' }}
      >
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Typography variant="h4">Transactions Report</Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => transactionReportRef.current.close()}
          >
            <CloseOutlined />
            (ESC)
          </Button>
        </Stack>

        <Stack flexDirection={'row'} justifyContent={'space-between'} mt={1}>
          <Stack
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            width={550}
          >
            <Typography variant="h6">Date range:</Typography>
            <TextField
              type="date"
              value={firstDayOfMonth}
              onChange={(e) => setFirstDayOfMonth(e.target.value)}
              size="small"
            />
            <TextField
              type="date"
              size="small"
              value={lastDayOfMonth}
              onChange={(e) => setLastDayOfMonth(e.target.value)}
            />
            <Button variant="contained" size="small" onClick={getDataRange}>
              Get Data
              <DatasetLinked />
            </Button>
          </Stack>

          <Stack>
            <Button variant="contained" color="warning" onClick={exportIt}>
              <ImportExport />
              Export To Excel
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={0.5}>
          <Grid item xs={7}>
            <TableContainer component={Paper} sx={{ mt: 1, height: '100%' }}>
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
                        onClick={() => {
                          saleTransactionRef.current.showModal()
                          setTxID(row._id)
                        }}
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
                            dateStyle: 'short'
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
                  <Stack
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
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
                  <Stack
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
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
          </Grid>

          {/* Expenses */}
          <Grid item xs={5}>
            <TableContainer component={Paper} sx={{ mt: 1, height: '100%' }}>
              <Table sx={{ minWidth: 50, width: '95%' }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Expense Name</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filterExpenseRows
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        onClick={() => {
                          getSalesTransactionInfo(row._id)
                          saleTransactionRef.current.showModal()
                        }}
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
                            dateStyle: 'short'
                          })}
                        </TableCell>
                        <TableCell align="center">{row.expenseName}</TableCell>
                        <TableCell align="right">{row.amountPaid}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <caption style={{ captionSide: 'top' }}>
                  <Stack
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Typography>EXPENSES</Typography>

                    <ButtonGroup size="small" variant="text">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterExpenseRows(expenseRows)
                        }}
                      >
                        All
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterExpenseRows(expenseRows)
                          setfilterExpenseRows((prev) =>
                            prev.filter((sale) => sale.expenseName === 'Meralco')
                          )
                        }}
                      >
                        Meralco
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterExpenseRows(expenseRows)
                          setfilterExpenseRows((prev) =>
                            prev.filter((sale) => sale.expenseName === 'Internet')
                          )
                        }}
                      >
                        Internet
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterExpenseRows(expenseRows)
                          setfilterExpenseRows((prev) =>
                            prev.filter((sale) => sale.expenseName === 'Prime Water')
                          )
                        }}
                      >
                        Prime Water
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </caption>
                <caption style={{ captionSide: 'bottom', textAlign: 'end', fontSize: 18 }}>
                  <Stack
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    <Typography>No. of transaction: {filterExpenseRows.length}</Typography>
                    <Typography>
                      Total Amount: {filterExpenseRows.reduce((a, b) => a + b.amountPaid, 0)}
                    </Typography>
                  </Stack>
                </caption>
              </Table>

              <TablePagination
                rowsPerPageOptions={[1]}
                component="div"
                count={filterExpenseRows.length}
                rowsPerPage={rowsPerPage2}
                page={page2}
                onPageChange={handleChangePageExpense}
                onRowsPerPageChange={handleChangeRowsPerPageExpense}
                labelRowsPerPage=""
                showFirstButton={true}
                showLastButton={true}
              />
            </TableContainer>
          </Grid>
        </Grid>

        <ToastContainer
          autoClose={2000}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          enableMultiContainer
          containerId={'transactionsNofity'}
        />
      </dialog>

      <SalesInfo
        saleTransactionRef={saleTransactionRef}
        txID={txID}
        firstDay={firstDay}
        lastDay={lastDay}
      />

      <NewExpense expenseModalRef={expenseModalRef} />
    </Stack>
  )
}

export default Home
