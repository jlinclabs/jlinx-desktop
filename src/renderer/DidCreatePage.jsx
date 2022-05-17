import * as React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { useNavigate } from './routing'
import InspectObject from './InspectObject'
import PageHeader from './PageHeader'
import { useCommand } from './ipc'

export default function DidCreatePage(){
  return <Box sx={{ flexGrow: 1, p: 1 }}>
    <PageHeader variant="h5">Track an existing DID</PageHeader>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ResolveDidForm {...{}}/>
    </Box>
    <PageHeader variant="h5">Create a new DID</PageHeader>
  </Box>
}


function ResolveDidForm({ }){
  const navigate = useNavigate()
  const goToPage = useGoToPage()

  const onSubmit = React.useCallback(
    () => {
      goToPage('DidResolve')
    },
    [navigate]
  )
  return <form {...{onSubmit}}>
    <TextField
      sx={{flex: '1 1 auto', mr: 1 }}
      label="DID"
      variant="outlined"
      required
      placeholder="did:jlinx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    />
    <Button variant="contained">Track</Button>
  </form>
}


// function DidCreatePage(){
//   const navigate = useNavigate()
//   const command = useCommand('createDid', true)

//   useEffect(
//     () => {
//       if (!command.resolved) return
//       console.log('SUCCESS', command.result)
//       const did = command.result.id
//       navigate(`/dids/${did}`)
//     },
//     [command.state]
//   )

//   return <Box sx={{ flexGrow: 1 }}>
//     <PageHeader>New DID</PageHeader>
//     <PageHeader variant="h5">Track an existing DID</PageHeader>
//     <PageHeader variant="h5">Create a new DID</PageHeader>
//     {command.isFailure && <Alert severity="error">{`${command.error}`}</Alert>}
//   </Box>
// }

