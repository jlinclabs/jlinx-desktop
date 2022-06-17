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
  const query = useQuery('loginRequests.get', { id })
  return <Box sx={{
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}>
    {query.error && <ErrorAlert error={query.error}/>}
    {query.result && <LoginRequest {...{
      id,
      appAccount: query.result.appAccount,
      sessionRequest: query.result.sessionRequest,
    }}/>}
    {/* <InspectObject object={query}/> */}
  </Box>
}

function LoginRequest({ id, appAccount, sessionRequest }){
  const command = useCommand('loginRequests.resolve', { id })

  React.useEffect(
    () => {
      console.log('LOGIN REQ RESOLVED', command)
      // if (command.result) goToPage('DocumentShow', { id: command.result })
    },
    [command.state]
  )

  const onAccept = React.useCallback(
    () => { command.call({ accept: true }) },
    [command.state]
  )
  const onReject = React.useCallback(
    () => { command.call({ accept: false }) },
    [command.state]
  )

  return <Paper
    elevation={3}
    sx={{
      mt: 2,
      p: 2,
      maxWidth: '400px',
    }}
  >
    <Typography variant="h3" sx={{mb: 1}}>Login?</Typography>
    <Typography variant="body1">
      Someone has requested to login to your&nbsp;
      <Link to={toPage('AccountShow', { id: appAccount.id })}>
        {appAccount.host}
      </Link>
      &nbsp;account.
    </Typography>

    <Box sx={{m: 2}}>
      <Typography variant="body2">
        {`IP: ${sessionRequest?.sourceInfo?.ip}`}
      </Typography>
      <Typography variant="body2">
        {
          `${sessionRequest?.sourceInfo?.ua?.browser?.name} ` +
          `${sessionRequest?.sourceInfo?.ua?.browser?.major}`
        }
      </Typography>
      <Typography variant="body2">
        {
          `${sessionRequest?.sourceInfo?.ua?.os?.name} ` +
          `${sessionRequest?.sourceInfo?.ua?.os?.version}`
        }
      </Typography>
    </Box>

    <Box sx={{
      mt: 2,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    }}>
      <Button {...{
        variant: 'text',
        onClick: onReject,
        disabled: !command.idle,
        sx: {mr: 1}
      }}>{'Reject'}</Button>
      <Button {...{
        variant: 'contained',
        onClick: onAccept,
        disabled: !command.idle,
      }}>{'Accept and Login'}</Button>
    </Box>
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
