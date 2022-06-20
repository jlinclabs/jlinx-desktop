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

import { toPage, openExternalUrl } from './routing'
import { useQuery, useCommand } from './ipc'
import { useGoToPage } from './routing'
import PageHeader from './PageHeader'
import Link from './Link'
import ErrorAlert from './ErrorAlert'
import Timestamp from './Timestamp'
import InspectObject from './InspectObject'

export default function AccountShowPage(props){
  const { id } = props.params

  const query = useQuery('accounts.get', {id})

  return <Box sx={{ flexGrow: 1 }}>
    <PageHeader>App Account</PageHeader>
    {query.error && <ErrorAlert error={query.error}/>}
    {query.result && <Account account={query.result}/>}
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


function Account({ account }){
  const { id } = account
  const deleteCommand = useCommand('accounts.delete', { id })
  const loginCommand = useCommand('accounts.login', { id })
  const onDelete = React.useCallback(
    () => {

    },
    []
  )
  const onLogin = React.useCallback(
    () => {
      loginCommand.call()
    },
    [loginCommand.state]
  )

  React.useEffect(
    () => {
      if (loginCommand.result){
        openExternalUrl(loginCommand.result.loginUrl)
      }
    },
    [loginCommand.state]
  )
  return <Box {...{
    sx: {
      m: 1,
      // backgroundColor: 'background.paper',
    },
  }}>
    <Typography variant="h4">
      <Link href={`https://${account.host}`}>{account.host}</Link>
    </Typography>
    <Typography variant="h6">
      created <Timestamp at={account.createdAt}/>
    </Typography>
    <Typography variant="body2">
      app account id <Link href={`https://testnet1.jlinx.test/${account.id}`}>{account.id}</Link>
    </Typography>
    <Typography variant="body2">
      app user id <Link href={`https://testnet1.jlinx.test/${account.appUserId}`}>{account.appUserId}</Link>
    </Typography>
    <p>
      <Button
        disabled={loginCommand.pending}
        variant="text"
        onClick={onDelete}
      >delete</Button>
      <Button
        disabled={loginCommand.pending}
        variant="contained"
        onClick={onLogin}
      >Login</Button>
    </p>
    <InspectObject object={{account, deleteCommand, loginCommand}}/>
  </Box>
}
