import * as React from 'react'
import { useParams } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Skeleton from '@mui/material/Skeleton'
import Avatar from '@mui/material/Avatar'
import Alert from '@mui/material/Alert'
import ImageIcon from '@mui/icons-material/Image'

import Link from './Link'
import InspectObject from './InspectObject'

import { useJlinxDidDocumentQuery } from './jlinxHooks'

export default function DidShowPage(){
  const { did } = useParams()
  const query = useJlinxDidDocumentQuery(did)

  return <Box sx={{ flexGrow: 1 }}>
    <Typography sx={{m:1}} variant="h4" component="h1" gutterBottom>
      DIDs
    </Typography>
    {query.error && <Alert severity="error">{`${query.error}`}</Alert>}
    {query.loaded && <DidDocument {...{ didDocument: query.result }}/>}
    <ol>
      {['https://testnet1.jlinx.io', 'https://testnet2.jlinx.io'].map(host =>
        <li key={host}>view on <Link href={`${host}/${did}`}>{host}</Link></li>
      )}
    </ol>
  </Box>
}

function DidDocument({ didDocument }){
  return <Box sx={{
    m: 1,
    backgroundColor: 'background.paper',
  }}>
    <InspectObject object={didDocument}/>
  </Box>
}
