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

import { toPage } from './routing'
import PageHeader from './PageHeader'
import Link from './Link'
import ErrorAlert from './ErrorAlert'
import { useQuery } from './ipc'

export default function DidsPage(){
  const query = useQuery('getAllDids')

  return <Box sx={{ flexGrow: 1 }}>
    <Fab
      color="primary"
      aria-label="add"
      sx={{ position: 'fixed', bottom: 65, right: 0, m: 1 }}
      component={Link}
      to={toPage('DidCreate')}
    >
      <AddIcon />
    </Fab>
    <PageHeader>DIDs</PageHeader>
    {query.error && <ErrorAlert error={query.error}/>}
    <DidDocumentsList {...{
      loading: query.loading,
      didDocuments: query.result,
    }}/>
  </Box>
}


function DidDocumentsList({ loading, error, didDocuments }){
  return <List sx={{
    width: '100%',
    // bgcolor: 'background.paper',
    // flexGrow: 1,
  }}>
    {(loading || !didDocuments)
      ? Array(10).fill().map((_, i) =>
        <Skeleton key={i} animation="wave" height="100px" />
      )
      : didDocuments.map(didDocument =>
        <DidDocumentsListMember {...{key: didDocument.id, didDocument}}/>
      )
    }
  </List>
}


function DidDocumentsListMember({ didDocument }){
  const did = didDocument.id
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
        to: toPage('DidShow', { did }),
      },
      primary: `${didDocument.id}`,
      secondary: `created: ${didDocument.created}`,
    }}/>
  </ListItem>
}
