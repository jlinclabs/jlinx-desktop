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

export default function IdentificationShowPage(props){
  const { id } = props.params
  console.log({ id })
  const query = useQuery('getAllIdentifications')
  console.log(query)
  return <Box sx={{ flexGrow: 1 }}>
    <PageHeader>Identification</PageHeader>
    <p>{id}</p>
    {query.error && <Alert severity="error">{`${query.error}`}</Alert>}
    {query.resolved && <Identification {...{
      identification: query.result.find(i => i.id === id)
    }}/>}
    <ol>
      {['https://testnet1.jlinx.io', 'https://testnet2.jlinx.io'].map(host =>
        <li key={host}>view on <Link href={`${host}/${id}`}>{host}</Link></li>
      )}
    </ol>
  </Box>
}

function Identification({ identification }){
  console.log({ identification })
  return <InspectObject object={identification}/>
}
