import * as React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
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

export default function LoginRequestsPage({ params: { id } }){
  console.log('LoginRequestsPage', { id })
  const query = useQuery('loginRequests.get', { id })
  console.log('LOGIN REQUESTS query', query)

  return <Box sx={{ flexGrow: 1 }}>
    <h1>Login Requests</h1>
    {query.error && <ErrorAlert error={query.error}/>}
    <LoginRequest {...{
      loading: query.loading,
      loginRequest: query.result,
    }}/>
  </Box>
}

function LoginRequest({ loading, loginRequest }){
  return <Paper elevation={3}
    sx={{m: 2}}
  >
    <InspectObject object={loginRequest}/>
  </Paper>
}

// function LoginRequests({ loading, error, loginRequests, selected }){
//   return <List sx={{
//     width: '100%',
//     // bgcolor: 'background.paper',
//     // flexGrow: 1,
//   }}>
//     {
//       error
//         ? <ErrorAlert {...{error}}/> :

//         (loading || !loginRequests)
//         ? Array(10).fill().map((_, i) =>
//           <Skeleton key={i} animation="wave" height="100px" />
//         ) :
//       // else
//       documents.map(document =>
//         <LoginRequest {...{key: document.id, document}}/>
//       )
//     }
//   </List>
// }


// function LoginRequest({ document }){
//   return <ListItem>
//     <ListItemAvatar>
//       <Avatar>
//         <ImageIcon />
//       </Avatar>
//     </ListItemAvatar>

//     <ListItemText {...{
//       primaryTypographyProps: {
//         sx: {
//           fontFamily: 'monospace',
//           whiteSpace: 'nowrap',
//         },
//         component: Link,
//         to: toPage('DocumentShow', { id: document.id }),
//       },
//       primary: `${document.id}`,
//       secondary: (
//         `length=${document.length}` +
//         `${document.writable ? ' (writable)' : ''}`
//       ),
//     }}/>
//   </ListItem>
// }
