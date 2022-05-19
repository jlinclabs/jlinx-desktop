import * as React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'

import { useGoToPage } from './routing'
import InspectObject from './InspectObject'
import PageHeader from './PageHeader'
import { useCommand } from './ipc'

export default function DidResolvePage(props){
  const { did } = props.params
  const command = useCommand('resolveDid', {did})
  console.log({command})
  return <Box sx={{ flexGrow: 1, p: 1 }}>
    <PageHeader>{did}</PageHeader>
    {command.error && <Alert severity="error">{`${command.error}`}</Alert>}
    {command.resolved && <DidDocument {...{ didDocument: command.result }}/>}
    <ol>
      {['https://testnet1.jlinx.io', 'https://testnet2.jlinx.io'].map(host =>
        <li key={host}>view on <Link href={`${host}/${did}`}>{host}</Link></li>
      )}
    </ol>
  </Box>
}

function DidDocument({ didDocument }){
  console.log({ didDocument })
  return <InspectObject object={didDocument}/>
}
