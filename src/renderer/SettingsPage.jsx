import * as React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import InspectObject from './InspectObject'
import PageHeader from './PageHeader'
import { useQuery } from './ipc'

export default function SettingsPage(){
  const configQuery = useQuery('getConfig')
  const hypQuery = useQuery('getHypercoreStatus')

  return <Box sx={{ pb: '50px', my: 4 }}>
    <PageHeader>Settings</PageHeader>
    <InspectObject object={configQuery.result}/>
    <InspectObject object={hypQuery.result}/>
  </Box>
}
