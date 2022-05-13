import * as React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { useJlinxHypercoreStatusQuery } from './jlinxHooks'


export default function SettingsPage(){
  const query = useJlinxHypercoreStatusQuery()

  return <Box sx={{ pb: '50px', my: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Settings Page
    </Typography>

    <div><pre><code>{JSON.stringify(query.result)}</code></pre></div>
  </Box>
}
