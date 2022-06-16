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
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'


import ImageIcon from '@mui/icons-material/Image'
import AddIcon from '@mui/icons-material/Add'

import { toPage, useGoToPage } from './routing'
import PageHeader from './PageHeader'
import Link from './Link'
import ErrorAlert from './ErrorAlert'
import { useQuery, useCommand } from './ipc'
import InspectObject from './InspectObject'

export default function DocumentsPage(){
  const query = useQuery('documents.all')

  return <Box sx={{ flexGrow: 1 }}>
    <h1>Documents</h1>
    <Box sx={{ m: 2 }}>
      <CreateDocumentButton />
    </Box>
    <Box sx={{ m: 2 }}>
      <LookupForm />
    </Box>
    {/* <InspectObject object={query}/> */}
    {query.error && <ErrorAlert error={query.error}/>}
    <DocumentsList {...{
      loading: query.loading,
      documents: query.result,
    }}/>
  </Box>
}

function CreateDocumentButton(){
  const goToPage = useGoToPage()
  const [docType, setDocType] = React.useState('Ledger')
  const command = useCommand('documents.create', {}, false)
  React.useEffect(
    () => {
      console.log('CREATED NEW DOC', command)
      if (command.result) goToPage('DocumentShow', { id: command.result })
    },
    [command.state]
  )
  const onClick = React.useCallback(
    () => {
      if (command.idle) command.call({ docType })
    },
    [command.state, docType]
  )
  return <Box {...{
    sx: { display: 'flex', flexAlign: 'middle' }
  }}>
    <FormControl>
      <InputLabel id="demo-simple-select-label">Doc Type</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={docType}
        label="Doc Type"
        onChange={e => { setDocType(e.target.value) }}
      >
        <MenuItem value="Raw">Raw</MenuItem>
        <MenuItem value="Ledger">Ledger</MenuItem>
        <MenuItem value="File">File</MenuItem>
      </Select>
    </FormControl>
    &nbsp;
    <Button {...{
      variant: 'contained',
      onClick,
      disabled: !command.idle,
    }}>Create</Button>
  </Box>
}

function LookupForm(){
  const goToPage = useGoToPage()
  const inputRef = React.useRef()
  const onSubmit = React.useCallback(
    event => {
      event.preventDefault()
      const id = inputRef.current.querySelector('input').value
      goToPage('DocumentShow', { id })
    },
    []
  )
  return <Box {...{
    onSubmit,
    component: 'form',
    sx: { display: 'flex', flexAlign: 'middle' }
  }}>
    <TextField
      ref={inputRef}
      sx={{flex: '1 1 auto', mr: 1 }}
      label="lookup a document by id"
      // variant="outlined"
      required
    />
    <Button variant="contained" type="submit">Lookup</Button>
  </Box>
}

function DocumentsList({ loading, error, documents }){
  return <List sx={{
    width: '100%',
    // bgcolor: 'background.paper',
    // flexGrow: 1,
  }}>
    {(loading || !documents)
      ? Array(10).fill().map((_, i) =>
        <Skeleton key={i} animation="wave" height="100px" />
      )
      : documents
        .map(document =>
          <DocumentsListMember {...{key: document.id, document}}/>
        )
        .reverse()
    }
  </List>
}


function DocumentsListMember({ document }){
  return <ListItem>
    <ListItemAvatar>
      <Avatar>
        <ImageIcon />
      </Avatar>
    </ListItemAvatar>

    <ListItemText {...{
      primaryTypographyProps: {
        sx: {
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
        },
        component: Link,
        to: toPage('DocumentShow', { id: document.id }),
      },
      primary: `${document.id}`,
      secondary: (
        `length=${document.length}` +
        `${document.writable ? ' (writable)' : ''}`
      ),
    }}/>
  </ListItem>
}
