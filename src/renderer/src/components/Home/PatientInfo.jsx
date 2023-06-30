import {
  Badge,
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const PatientInfo = ({ patients }) => {
  const ipcRenderer = window.ipcRenderer

  const [dateNow, setDateNow] = useState('')
  useEffect(() => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate().toString().padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    setDateNow(formattedDate)
  }, [])

  const newPatientButtonRef = useRef()
  const patientInfoRef = useRef()

  const [selectedTreatment, setSelectedTreatment] = useState('Oral Prophylaxis')
  const [options, setOptions] = useState([])

  const [patientInfo, setPatientInfo] = useState('')
  const [patientTransactions, setPatientTransactions] = useState([])

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

  // inputs ref on new patient dialog
  const surnameRef = useRef()
  const givenNameRef = useRef()
  const middleNameRef = useRef()

  const ageRef = useRef()
  const [genderRef, setGenderRef] = useState('')

  const birthPlaceRef = useRef()
  const nationalityRef = useRef()
  const civilStatusRef = useRef()

  const occupationRef = useRef()
  const homeAddressRef = useRef()
  const personalContactRef = useRef()

  const emergencyToContactRef = useRef()
  const relationRef = useRef()
  const emergencyToContactNoRef = useRef()

  const medicalHistoryRef = useRef()

  const amountRef = useRef()

  const treatmentTypeRef = useRef()

  // // inputs ref on patient info
  const [fullName, setfullName] = useState('')

  const [age, setage] = useState('')
  const [gender, setgender] = useState('')

  const [birthPlace, setbirthPlace] = useState('')
  const [nationality, setnationality] = useState('')
  const [civilStatus, setcivilStatus] = useState('')

  const [occupation, setoccupation] = useState('')
  const [homeAddress, sethomeAddress] = useState('')
  const [personalContact, setpersonalContact] = useState('')

  const [emergencyToContact, setemergencyToContact] = useState('')
  const [emergencyRelation, setemergencyRelation] = useState('')
  const [emergencyToContactNo, setemergencyToContactNo] = useState('')

  const [medicalHistory, setmedicalHistory] = useState('')

  const [amount, setamount] = useState('')

  const [treatmentType, settreatmentType] = useState('')

  // Submit
  const submitForm = (e) => {
    e.preventDefault()

    const patientData = {
      dateTransact: dateNow,
      patientName: `${givenNameRef.current.children[1].children[0].value} ${middleNameRef.current.children[1].children[0].value} ${surnameRef.current.children[1].children[0].value}`,
      patientAge: ageRef.current.children[1].children[0].value,
      patientGender: genderRef,
      placeOfBirth: birthPlaceRef.current.children[1].children[0].value,
      nationality: nationalityRef.current.children[1].children[0].value,
      civilStatus: civilStatusRef.current.children[1].children[0].value,
      occupation: occupationRef.current.children[1].children[0].value,
      address: homeAddressRef.current.children[1].children[0].value,
      personalContact: personalContactRef.current.children[1].children[0].value,
      emergencyToContact: emergencyToContactRef.current.children[1].children[0].value,
      emergencyRelation: relationRef.current.children[1].children[0].value,
      emergencyToContactNo: emergencyToContactNoRef.current.children[1].children[0].value,
      medicalHistory: medicalHistoryRef.current.children[1].children[0].value
    }
    const sale = {
      dateTransact: dateNow,
      patientName: `${givenNameRef.current.children[1].children[0].value} ${middleNameRef.current.children[1].children[0].value} ${surnameRef.current.children[1].children[0].value}`,
      treatmentRendered: selectedTreatment,
      treatmentType: treatmentTypeRef.current.children[0].children[0].value,
      amountPaid: amountRef.current.children[0].children[0].value
    }

    console.log(patientData)
    // console.log(sale)

    ipcRenderer.send('new-patient-record', patientData)
    ipcRenderer.send('new-sale-record', sale)
    ipcRenderer.send('patients-records')

    newPatientButtonRef.current.close()

    // Reset fields
    givenNameRef.current.children[1].children[0].value = ''
    middleNameRef.current.children[1].children[0].value = ''
    surnameRef.current.children[1].children[0].value = ''
    ageRef.current.children[1].children[0].value = ''
    setGenderRef('male')
    birthPlaceRef.current.children[1].children[0].value = ''
    nationalityRef.current.children[1].children[0].value = ''
    civilStatusRef.current.children[1].children[0].value = ''
    occupationRef.current.children[1].children[0].value = ''
    homeAddressRef.current.children[1].children[0].value = ''
    personalContactRef.current.children[1].children[0].value = ''
    emergencyToContactRef.current.children[1].children[0].value = ''
    relationRef.current.children[1].children[0].value = ''
    emergencyToContactNoRef.current.children[1].children[0].value = ''
    medicalHistoryRef.current.children[1].children[0].value = ''

    setSelectedTreatment('Oral Prophylaxis')
    amountRef.current.children[0].children[0].value = ''
    treatmentTypeRef.current.children[0].children[0].value = ''
  }

  const newTransactionOnly = () => {
    if (treatmentTypeRef.current.children[0].children[0].value === '') {
      toast.warn('Please select treatment type', {
        position: 'bottom-right',
        containerId: 'patientInfoNotify'
      })
    }

    const sale = {
      dateTransact: dateNow,
      patientName: fullName,
      treatmentRendered: selectedTreatment,
      treatmentType: treatmentTypeRef.current.children[0].children[0].value,
      amountPaid: amount
    }
    ipcRenderer.send('new-sale-record', sale)
    ipcRenderer.send('get-sales-record', fullName)
    ipcRenderer.send('patients-records')
  }

  const getPatientInfo = (id, fullName) => {
    ipcRenderer.send('get-patient-info', id)
    ipcRenderer.send('get-sales-record', fullName)
    patientInfoRef.current.showModal()
  }

  const deletePatient = () => {
    ipcRenderer.send('delete-patient', patientInfo._id)
  }

  // Update Patient Info
  const updatePatientnfo = () => {
    const id = patientInfo._id

    const updatedData = {
      patientName: fullName,
      patientAge: parseInt(age),
      patientGender: gender,
      placeOfBirth: birthPlace,
      nationality,
      civilStatus,
      occupation,
      address: homeAddress,
      personalContact,
      emergencyToContact,
      emergencyRelation,
      emergencyToContactNo,
      medicalHistory
    }
    console.log(id, updatedData)

    ipcRenderer.send('update-patient-info', { id, updatedData })
  }

  useEffect(() => {
    ipcRenderer.on('patient-info', (e, args) => {
      const data = JSON.parse(args)
      setPatientInfo(data)

      setfullName(data.patientName)
      setage(data.patientAge)
      setgender(data.patientGender)
      setGenderRef(data.patientGender)

      setbirthPlace(data.placeOfBirth)
      setnationality(data.nationality)
      setcivilStatus(data.civilStatus)

      setoccupation(data.occupation)
      sethomeAddress(data.address)
      setpersonalContact(data.personalContact)

      setemergencyToContact(data.emergencyToContact)
      setemergencyRelation(data.emergencyRelation)
      setemergencyToContactNo(data.emergencyToContactNo)

      setmedicalHistory(data.medicalHistory)
    })

    ipcRenderer.on('new-patient-record-saved', (e, args) => {
      toast.success(args, {
        position: 'bottom-right',
        containerId: 'homeToastifyContainer'
      })

      ipcRenderer.send('patients-records')
    })

    ipcRenderer.on('patient-deleted', (e, args) => {
      patientInfoRef.current.close()

      toast.success('Patient Deleted.', {
        position: 'bottom-right',
        containerId: 'homeToastifyContainer'
      })

      ipcRenderer.send('patients-records')
    })

    ipcRenderer.on('patient-updated', (e, args) => {
      patientInfoRef.current.close()

      toast.success('Patient Info Updated.', {
        position: 'bottom-right',
        containerId: 'homeToastifyContainer'
      })

      ipcRenderer.send('patients-records')
    })

    ipcRenderer.on('sales-record', (e, args) => {
      const data = JSON.parse(args)

      setPatientTransactions(data)
    })
  }, [])
  return (
    <>
      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant="h5">Patient Records</Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => newPatientButtonRef.current.showModal()}
        >
          New
        </Button>
      </Stack>
      <Paper
        className="scrollable-div"
        sx={{ background: 'rgba(50,200,150, 0.5)', padding: 1, overflow: 'auto', height: 454 }}
      >
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
                <Typography variant="h5" color={'indigo'}>
                  {patient.patientName}
                </Typography>
              </Stack>

              <Stack flexDirection={'row'} p={1} mt={-3}>
                <Typography variant="body">Address:</Typography>
                <Typography variant="caption2" color={'indigo'}>
                  {patient.address}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Paper>

      {/* New Patient Dialog */}
      <dialog
        ref={newPatientButtonRef}
        style={{ position: 'relative', zIndex: 9999999, width: 1000, height: 700 }}
      >
        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <Typography variant="h6">Patient Record</Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => newPatientButtonRef.current.close()}
          >
            Close
          </Button>
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <TextField type="text" label="Surname" ref={surnameRef} />
          <TextField type="text" label="Given Name" ref={givenNameRef} />
          <TextField type="text" label="Middle Name" ref={middleNameRef} />
        </Stack>

        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={1}>
          <TextField type="number" label="Age" ref={ageRef} />

          <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              native
              sx={{ position: 'relative', zIndex: 2, width: 200 }}
              value={genderRef}
              onChange={(e) => setGenderRef(e.target.value)}
            >
              <option value={'male'}>MALE</option>
              <option value={'female'}>FEMALE</option>
            </Select>
          </FormControl>
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <TextField type="text" label="Birth Place" ref={birthPlaceRef} />
          <TextField type="text" label="Nationality" ref={nationalityRef} />
          <TextField type="text" label="Civil Status" ref={civilStatusRef} />
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <TextField type="text" label="Occupation" ref={occupationRef} />
          <TextField type="text" label="Home Address" ref={homeAddressRef} />
          <TextField type="number" label="No" ref={personalContactRef} />
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <TextField type="text" label="Person to contact" ref={emergencyToContactRef} />
          <TextField type="text" label="Relation" ref={relationRef} />
          <TextField type="number" label="No" ref={emergencyToContactNoRef} />
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <TextField
            type="text"
            label="Medical and Dental History"
            fullWidth
            ref={medicalHistoryRef}
          />
        </Stack>

        <Card sx={{ p: 1 }}>
          <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
            <Typography variant="h6">Form</Typography>

            <Button variant="contained" onClick={submitForm}>
              Submit
            </Button>
          </Stack>

          <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
            <TextField
              type="date"
              helperText="Date Given"
              value={dateNow}
              onChange={(e) => setDateNow(e.target.value)}
            />
            <TextField type="number" helperText="Amount" fullWidth ref={amountRef} />
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
        </Card>
      </dialog>

      {/* Patient Info Dialog */}
      <dialog
        ref={patientInfoRef}
        style={{ position: 'relative', zIndex: 9999999, width: 1350, height: 700 }}
      >
        <Grid container>
          <Grid item xs={5}>
            <Typography variant="h4">Patient Transactions</Typography>
            <Typography variant="h6">No. of transaction : {patientTransactions.length}</Typography>

            {patientTransactions.map((tx) => (
              <Card key={tx._id}>
                <Typography variant="h6" fontSize={15}>
                  Date: {tx.patientName}
                </Typography>
                <Typography variant="h6" fontSize={15}>
                  Date:{' '}
                  {new Date(tx.dateTransact).toLocaleString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
                <Typography variant="h6" fontSize={14}>
                  Amount: {tx.amountPaid}
                </Typography>
                <Typography variant="h6" fontSize={14}>
                  Treatment Rendered: {tx.treatmentRendered}
                </Typography>
                <Typography variant="h6" fontSize={14}>
                  Treatment Type: {tx.treatmentType}
                </Typography>
              </Card>
            ))}
          </Grid>

          <Grid item xs={7}>
            <Stack
              flexDirection={'row'}
              alignItems={'start'}
              justifyContent={'space-between'}
              mb={1}
            >
              <Typography variant="h6">Patient Data</Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => patientInfoRef.current.close()}
              >
                Close
              </Button>
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              mb={1}
            >
              <TextField
                type="text"
                label="Patient Name"
                value={fullName}
                onChange={(e) => setfullName(e.target.value)}

                // value={patientInfo?.patientName}
              />
              <Stack
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                width={300}
              >
                <Button variant="contained" color="success" onClick={updatePatientnfo}>
                  Update Info
                </Button>
                <Button variant="contained" color="warning" onClick={deletePatient}>
                  Delete Patient
                </Button>
              </Stack>
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              mb={1}
            >
              <TextField
                type="number"
                label="Age"
                value={age}
                onChange={(e) => setage(e.target.value)}
              />

              <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={gender}
                  onChange={(e) => setgender(e.target.value)}
                  native
                  sx={{ position: 'relative', zIndex: 2, width: 200 }}
                >
                  {/* <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem> */}

                  <option value={'male'}>MALE</option>
                  <option value={'female'}>FEMALE</option>
                </Select>
              </FormControl>
            </Stack>

            <Stack
              flexDirection={'row'}
              alignItems={'start'}
              justifyContent={'space-between'}
              mb={1}
            >
              <TextField
                type="text"
                label="Birth Place"
                value={birthPlace}
                onChange={(e) => setbirthPlace(e.target.value)}
              />
              <TextField
                type="text"
                label="Nationality"
                value={nationality}
                onChange={(e) => setnationality(e.target.value)}
              />
              <TextField
                type="text"
                label="Civil Status"
                value={civilStatus}
                onChange={(e) => setcivilStatus(e.target.value)}
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
                label="Occupation"
                value={occupation}
                onChange={(e) => setoccupation(e.target.value)}
              />
              <TextField
                type="text"
                label="Home Address"
                value={homeAddress}
                onChange={(e) => sethomeAddress(e.target.value)}
              />
              <TextField
                type="number"
                label="No"
                value={personalContact}
                onChange={(e) => setpersonalContact(e.target.value)}
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
                label="Person to contact"
                value={emergencyToContact}
                onChange={(e) => setemergencyToContact(e.target.value)}
              />
              <TextField
                type="text"
                label="Relation"
                value={emergencyRelation}
                onChange={(e) => setemergencyRelation(e.target.value)}
              />
              <TextField
                type="number"
                label="No"
                value={emergencyToContactNo}
                onChange={(e) => setemergencyToContactNo(e.target.value)}
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
                label="Medical and Dental History"
                fullWidth
                value={medicalHistory}
                onChange={(e) => setmedicalHistory(e.target.value)}
              />
            </Stack>

            <Card sx={{ p: 1 }}>
              <Stack
                flexDirection={'row'}
                alignItems={'start'}
                justifyContent={'space-between'}
                mb={1}
              >
                <Typography variant="h6">New Transaction form</Typography>

                <Button variant="contained" onClick={newTransactionOnly}>
                  Submit
                </Button>
              </Stack>

              <Stack
                flexDirection={'row'}
                alignItems={'start'}
                justifyContent={'space-between'}
                mb={1}
              >
                <TextField
                  type="date"
                  helperText="Date Given"
                  fullWidth
                  value={dateNow}
                  onChange={(e) => setDateNow(e.target.value)}
                />
                <TextField
                  type="number"
                  helperText="Amount"
                  fullWidth
                  value={amount}
                  onChange={(e) => setamount(e.target.value)}
                />
              </Stack>

              <Stack
                flexDirection={'row'}
                alignItems={'start'}
                justifyContent={'space-between'}
                mb={1}
              >
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
                    value={treatmentType}
                    onChange={(e) => settreatmentType(e.target.value)}
                  >
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>

                  <FormHelperText>Treatment Type</FormHelperText>
                </FormControl>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        <ToastContainer
          autoClose={2000}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          enableMultiContainer
          containerId={'patientInfoNotify'}
        />
      </dialog>
      <ToastContainer
        autoClose={2000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        enableMultiContainer
        containerId={'homeToastifyContainer'}
      />
    </>
  )
}

export default PatientInfo
