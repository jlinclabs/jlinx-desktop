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
  const query = useQuery('documents.get', id)
  const doc = query.result
  const refresh = React.useCallback(
    () => { query.call() },
    [query]
  )
  return <Box sx={{ flexGrow: 1 }}>
    <h1>{id}</h1>
    {query.error && <ErrorAlert error={query.error}/>}
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
  const onSubmit = React.useCallback(
    event => {
      event.preventDefault()
      const input = inputRef.current.querySelector('input')
      console.log({ input })
      console.log({ command })
      const string = input.value

      // const str = new TextDecoder().decode(byteArray);
      const block = new TextEncoder().encode(string).buffer
      console.log('block as buffer', block)
      // const buffer = byteArray.buffer;
      // const encoder = new TextEncoder()
      // const block = encoder.encode(string).buffer

      console.log('APPEND', doc.id, block)
      command.call({ block }).then(refresh)
      // const did = input.value
      // goToPage('DidResolve', { did })
    },
    [goToPage]
  )


  return <Box>
    <Typography variant="h6"> {`LENGTH=${doc.length}`} </Typography>
    <ol>
      {doc.entries.map(entry =>
        <li><DocumentEntry {...{entry}}/></li>
      )}
    </ol>

    <Box {...{
      onSubmit,
      component: 'form',
      disabled: command.pending,
      // sx: { display: 'flex', alignItems: 'center' },
    }}>
      <TextField
        ref={inputRef}
        sx={{flex: '1 1 auto', mr: 1 }}
        label="entry to append"
        variant="outlined"
        required
      />
      <Button variant="contained" type="submit">Append</Button>
    </Box>

  </Box>
}


function DocumentEntry({ entry }){
  console.log('DocumentEntry', { entry })
  const text = (new TextDecoder).decode(entry)
  return <span>{text}</span>
}
