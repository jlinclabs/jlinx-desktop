import * as React from 'react'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import BadgeIcon from '@mui/icons-material/Badge'
import KeyIcon from '@mui/icons-material/Key'
import SettingsIcon from '@mui/icons-material/Settings'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useLocation, useGoToPage } from './routing'

export default function BottomNav(props) {
  // const navigate = useNavigate()
  const location = useLocation()
  console.log({ location })
  const goToPage = useGoToPage()
  const onChange = React.useCallback(
    (event, pageName) => { goToPage(pageName) },
    [goToPage]
  )

  return <BottomNavigation {...{
    value: location.pathname.slice(1),
    onChange,
    sx: {
      backgroundColor: 'primary.dark',
      'button': {
        color: 'grey.900',
      },
    },
  }}>
    <BottomNavigationAction
      label="DIDs"
      value="Dids"
      icon={<BadgeIcon />}
    />
    <BottomNavigationAction
      label="Keys"
      value="Keys"
      icon={<KeyIcon />}
    />
    <BottomNavigationAction
      label="Settings"
      value="Settings"
      icon={<SettingsIcon />}
    />
  </BottomNavigation>
}
