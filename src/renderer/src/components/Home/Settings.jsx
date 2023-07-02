import {
  Delete,
  DeleteForever,
  Save,
  SaveAlt,
  SaveRounded,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const Settings = ({ settingModalRef }) => {
  const ipcRenderer = window.ipcRenderer

  const [settingInfo, setSettingInfo] = useState()
  const [appTitle, setAppTitle] = useState()

  const modifyUserModalRef = useRef()
  const [users, setUsers] = useState([])
  const [userInfo, setUserInfo] = useState()

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [accountType, setAccountType] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const saveSettings = () => {
    console.log(settingInfo._id)
    ipcRenderer.send('new-setting', { id: settingInfo?.id, appTitle })
  }

  const updateUserInfo = (id) => {
    const newUserData = {
      id,
      name: user,
      pwd: pass,
      accountType
    }
    ipcRenderer.send('updateUserInfo', newUserData)
  }

  const deleteUser = (id) => {
    ipcRenderer.send('delete-user', id)
  }

  useEffect(() => {
    ipcRenderer.send('get-users')

    ipcRenderer.on('all-users', (e, args) => {
      const users = JSON.parse(args)
      setUsers(users)
    })

    ipcRenderer.on('updated-user', (e, args) => {
      toast.success(args, { position: 'top-center', containerId: 'settingsNofication' })

      ipcRenderer.send('get-users')

      modifyUserModalRef.current.close()
    })

    ipcRenderer.on('deleted-user', (e, args) => {
      toast.success(args, { position: 'top-center', containerId: 'settingsNofication' })

      ipcRenderer.send('get-users')

      modifyUserModalRef.current.close()
    })

    // Settings

    ipcRenderer.send('get-settings')

    ipcRenderer.on('settings-data', (e, args) => {
      console.log()
      try {
        const settingsData = JSON.parse(args)

        setSettingInfo(JSON.parse(args)[0])

        setAppTitle(settingInfo?.appTitle)
      } catch (e) {
        console.log(e)
      }
    })

    ipcRenderer.on('settings-saved', (e, args) => {
      toast.success(`Setting saved. App will restart to apply changes.`, {
        position: 'top-center',
        containerId: 'settingsNofication'
      })

      setTimeout(() => {
        ipcRenderer.send('settings-saved')
      }, 2000)
    })
  }, [])
  return (
    <>
      <dialog
        ref={settingModalRef}
        style={{ position: 'relative', zIndex: 9999999, width: 1200, height: 700 }}
      >
        <Typography>Settings</Typography>

        <Grid container>
          <Grid item xs={4}>
            <Paper>
              <Typography variant="h5">All Users</Typography>

              {users.map((user) => (
                <Card
                  key={user._id}
                  sx={{
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                    '&:hover': {
                      boxShadow: '4px 4px 8px 4px rgba(20,50,80,5)',
                      marginLeft: 1
                    }
                  }}
                  onClick={() => {
                    setUserInfo(user)

                    setUser(user.name)
                    setPass(user.pwd)
                    setAccountType(user.accountType)

                    modifyUserModalRef.current.showModal()
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">Username: {user.name}</Typography>
                    <Typography variant="h6">Account type: {user.accountType}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={7}>
            <TextField
              helperText="App Title"
              value={appTitle}
              onChange={(e) => setAppTitle(e.target.value)}
            />

            <Button variant="contained" color="warning" onClick={saveSettings}>
              Save settings
            </Button>
          </Grid>
        </Grid>
        <ToastContainer
          autoClose={2000}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          enableMultiContainer
          containerId={'settingsNofication'}
        />
      </dialog>

      <dialog ref={modifyUserModalRef} style={{ padding: 20, margin: 1, width: 500 }}>
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Typography variant="h5">Modify User : {userInfo?.name}</Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => modifyUserModalRef.current.close()}
          >
            Close
          </Button>
        </Stack>

        <Stack flexDirection={'row'} alignItems={'center'}>
          <TextField
            type="text"
            label="Username"
            helperText="User"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>Account Type</FormHelperText>
          </FormControl>
        </Stack>
        <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
          <Select
            onChange={(e) => setAccountType(e.target.value)}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={accountType}
            native
            sx={{ position: 'relative', zIndex: 2, width: 200 }}
            fullWidth
          >
            {/* <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem> */}

            <option value={'admin'}>Admin</option>
            <option value={'user'}>User</option>
          </Select>

          <FormHelperText>Account Type</FormHelperText>
        </FormControl>

        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'flex-end'} gap={2}>
          <Button variant="contained" color="info" onClick={() => updateUserInfo(userInfo._id)}>
            Save
            <Save sx={{ p: 1 }} />
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => modifyUserModalRef.current.close()}
          >
            Delete
            <DeleteForever sx={{ p: 1 }} />
          </Button>
        </Stack>
      </dialog>
    </>
  )
}
export default Settings
