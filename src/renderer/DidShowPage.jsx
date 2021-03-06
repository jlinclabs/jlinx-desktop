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
import Alert from '@mui/material/Alert'
import ImageIcon from '@mui/icons-material/Image'

import PageHeader from './PageHeader'
import Link from './Link'
import InspectObject from './InspectObject'
import { useQuery } from './ipc'

export default function DidShowPage(props){
  const { did } = props.params
  const query = useQuery('getDidDocument', did)
  console.log(query)
  return <Box sx={{ flexGrow: 1 }}>
    <PageHeader>{did}</PageHeader>
    {query.error && <Alert severity="error">{`${query.error}`}</Alert>}
    {query.resolved && <DidDocument {...{ didDocument: query.result }}/>}
    <ol>
      {['https://testnet1.jlinx.io', 'https://testnet2.jlinx.io'].map(host =>
        <li key={host}>view on <Link href={`${host}/${did}`}>{host}</Link></li>
      )}
    </ol>
  </Box>
}

function DidDocument({ didDocument }){
  console.log({ didDocument })
  return <InspectObject object={didDocument}/>
}
