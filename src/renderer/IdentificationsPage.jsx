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

export default function IdentificationsPage(){
  const query = useQuery('getAllIdentifications')

  return <Box sx={{ flexGrow: 1 }}>
    <Fab
      color="primary"
      aria-label="add"
      sx={{ position: 'fixed', bottom: 65, right: 0, m: 1 }}
      component={Link}
      to={toPage('IdentificationCreate')}
    >
      <AddIcon />
    </Fab>
    <PageHeader>IDs</PageHeader>
    {query.error && <ErrorAlert error={query.error}/>}
    <IdentificationsList {...{
      loading: query.loading,
      identifications: query.result,
    }}/>
  </Box>
}


function IdentificationsList({ loading, error, identifications }){
  console.log({ identifications })
  return <List sx={{
    width: '100%',
    // bgcolor: 'background.paper',
    // flexGrow: 1,
  }}>
    {(loading || !identifications)
      ? Array(10).fill().map((_, i) =>
        <Skeleton key={i} animation="wave" height="100px" />
      )
      : identifications.map(identification =>
        <IdentificationsListMember {...{key: identification.id, identification}}/>
      )
    }
  </List>
}


function IdentificationsListMember({ identification }){
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
        to: toPage('IdentificationShow', { id: identification.id }),
      },
      primary: `${identification.id}`,
      secondary: `created: ${identification.created}`,
    }}/>
  </ListItem>
}
