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
  return <Box {...{
    sx: { m: 1 },
  }}>
    <InspectObject object={account} />
  </Box>
}
