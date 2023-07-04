import { DeleteForever, Save, Visibility, VisibilityOff } from '@mui/icons-material'
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

import image1 from '../../../../../uploads/image.jpg'

const Settings = ({ settingModalRef, settingInfo }) => {
  const ipcRenderer = window.ipcRenderer

  const [selectedFile, setSelectedFile] = useState(null)
  const [imageData, setImageData] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
  }

  const handleUpload = () => {
    if (!selectedFile) {
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      const base64Image = reader.result.toString()

      ipcRenderer.send('upload-image', { image: base64Image, imageName: selectedFile.name })
    }

    reader.readAsDataURL(selectedFile)
  }

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
    ipcRenderer.send('new-setting', { id: settingsID, appTitle, loginBgColor })
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
    setContainer1(settingInfo?.container1)
    setContainer2(settingInfo?.container2)
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
        <Typography>Settings</Typography>

        <Button variant="contained" color="error" onClick={() => settingModalRef.current.close()}>
          Close
        </Button>

        <Grid container>
          <Grid item xs={4}>
            <Paper>
              <Typography variant="h5">All Users</Typography>
              <Button
                variant="contained"
                color="info"
                onClick={() => newUserFormRef.current.showModal()}
              >
                Add User
              </Button>

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
            <Stack flexDirection={'column'}>
              <TextField
                helperText="Login Title"
                value={loginTitle}
                onChange={(e) => setLoginTitle(e.target.value)}
              />

              <TextField
                type="color"
                value={loginBgColor}
                onChange={(e) => setLoginBgColor(e.target.value)}
              />

              <TextField
                helperText="App Title"
                value={appTitle}
                onChange={(e) => setAppTitle(e.target.value)}
              />

              <TextField
                type="file"
                helperText="Logo Title"
                // value={'logo'}
                onChange={(e) => console.log(e.target.value)}
              />

              <Typography variant="body">Logo Path:{logoDir}</Typography>

              {selectedImage && (
                <img src={logoDir} alt="Preview" style={{ width: '200px', height: '200px' }} />
              )}

              {imageData ? <img src={imageData} alt="Uploaded Image" /> : <p>Loading image...</p>}

              <img src={image1} alt="require image" />

              <input type="file" accept="image/*" onChange={handleFileUpload} />

              <Button variant="contained" color="warning" onClick={handleUpload}>
                Upload
              </Button>

              <Button variant="contained" color="warning" onClick={saveSettings}>
                Save settings
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

      <dialog ref={newUserFormRef}>
        <Typography variant="h3">New User form</Typography>
        <Button variant="contained" color="error" onClick={() => newUserFormRef.current.close()}>
          Cancel
        </Button>

        <TextField
          type="text"
          label="User"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <TextField
          type="password"
          label="Password"
          value={newUserPass}
          onChange={(e) => setNewUserPass(e.target.value)}
        />
        <TextField
          type="text"
          label="user"
          value={newUserAccountType}
          onChange={(e) => setNewUserAccountType(e.target.value)}
        />

        <Button variant="contained" color="info" onClick={submitNewUser}>
          Submit
        </Button>
      </dialog>
    </>
  )
}
export default Settings
