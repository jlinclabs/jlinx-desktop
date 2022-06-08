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
  console.log('AccountAddPage', props.params)
  const { id } = props.params

  // const query = useQuery('getAllAccounts')

  return <Box sx={{ flexGrow: 1 }}>
    <PageHeader>Add App Account</PageHeader>
    {/* {query.error && <ErrorAlert error={query.error}/>} */}
    {id
      ? <ReviewAccount {...{ id }}/>
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
      const id = input.value
      goToPage('AccountAdd', { id })
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

function ReviewAccount({ id }){
  const query = useQuery('accounts.review', { id })
  return <Box {...{
    sx: { m: 1 },
  }}>
    {
      query.error
        ? <Alert severity="error">{`${query.error}`}</Alert> :
      query.resolved
        ? <AccountForReview account={query.result}/> :
      // else
        <span>{`looking up: ${id}`}</span>
    }
  </Box>
}


function AccountForReview({ account }){
  const goToPage = useGoToPage()
  const command = useCommand('accounts.add', { id: account.id })
  const addAccount = React.useCallback(
    () => { command.call() },
    [command]
  )
  React.useEffect(
    () => {
      if (command.result){
        console.log(command)
        const { id } = command.result
        goToPage('Accounts', { id })
      }
    },
    [command.result]
  )
  return <Box {...{
    sx: { m: 1 },
  }}>
    <InspectObject object={account} />
    <InspectObject object={command.result} />
    <p>
      <Button
        disabled={!command.idle}
        variant="contained"
        component={Link}
        to="/Accounts"
      >cancel</Button>
      <Button
        disabled={!command.idle}
        variant="contained"
        onClick={addAccount}
      >Add</Button>
    </p>
  </Box>
}
