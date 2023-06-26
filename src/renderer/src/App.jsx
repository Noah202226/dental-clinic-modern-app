import Login from './components/Login'
import Home from './components/Home'
import { useEffect, useRef, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'

function App() {
  const [isLogin, setIsLogin] = useState(true)

  const ipcRenderer = window.ipcRenderer

  const exitRef = useRef()

  const exitApp = () => {
    ipcRenderer.send('exit-app')
  }

  useEffect(() => {
    ipcRenderer.on('closing-app', () => exitRef.current.showModal())
  }, [])

  return (
    <Box>
      <dialog ref={exitRef}>
        <Typography variant="h6" textAlign={'center'}>
          Do you really want to exit?
        </Typography>

        <Stack
          width={'100%'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-around'}
          pt={2}
        >
          <Button variant="contained" onClick={exitApp} color="error">
            Exit
          </Button>
          <Button variant="outlined" onClick={() => exitRef.current.close()} color="warning">
            Cancel
          </Button>
        </Stack>
      </dialog>
      {isLogin ? <Home /> : <Login setIsLogin={setIsLogin} />}
    </Box>
  )
}

export default App
