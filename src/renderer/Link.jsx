import * as React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import MUILink from '@mui/material/Link'
import { openExternalUrl } from './routing'

const Link = React.forwardRef(({...props}, ref) => {
  props.ref = ref
  if (props.href){
    props.onClick = openExternal
  }else{
    props.component = RouterLink
  }
  return <MUILink {...props}/>
})

export default Link

function openExternal(event){
  const url = event.target.getAttribute('href')
  event.preventDefault()
  openExternalUrl(url)
  return false
}
