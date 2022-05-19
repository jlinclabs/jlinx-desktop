import * as React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Skeleton from '@mui/material/Skeleton'
import Avatar from '@mui/material/Avatar'
import Fab from '@mui/material/Fab'
import ImageIcon from '@mui/icons-material/Image'
import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { toPage } from './routing'
import { useQuery, useCommand } from './ipc'
import { useGoToPage } from './routing'
import PageHeader from './PageHeader'
import Link from './Link'
import ErrorAlert from './ErrorAlert'
import InspectObject from './InspectObject'

export default function AccountAddPage(props){
  const { publicKey } = props.params

  // const query = useQuery('getAllAccounts')

  return <Box sx={{ flexGrow: 1 }}>
    <PageHeader>Create Account</PageHeader>
    {/* {query.error && <ErrorAlert error={query.error}/>} */}
    {publicKey
      ? <AddAccount {...{ publicKey }}/>
      : <AccountCreateForm {...{}}/>
    }
  </Box>
}

function AccountCreateForm(){
  const goToPage = useGoToPage()
  const inputRef = React.useRef()
  const onSubmit = React.useCallback(
    event => {
      event.preventDefault()
      const input = inputRef.current.querySelector('input')
      const publicKey = input.value
      goToPage('AccountAdd', { publicKey })
    },
    [goToPage]
  )
  return <Box {...{
    onSubmit,
    component: 'form',
    sx: { m: 1, display: 'flex', alignItems: 'center' },
  }}>
    <TextField
      autoFocus
      ref={inputRef}
      sx={{flex: '1 1 auto', mr: 1 }}
      label="Code"
      variant="outlined"
      required
    />
    <Button variant="contained" type="submit">Add</Button>
  </Box>
}

function AddAccount({ publicKey }){
  const goToPage = useGoToPage()
  const command = useCommand('addAccount', true)

  React.useEffect(
    () => {
      if (!command.resolved) return
      console.log('ADDED ACCOUNT', command.result)
      goToPage('Accounts', {
        focus: command.result.id
      })
    },
    [goToPage, command.state]
  )
  return <Box {...{
    sx: { m: 1 },
  }}>
    {
      command.error
        ? <Alert severity="error">{`${command.error}`}</Alert> :
      command.resolved
        ? <div>
          <span>{`added: ${publicKey}`}</span>
          <InspectObject object={command.result} />
        </div> :
      <span>{`adding: ${publicKey}`}</span>
    }
  </Box>
}
