import * as React from 'react'
import Typography from '@mui/material/Typography'

export default function PageHeader({children, ...props}){
  return <Typography
    sx={{m: 1}}
    variant="h4"
    component="h1"
    gutterBottom
  >{children}</Typography>
}
