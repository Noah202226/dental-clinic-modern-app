import { Box, Button, TextField, Typography } from '@mui/material'
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
  }, [])

  return (
    <Box>
      <Typography>Login Page</Typography>

      <TextField type="text" label="Username" ref={userRef} disabled={isLoading} />
      <TextField type="password" label="Password" ref={pwdRef} disabled={isLoading} />

      <Button onClick={checkUser}>Login</Button>

      <ToastContainer />
    </Box>
  )
}

export default Login
