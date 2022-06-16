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
import IconButton from '@mui/material/IconButton';

import ImageIcon from '@mui/icons-material/Image'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete';

import { toPage } from './routing'
import PageHeader from './PageHeader'
import Link from './Link'
import ErrorAlert from './ErrorAlert'
import { useQuery, useCommand } from './ipc'
import Timestamp from './Timestamp'
import InspectObject from './InspectObject'

export default function AccountsPage(){
  const query = useQuery('accounts.all')

  const reload = query.call

  return <Box sx={{ flexGrow: 1 }}>
    <Fab
      color="primary"
      aria-label="add"
      sx={{ position: 'fixed', bottom: 65, right: 0, m: 1 }}
      component={Link}
      to={toPage('AccountAdd')}
    >
      <AddIcon />
    </Fab>
    <PageHeader>Accounts</PageHeader>
    {query.error && <ErrorAlert error={query.error}/>}
    <AccountsList {...{
      loading: query.loading,
      accounts: query.result,
      reload,
    }}/>
  </Box>
}


function AccountsList({ loading, error, accounts, reload }){
  return <List sx={{
    width: '100%',
    // bgcolor: 'background.paper',
    // flexGrow: 1,
  }}>
    {(loading || !accounts)
      ? Array(10).fill().map((_, i) =>
        <Skeleton key={i} animation="wave" height="100px" />
      )
      : accounts.map(account =>
        <AccountsListMember {...{
          key: account.id, account, reload
        }}/>
      )
    }
  </List>
}


function AccountsListMember({ account, reload }){
  const id = account.id
  const command = useCommand('accounts.delete', { id })
  const onClick = React.useCallback(
    () => {
      const confirmed = confirm(
        `Are you sure you want to delete this account?`
      )
      if (confirmed) command.call().then(() => { reload() })
    },
    [id]
  )

  const createdAt = new Date(account.createdAt)
  return <ListItem {...{
    secondaryAction: (
      <IconButton edge="end" aria-label="delete" {...{onClick}}>
        <DeleteIcon />
      </IconButton>
    ),
  }}>
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
        to: toPage('AccountShow', { id: account.id }),
      },
      primary: `${account.host}`,
      secondary: <span>
        created <Timestamp at={account.createdAt}/>
      </span>
    }}/>
  </ListItem>
}
