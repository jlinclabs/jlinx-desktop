import * as React from 'react'
import Alert from '@mui/material/Alert'

export default function ErrorAlert({error, ...props}){
  error = `${error}`
  return <Alert sx={{m: 1}} severity="error">{error}</Alert>
}
