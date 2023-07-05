import { DeleteForever, Save, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  FormControl,
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

const Settings = ({ settingModalRef, settingInfo }) => {
  const ipcRenderer = window.ipcRenderer

  const [selectedFile, setSelectedFile] = useState(null)
  const [imageData, setImageData] = useState(null)

  // New user

  const newUserFormRef = useRef()

  const [newUserName, setNewUserName] = useState()
  const [newUserPass, setNewUserPass] = useState()
  const [newUserAccountType, setNewUserAccountType] = useState()

  const submitNewUser = () => {
    const newUserData = {
      name: newUserName,
      pwd: newUserPass,
      accountType: newUserAccountType
    }

    ipcRenderer.send('new-user', newUserData)
  }

  // const [settingInfo, setSettingInfo] = useState()

  const [settingsID, setsettingsID] = useState()
  const [appTitle, setAppTitle] = useState()
  const [loginBgColor, setLoginBgColor] = useState()
  const [loginTitle, setLoginTitle] = useState()
  const [container1, setContainer1] = useState()
  const [container2, setContainer2] = useState()
  const [logoDir, setLogoDir] = useState()

  const [selectedImage, setSelectedImage] = useState(null)

  const modifyUserModalRef = useRef()
  const [users, setUsers] = useState([])
  const [userInfo, setUserInfo] = useState()

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [accountType, setAccountType] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const saveSettings = () => {
    console.log(settingInfo._id)
    ipcRenderer.send('new-setting', {
      id: settingsID,
      appTitle,
      loginBgColor,
      loginTitle,
      containerTitle1: container1,
      containerTitle2: container2
    })
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
    setsettingsID(settingInfo?._id)
    setAppTitle(settingInfo?.appTitle)
    setLoginBgColor(settingInfo?.loginBgColor)
    setLoginTitle(settingInfo?.loginTitle)
    setContainer1(settingInfo?.containerTitle1)
    setContainer2(settingInfo?.containerTitle2)
    setLogoDir(settingInfo?.logoDir)
  }, [settingInfo])
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

    setAppTitle(settingInfo?.appTitle)

    ipcRenderer.on('settings-saved', (e, args) => {
      console.log('new setting saved.')
      toast.success(`Setting saved. App will restart to apply changes.`, {
        position: 'top-center',
        containerId: 'settingsNofication'
      })

      setTimeout(() => {
        ipcRenderer.send('settings-saved')
      }, 2000)
    })

    ipcRenderer.on('new-user-saved', (e, args) => {
      toast.success(args, { position: 'bottom-right', containerId: 'settingsNofication' })

      ipcRenderer.send('get-users')

      setNewUserName('')
      setNewUserPass('')
      setNewUserAccountType('')

      newUserFormRef.current.close()
    })
  }, [])
  return (
    <>
      <dialog
        ref={settingModalRef}
        style={{ position: 'relative', zIndex: 9999999, width: 1200, height: 700 }}
      >
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} p={1}>
          <Typography variant="h4">Settings</Typography>

          <Button variant="contained" color="error" onClick={() => settingModalRef.current.close()}>
            Close
          </Button>
        </Stack>

        <Grid container spacing={1}>
          <Grid item xs={4} sx={{ backgroundColor: 'cyan' }}>
            <Stack flexDirection={'row'} justifyContent={'space-between'} p={1}>
              <Typography variant="h5">All Users</Typography>
              <Button
                size="small"
                variant="contained"
                color="info"
                onClick={() => newUserFormRef.current.showModal()}
              >
                Add User
              </Button>
            </Stack>
            <Paper
              className="scrollable-div"
              sx={{
                padding: 0.5,
                overflow: 'auto',
                height: 550,
                background: 'rgba(50,200,150, 0.5)'
              }}
            >
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
            {/* <Typography variant="h6">Setting:{settingInfo?.appTitle}</Typography> */}
            <Stack flexDirection={'column'} alignItems={'center'} justifyContent={'space-between'}>
              <Stack flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
                <TextField
                  fullWidth
                  label="Login Title"
                  value={loginTitle}
                  onChange={(e) => setLoginTitle(e.target.value)}
                  sx={{ m: 1 }}
                />

                <TextField
                  type="color"
                  sx={{ m: 1 }}
                  fullWidth
                  label="Login Background Color"
                  value={loginBgColor}
                  onChange={(e) => setLoginBgColor(e.target.value)}
                />
              </Stack>

              <TextField
                sx={{ m: 1 }}
                fullWidth
                label="App Title"
                value={appTitle}
                onChange={(e) => setAppTitle(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                sx={{ m: 1 }}
                fullWidth
                label="Container 1 Title"
                value={container1}
                onChange={(e) => setContainer1(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                sx={{ m: 1 }}
                fullWidth
                label="Container 2 Title"
                value={container2}
                onChange={(e) => setContainer2(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Stack flexDirection={'row'}>
              <Button variant="contained" color="info" onClick={saveSettings}>
                Save settings (App will restart)
              </Button>
            </Stack>
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
          <Button variant="contained" color="error" onClick={() => deleteUser(userInfo._id)}>
            Delete
            <DeleteForever sx={{ p: 1 }} />
          </Button>
        </Stack>
      </dialog>

      {/* New user */}

      <dialog ref={newUserFormRef} style={{ padding: 10, width: 500 }}>
        <Stack flexDirection={'row'} justifyContent={'space-between'} mb={1}>
          <Typography variant="h4">New User form</Typography>
          <Button variant="contained" color="error" onClick={() => newUserFormRef.current.close()}>
            Cancel
          </Button>
        </Stack>

        <Stack mb={1}>
          <TextField
            type="text"
            label="User"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            sx={{ mb: 1 }}
            type="password"
            label="Password"
            value={newUserPass}
            onChange={(e) => setNewUserPass(e.target.value)}
          />

          <FormControl fullWidth sx={{ position: 'relative', zIndex: 2, mb: 1 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              native
              sx={{ position: 'relative', zIndex: 2, width: 200 }}
              value={newUserAccountType}
              onChange={(e) => setNewUserAccountType(e.target.value)}
            >
              <option value={'user'}>USER</option>
              <option value={'admin'}>ADMIN</option>
            </Select>
            <FormHelperText>Account Type</FormHelperText>
          </FormControl>
        </Stack>

        <Stack mb={1}>
          <Button variant="contained" color="info" onClick={submitNewUser}>
            Submit
          </Button>
        </Stack>
      </dialog>
    </>
  )
}
export default Settings
