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
import Chip from '@mui/material/Chip'

import ImageIcon from '@mui/icons-material/Image'
import AddIcon from '@mui/icons-material/Add'

import PageHeader from './PageHeader'
import Link from './Link'
import ErrorAlert from './ErrorAlert'
import { useQuery } from './ipc'


export default function KeysListPage(){
  const query = useQuery('getAllKeys')

  return <Box sx={{ flexGrow: 1 }}>
    <Fab
      color="primary"
      aria-label="add"
      sx={{ position: 'fixed', bottom: 65, right: 0, m: 1 }}
      component={Link}
      to="/keys/new"
    >
      <AddIcon />
    </Fab>
    <PageHeader>Keys</PageHeader>
    {query.error && <ErrorAlert error={query.error}/>}
    <KeysList {...{
      loading: query.loading,
      keys: query.result,
    }}/>
  </Box>
}


function KeysList({ loading, error, keys }){
  return <List sx={{
    width: '100%',
    // bgcolor: 'background.paper',
    // flexGrow: 1,
  }}>
    {(loading || !keys)
      ? Array(10).fill().map((_, i) =>
        <Skeleton key={i} animation="wave" height="100px" />
      )
      : keys.map(keyPair =>
        <KeysListMember {...{key: keyPair.publicKey, keyPair}}/>
      )
    }
  </List>
}


function KeysListMember({ keyPair }){
  const showHref = `/keys/${keyPair.publicKey}`
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
      },
      primary: <span>
        <Link to={showHref}>{keyPair.publicKey}</Link>
      </span>,
      secondary: <span>
        <Chip label={keyPair.type}/>&nbsp;
        <span>{`created: ${keyPair.created}`}</span>
      </span>
    }}/>
  </ListItem>
}
