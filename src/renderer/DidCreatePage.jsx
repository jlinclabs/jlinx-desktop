import * as React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'

import { useNavigate } from './routing'
import InspectObject from './InspectObject'
import PageHeader from './PageHeader'
import { useJlinxDidCreateCommand } from './jlinxHooks'

export default function DidCreatePage(){
  const navigate = useNavigate()
  const command = useJlinxDidCreateCommand()
  console.log('CREATE CMD', command)
  useEffect(
    () => { command.exec() },
    []
  )
  useEffect(
    () => {
      if (!command.isSuccess) return
      console.log('SUCCESS', command.result)
      const did = command.result.id
      navigate(`/dids/${did}`)
    },
    [command.isSuccess]
  )

  return <Box sx={{ flexGrow: 1 }}>
    <PageHeader>Creating new DID</PageHeader>
    {command.isFailure && <Alert severity="error">{`${command.error}`}</Alert>}
  </Box>
}

