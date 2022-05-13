import * as React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { useJlinxHypercoreStatusQuery } from './jlinxHooks'
import InspectObject from './InspectObject'
import PageHeader from './PageHeader'

export default function SettingsPage(){
  const query = useJlinxHypercoreStatusQuery()

  return <Box sx={{ pb: '50px', my: 4 }}>
    <PageHeader>Settings</PageHeader>
    <InspectObject object={query.result}/>
  </Box>
}
