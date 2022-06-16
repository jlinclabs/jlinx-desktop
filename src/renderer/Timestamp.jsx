import * as React from 'react'
import Typography from '@mui/material/Typography'

export default function Timestamp({
  at, locales, localeOptions, ...props
}){
  console.log('Timestamp', props)
  const date = new Date(at)
  const value = date.toLocaleDateString(locales, localeOptions)
  return <Typography {...props}>{value}</Typography>
}

Timestamp.defaultProps = {
  variant: 'body1',
  component: 'span',
}
