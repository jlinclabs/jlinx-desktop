import * as React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { useGoToPage } from './routing'
import InspectObject from './InspectObject'
import PageHeader from './PageHeader'
import { useCommand } from './ipc'

export default function IdentificationCreatePage(){
  const goToPage = useGoToPage()
  const command = useCommand('createIdentification', [], true)
  React.useEffect(
    () => {
      console.log({ command })
      if (!command.resolved) return
      const id = command.result.id
      if (!id) debugger
      goToPage('IdentificationShow', { id })
      // if (!command.error) setError(error)
      //  command.call()
    },
    [command.state]
  )
  return <Box sx={{ flexGrow: 1, p: 1 }}>
    <PageHeader variant="h5">Creating new Identity…</PageHeader>
  </Box>
}

// function CreateButton(){

//   React.useEffect(
//     () => {
//       if (!command.resolved || !command.result) return
//       console.log('command.result', command.result)
//       const id = command.result.id
//       // if (!did) {console.error('weird', command.result); return}
//       goToPage('IdentificationShow', { id })
//     },
//     [command.state]
//   )
//   return <Button {...{
//     variant: 'contained',
//     onClick,
//     disabled: !command.idle,
//   }}>{command.idle ? 'Create' : 'Creating…'}</Button>
// }

// function ResolveDidForm({ }){
//   const goToPage = useGoToPage()

//   const inputRef = React.useRef()
//   const onSubmit = React.useCallback(
//     event => {
//       event.preventDefault()
//       const input = inputRef.current.querySelector('input')
//       console.log({ input })
//       const did = input.value
//       goToPage('DidResolve', { did })
//     },
//     [goToPage]
//   )
//   return <Box {...{
//     onSubmit,
//     component: 'form',
//     sx: { display: 'flex', alignItems: 'center' },
//   }}>
//     <TextField
//       ref={inputRef}
//       sx={{flex: '1 1 auto', mr: 1 }}
//       label="DID"
//       variant="outlined"
//       required
//       placeholder="did:jlinx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
//     />
//     <Button variant="contained">Track</Button>
//   </Box>
// }


// // function DidCreatePage(){
// //   const navigate = useNavigate()
// //   const command = useCommand('createDid', true)

// //   useEffect(
// //     () => {
// //       if (!command.resolved) return
// //       console.log('SUCCESS', command.result)
// //       const did = command.result.id
// //       navigate(`/dids/${did}`)
// //     },
// //     [command.state]
// //   )

// //   return <Box sx={{ flexGrow: 1 }}>
// //     <PageHeader>New DID</PageHeader>
// //     <PageHeader variant="h5">Track an existing DID</PageHeader>
// //     <PageHeader variant="h5">Create a new DID</PageHeader>
// //     {command.isFailure && <Alert severity="error">{`${command.error}`}</Alert>}
// //   </Box>
// // }

