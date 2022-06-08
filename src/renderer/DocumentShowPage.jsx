import * as React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Skeleton from '@mui/material/Skeleton'
import Avatar from '@mui/material/Avatar'
import Fab from '@mui/material/Fab'
import TextField from '@mui/material/TextField'

import ImageIcon from '@mui/icons-material/Image'
import AddIcon from '@mui/icons-material/Add'

import { toPage, useGoToPage } from './routing'
import PageHeader from './PageHeader'
import Link from './Link'
import ErrorAlert from './ErrorAlert'
import { useQuery, useCommand } from './ipc'
import InspectObject from './InspectObject'

export default function DocumentShowPage(props){
  console.log({props})
  const { id } = props.params
  const docQuery = useQuery('documents.get', id)
  const doc = docQuery.result
  const refresh = React.useCallback(
    () => { if (!docQuery.pending) docQuery.call() },
    [docQuery]
  )
  const changeQuery = useQuery('documents.change', id)
  React.useEffect(
    () => {
      if (changeQuery.resolved){
        console.log('docQuery.state', docQuery.state)
        refresh()
        changeQuery.call()
      }
    },
    [changeQuery.state]
  )
  return <Box sx={{ flexGrow: 1 }}>
    <h1>{id}</h1>
    {docQuery.error && <ErrorAlert error={docQuery.error}/>}
    {changeQuery.error && <ErrorAlert error={changeQuery.error}/>}
    { doc && <Document {...{ doc, refresh }} />}
  </Box>
}

function stringToArrayBuffer( string, encoding, callback ) {
  var blob = new Blob([string],{type:'text/plain;charset='+encoding});
  var reader = new FileReader();
  reader.onload = function(evt){callback(evt.target.result);};
  reader.readAsArrayBuffer(blob);
}

function Document({ doc, refresh }){
  console.log({ doc })
  const command = useCommand('documents.append', { id: doc.id }, false)

  const goToPage = useGoToPage()

  const inputRef = React.useRef()
  const getInput = () => inputRef.current.querySelector('textarea')
  const onSubmit = React.useCallback(
    event => {
      event.preventDefault()
      const string = getInput().value
      const block = new TextEncoder().encode(string).buffer
      command.call({ block }).then(refresh)
    },
    [goToPage]
  )

  React.useEffect(
    () => {
      if (!command.pending && command.resolved){
        const input = getInput()
        input.value = ''
        input.focus()
      }
    },
    [command.pending]
  )

  return <Box>
    <Typography variant="h6"> {`LENGTH=${doc.length}`} </Typography>
    <Typography variant="h6"> {`WRITABLE=${doc.writable}`} </Typography>

    <Box {...{
      onSubmit,
      component: 'form',
      disabled: command.pending,
    }}>
      <TextField {...{
        ref: inputRef,
        required: true,
        multiline: true,
        sx: {flex: '1 1 auto', mr: 1 },
        label: 'entry to append',
        variant: 'outlined',
        disabled: !!command.pending,
      }}/>
      <Button variant="contained" type="submit">Append</Button>
    </Box>

    <ul>
      {doc.entries
        .map((entry, index) =>
          <li key={index}>
            <span>{index}</span>&nbsp;
            <DocumentEntry {...{id: doc.id, entry, index}}/>
          </li>
        )
        .reverse()
      }
    </ul>

  </Box>
}

const HOST = `https://testnet1.jlinx.test`
function DocumentEntry({ entry, id, index }){
  // this transform should be done and cached long before here
  const text = (new TextDecoder).decode(entry)
  return <Box {...{
    sx: {}
  }}>
    <Box sx={{
      whiteSpace: 'pre'
    }}>{text}</Box>
    <Link href={`${HOST}/${id}/${index}`}>{HOST}</Link>
  </Box>
}
