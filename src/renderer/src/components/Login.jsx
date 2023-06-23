import { Box, Button, Typography } from '@mui/material'

const Login = ({ setIsLogin }) => {
  const ipcRenderer = window.ipcRenderer
  const checkUser = () => {
    ipcRenderer.send('check-user', { name: 'noah', pwd: 'onlyme' })
  }

  ipcRenderer.on('validated-user', (e, args) => console.log(args))

  return (
    <Box>
      <Typography>Login Page</Typography>

      <Button onClick={checkUser}>Login</Button>
    </Box>
  )
}

export default Login
