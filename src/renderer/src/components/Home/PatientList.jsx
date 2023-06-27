import {
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

const PatientList = ({ patients }) => {
  const ipcRenderer = window.ipcRenderer

  const newPatientRef = useRef()
  const patientInfoRef = useRef()

  const [selectedTreatment, setSelectedTreatment] = useState('')
  const [options, setOptions] = useState([])

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    setSelectedTreatment(selectedValue)

    // Update options based on the selected value
    const updatedOptions = getUpdatedOptions(selectedValue)
    setOptions(updatedOptions)
  }

  const getUpdatedOptions = (selectedValue) => {
    // Perform the logic to retrieve the updated options based on the selected value
    // This can involve making an API call or accessing a predefined set of options
    console.log(selectedValue)
    // Return the updated options
    switch (selectedValue) {
      case 'oral-prophylaxis':
        return ['With Flouride', 'Without Flouride', 'Medical Certificate', 'Moral Bond']
      case 'oral-surgery':
        return ['Extraction', 'Surgery', 'Medicine', 'X-ray']
      case 'prosthodontics':
        return ['Jacket Crown', 'Denture']
      case 'orthodontics':
        return ['Brace Removal', 'Retainer', 'Brace Replacement/Moral Band']
      case 'restorative':
        return ['Anterior', 'Posterior Co', 'Posterior Gic']
      case 'endodontics':
        return ['X-ray', 'Post & Core', 'Anterior', 'Posterior']
      case 'cosmetics':
        return ['Veneers', 'Whitening']
      case 'check-up':
        return ['Checkup']
      default:
        return []
    }
  }

  // Input Refs
  const dateTransactRef = useRef()

  const patientNameRef = useRef()
  const patientAddresRef = useRef()
  const ageRef = useRef()

  const treatmentTypeRef = useRef()

  const servicePriceRef = useRef()
  const downpaymentRef = useRef()

  // Input States
  const [dateTransact, setdateTransact] = useState()

  const [patientID, setPatientID] = useState()

  const [newTrasactionDate, setnewTrasactionDate] = useState()
  const [newTransactionAmount, setNewTransactionAmount] = useState()

  const [patientName, setPatientName] = useState('')
  const [patientAddress, setPatientAddress] = useState('')
  const [age, setAge] = useState('')

  const [treatmentRendered, setTreatmentRendered] = useState()
  const [treatmentType, setTreatmentType] = useState()

  const [servicePrice, setServicePrice] = useState()
  const [downpayment, setdownpayment] = useState()

  const [gives, setGives] = useState([])
  const [updatedGives, setUpdatedGives] = useState([])
  const [remainingBal, setremainingBal] = useState()

  const submitPatient = () => {
    // console.log(treatmentTypeRef.current.children[0].value)
    const data = {
      dateTransact: dateTransactRef.current.children[0].children[0].value,
      patientName: patientNameRef.current.children[1].children[0].value,
      patientAge: ageRef.current.children[1].children[0].value,
      patientAddress: patientAddresRef.current.children[1].children[0].value,
      treatmentRendered: selectedTreatment,
      treatmentType: treatmentTypeRef.current.children[0].value,
      servicePrice: servicePriceRef.current.children[1].children[0].value,
      initialPay: downpaymentRef.current.children[1].children[0].value,
      remainingBal:
        servicePriceRef.current.children[1].children[0].value -
        downpaymentRef.current.children[1].children[0].value,
      gives: []
    }

    const sale = {
      dateTransact: dateTransactRef.current.children[0].children[0].value,
      patientName: patientNameRef.current.children[1].children[0].value,
      treatmentRendered: selectedTreatment,
      treatmentType: treatmentTypeRef.current.children[0].value,
      amountPaid: downpaymentRef.current.children[1].children[0].value
    }

    ipcRenderer.send('new-sale-record', sale)
    ipcRenderer.send('new-installment-patient', data)
  }

  const getPatientInfo = (id, fullName) => {
    console.log(id)

    ipcRenderer.send('get-installment-patient-info', id)
    patientInfoRef.current.showModal()
  }

  const updateData = () => {
    console.log('updating...')
  }
  const deleteInstallmentPatient = () => {
    console.log('deleting ...')
    ipcRenderer.send('delete-installment-patient', patientID)
  }

  const submitNewGive = () => {
    setGives((prev) => [
      ...prev,
      { givenDate: newTrasactionDate, amountGive: newTransactionAmount }
    ])
    setUpdatedGives((prev) => [
      ...prev,
      { givenDate: newTrasactionDate, amountGive: newTransactionAmount }
    ])

    // const sale = {
    //   dateTransact: newTrasactionDate,
    //   patientName: patientName,
    //   treatmentRendered: treatmentRendered,
    //   treatmentType: treatmentType,
    //   amountPaid: newTransactionAmount,
    // }
    // ipcRenderer.send('new-sale-record', sale)
  }

  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (isInitialLoad) {
      // Skip running the code on the initial load
      setIsInitialLoad(false)
      return
    }

    ipcRenderer.send('update-installment-patient-gives', {
      patientID,
      gives: updatedGives,
      remainingBal: remainingBal - newTransactionAmount
    })
    const sale = {
      dateTransact: newTransactionAmount,
      patientName: patientName,
      treatmentRendered: treatmentRendered,
      treatmentType: treatmentType,
      amountPaid: newTransactionAmount
    }

    ipcRenderer.send('new-sale-record', sale)

    setremainingBal(remainingBal - newTransactionAmount)
  }, [updatedGives])

  useEffect(() => {
    ipcRenderer.on('installment-patient-saved', (e, args) => {
      ipcRenderer.send('patients-records')
      ipcRenderer.send('installment-patient-records')
      toast.success(args, { position: 'bottom-right' })

      newPatientRef.current.close()
    })

    ipcRenderer.on('installment-patient-info', (e, args) => {
      const installmentPatientInfo = JSON.parse(args)

      console.log(installmentPatientInfo)

      setPatientID(installmentPatientInfo._id)
      setdateTransact(installmentPatientInfo.dateTransact)
      setPatientName(installmentPatientInfo.patientName)
      setPatientAddress(installmentPatientInfo.patientAddress)
      setAge(installmentPatientInfo.patientAge)

      setTreatmentRendered(installmentPatientInfo.treatmentRendered)
      setTreatmentType(installmentPatientInfo.treatmentType)

      setServicePrice(installmentPatientInfo.servicePrice)
      setdownpayment(installmentPatientInfo.initialPay)

      setGives(installmentPatientInfo.gives)
      setremainingBal(installmentPatientInfo.remainingBal)
    })

    ipcRenderer.on('installment-patient-deleted', (e, args) => {
      toast.success('Patient Deleted', { position: 'bottom-right' })

      setPatientID('')
      setdateTransact('')
      setPatientName('')
      setPatientAddress('')
      setAge('')

      setTreatmentRendered('')
      setTreatmentType('')

      setServicePrice('')
      setdownpayment('')

      setremainingBal('')

      ipcRenderer.send('patients-records')
      ipcRenderer.send('installment-patient-records')

      patientInfoRef.current.close()
    })

    ipcRenderer.on('installment-patient-gives-updated', (e, args) => {
      toast.success('Patient gives updated.', { position: 'bottom-right' })

      ipcRenderer.send('patients-records')
      ipcRenderer.send('installment-patient-records')

      ipcRenderer.send('get-installment-patient-info', patientID)
    })
  }, [])
  return (
    <>
      <Paper sx={{ background: 'green', padding: 1 }}>
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant="h4">Patient List</Typography>
          <Button
            variant="contained"
            onClick={() => {
              newPatientRef.current.showModal()
              newPatientRef.current.classList.add('show')
            }}
          >
            New
          </Button>
        </Stack>

        {patients.map((patient) => (
          <Card
            key={patient._id}
            sx={{
              mb: 1,
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '4px 4px 8px 4px rgba(20,50,80,5)',
                marginLeft: 1
              }
            }}
            onClick={() => getPatientInfo(patient._id, patient.patientName)}
          >
            <Stack display={'flex'} alignItems={'start'} justifyContent={'space-around'}>
              <Stack flexDirection={'row'} p={1} m={0}>
                <Typography variant="h6">Patient Name:</Typography>
                <Typography variant="h5" color={'indigo'} ml={2}>
                  {patient.patientName}
                </Typography>
              </Stack>

              <Grid container>
                <Grid item xs={6}>
                  <Stack flexDirection={'row'} p={1} mt={-2}>
                    <Typography variant="body">Address:</Typography>
                    <Typography variant="caption2" color={'indigo'} ml={2}>
                      {patient.patientAddress}
                    </Typography>
                  </Stack>

                  <Stack flexDirection={'row'} p={1} mt={-2}>
                    <Typography variant="body">Age:</Typography>
                    <Typography variant="caption2" color={'indigo'} ml={2}>
                      {patient.patientAge}
                    </Typography>
                  </Stack>

                  <Stack flexDirection={'row'} p={1} mt={-2}>
                    <Typography variant="body">Treatment Rendered: </Typography>
                    <Typography
                      variant="caption2"
                      color={'indigo'}
                      ml={2}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {patient.treatmentRendered}
                    </Typography>
                  </Stack>
                  <Stack flexDirection={'row'} p={1} mt={-2}>
                    <Typography variant="body">Treatment Type: </Typography>
                    <Typography
                      variant="caption2"
                      color={'indigo'}
                      ml={2}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {patient.treatmentType}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={6} container>
                  <Stack flexDirection={'row'} p={1} mt={-2}>
                    <Typography variant="body">Service Price:</Typography>
                    <Typography variant="caption2" color={'indigo'} ml={2}>
                      {patient.servicePrice}
                    </Typography>
                  </Stack>

                  <Stack flexDirection={'row'} p={1} mt={-2}>
                    <Typography variant="body">Downpayment: </Typography>
                    <Typography variant="caption2" color={'indigo'} ml={2}>
                      {patient.initialPay}
                    </Typography>
                  </Stack>

                  <Stack flexDirection={'row'} p={1} mt={-2}>
                    <Typography variant="body">Total Gives: </Typography>
                    <Typography
                      variant="caption2"
                      color={'indigo'}
                      ml={2}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {patient.gives?.reduce((a, b) => a + b.amountGive, 0)}
                    </Typography>
                  </Stack>

                  <Stack flexDirection={'row'} p={1} mt={-2}>
                    <Typography variant="body">Remaining Balance: </Typography>
                    <Typography
                      variant="caption2"
                      color={'indigo'}
                      ml={2}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {patient.remainingBal}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Card>
        ))}
      </Paper>

      {/* New Patient Installment */}
      <dialog
        ref={newPatientRef}
        style={{ position: 'relative', zIndex: 9999999, width: 800, height: 700 }}
      >
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant="h4">Patient Transactions</Typography>
          <Button variant="contained" color="error" onClick={() => newPatientRef.current.close()}>
            Close
          </Button>
        </Stack>

        <Stack>
          <TextField type="date" ref={dateTransactRef} />
        </Stack>

        <Stack sx={{ width: '100%', height: 150 }}>
          <img src="../../resources/dentist.svg" alt="sample image" />
        </Stack>

        <Stack>
          <TextField type="text" label="Patient Name" ref={patientNameRef} />
          <TextField type="text" label="Address" ref={patientAddresRef} />
          <TextField type="number" label="Age" ref={ageRef} />
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
            <Select
              onChange={handleSelectChange}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedTreatment}
              native
              sx={{ position: 'relative', zIndex: 2, width: 200 }}
              fullWidth
            >
              {/* <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem> */}

              <option value={'oral-prophylaxis'}>Oral Prophylaxis</option>
              <option value={'oral-surgery'}>Oral Surgery</option>
              <option value={'prosthodontics'}>Prosthodontics</option>
              <option value={'orthodontics'}>Orthodontics</option>
              <option value={'restorative'}>Restorative</option>
              <option value={'endodontics'}>Endodontics</option>
              <option value={'cosmetics'}>Cosmetics</option>
              <option value={'check-up'}>Checkup</option>
            </Select>

            <FormHelperText>Treatment Rendered</FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              native
              sx={{ position: 'relative', zIndex: 2, width: 200 }}
              fullWidth
              ref={treatmentTypeRef}
            >
              {/* <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem> */}

              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Select>

            <FormHelperText>Treatment Type</FormHelperText>
          </FormControl>
        </Stack>

        <Stack>
          <TextField type="number" label="Service Price" ref={servicePriceRef} />
          <TextField type="number" label="Downpayment" ref={downpaymentRef} />
        </Stack>

        <Button variant="contained" color="info" onClick={submitPatient}>
          Submit
        </Button>
      </dialog>

      {/* Patient Installment Info*/}
      <dialog
        ref={patientInfoRef}
        style={{ position: 'relative', zIndex: 9999999, width: 1250, height: 700 }}
      >
        <Grid container>
          <Grid item xs={5}>
            <Card sx={{ p: 1 }}>
              <Stack flexDirection={'row'} justifyContent={'space-between'}>
                <Typography variant="h6">New Give</Typography>

                <Button variant="contained" color="info" onClick={submitNewGive}>
                  Submit
                </Button>
              </Stack>

              <Stack flexDirection={'row'} justifyContent={'space-between'}>
                <TextField
                  type="date"
                  label="Date"
                  fullWidth
                  value={newTrasactionDate}
                  onChange={(e) => setnewTrasactionDate(e.target.value)}
                />
                <TextField
                  type="number"
                  label="Amount"
                  value={newTransactionAmount}
                  onChange={(e) => setNewTransactionAmount(e.target.value)}
                />
              </Stack>

              <Stack flexDirection={'row'} justifyContent={'space-between'}>
                <Typography variant="body">No. of Gives: {gives.length}</Typography>
                <Typography variant="body">
                  Total amount given: {gives?.reduce((a, b) => a + parseInt(b.amountGive), 0)}
                </Typography>
                <Typography variant="body">Remaining amount: {remainingBal}</Typography>
              </Stack>
            </Card>

            <Typography variant="h6">Patient Gives</Typography>

            {gives.map((give) => (
              <Card key={give.givenDate + 1}>
                <Typography variant="h6">{give.givenDate}</Typography>
                <Typography variant="h6">{give.amountGive}</Typography>
              </Card>
            ))}
          </Grid>

          <Grid item xs={7}>
            <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography variant="h6">Patient Transactions - {patientID}</Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => patientInfoRef.current.close()}
              >
                Close
              </Button>
            </Stack>

            <Stack>
              <Typography variant="h6">
                {new Date(dateTransact).toLocaleString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Stack>

            <Stack sx={{ width: '100%', height: 150 }}>
              <img src="../../resources/dentist.svg" alt="sample image" />
            </Stack>

            <Stack>
              <TextField
                type="text"
                label="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
              <TextField
                type="text"
                label="Address"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
              />
              <TextField
                type="number"
                label="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'start'}
              justifyContent={'space-between'}
              mb={1}
            >
              <TextField
                type="text"
                label="Treatment Rendered"
                value={treatmentRendered}
                className="capitalize"
                onChange={(e) => setTreatmentRendered(e.target.value)}
              />
              <TextField
                type="text"
                label="Treatment Type"
                value={treatmentType}
                onChange={(e) => setTreatmentType(e.target.value)}
              />
            </Stack>

            <Stack>
              <TextField
                type="number"
                label="Service Price"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
              />
              <TextField
                type="number"
                label="Downpayment"
                value={downpayment}
                onChange={(e) => setdownpayment(e.target.value)}
              />
            </Stack>

            <Button variant="contained" color="info" onClick={updateData}>
              Update
            </Button>
            <Button variant="contained" color="info" onClick={deleteInstallmentPatient}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </dialog>
    </>
  )
}

export default PatientList
