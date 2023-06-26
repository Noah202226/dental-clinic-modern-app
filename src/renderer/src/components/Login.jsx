import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const Login = ({ setIsLogin }) => {
  const userRef = useRef()
  const pwdRef = useRef()

  const [isLoading, setIsLoading] = useState(false)

  const ipcRenderer = window.ipcRenderer
  const checkUser = () => {
    const account = {
      name: userRef.current.children[1].children[0].value,
      pwd: pwdRef.current.children[1].children[0].value
    }

    ipcRenderer.send('check-user', account)

    setIsLoading(true)
  }

  const exitApp = () => {
    ipcRenderer.send('exit-app')
  }

  useEffect(() => {
    ipcRenderer.on('validated-user', (e, args) => {
      console.log(args)
      if (args !== null) {
        toast.success('Successfully login', { position: toast.POSITION.BOTTOM_RIGHT })

        setTimeout(() => {
          setIsLogin(true)
        }, 4000)
      } else {
        toast.error('Login failed, User not found!', { position: toast.POSITION.BOTTOM_RIGHT })
        setIsLoading(false)
      }
    })

    setTimeout(() => {
      userRef.current.children[1].children[0].focus()
    }, 2000)
  }, [])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-around'
        }}
      >
        <Typography>Login Page</Typography>

        <TextField type="text" label="Username" ref={userRef} disabled={isLoading} fullWidth />
        <TextField type="password" label="Password" ref={pwdRef} disabled={isLoading} fullWidth />

        <Stack
          width={'100%'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          mt={2}
        >
          <Button variant="contained" onClick={checkUser} color="success" sx={{ width: '100%' }}>
            Login
          </Button>
        </Stack>

        <ToastContainer />
      </Box>
    </Box>
  )
}

export default Login
