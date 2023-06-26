import { Box, Stack, Typography } from '@mui/material'

import icon from '../../assets/dentist.svg'
import { useEffect, useState } from 'react'

const Header = () => {
  const [dateTime, setDateTime] = useState(
    Date.now().toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
  )
  useEffect(() => {
    setInterval(() => {
      const datetimeNow = new Date()
      setDateTime(
        datetimeNow.toLocaleString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        })
      )
    }, 1000)
  }, [])
  return (
    <Box sx={{ mb: 3 }}>
      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} p={1}>
        <Stack
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-evenly'}
          sx={{ width: 700 }}
        >
          <img src={icon} alt="heading image" width={100} height={100} />

          <Typography variant="h2">Dental Clinic App</Typography>
        </Stack>

        <Typography variant="h6" padding={2}>
          {dateTime}
        </Typography>
      </Stack>
    </Box>
  )
}

export default Header
