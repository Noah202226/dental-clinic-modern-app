import { TextField } from '@mui/material'
import React from 'react'

const Search = () => {
  return (
    <TextField
      type="search"
      variant="filled"
      color="success"
      label="Search patient ...."
      sx={{ width: 350, ml: 2, borderRadius: 2 }}
    />
  )
}

export default Search
