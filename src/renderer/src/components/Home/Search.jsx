import { TextField } from '@mui/material'
import React from 'react'

const Search = ({ search, setsearch }) => {
  return (
    <TextField
      type="search"
      color="success"
      InputLabelProps={{ shrink: true }}
      label="Search patient ...."
      value={search}
      onChange={(e) => setsearch(e.target.value)}
      sx={{ width: 350, ml: 2, borderRadius: 2 }}
    />
  )
}

export default Search
