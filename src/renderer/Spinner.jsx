import Box from '@mui/material/Box'
import src from './Spinner.svg'
import './Spinner.scss'

export default function Spinner(props){
  return <Box {...props} className="Spinner">
    <img {...{
      src,
      style: {width: '100%'},
    }} />
  </Box>
}
