import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import BadgeIcon from '@mui/icons-material/Badge'
import KeyIcon from '@mui/icons-material/Key'
import SettingsIcon from '@mui/icons-material/Settings'
import LocationOnIcon from '@mui/icons-material/LocationOn'

export default function BottomNav(props) {
  const navigate = useNavigate()
  const location = useLocation()
  const onChange = React.useCallback(
    (event, pathname) => { navigate(`/${pathname}`) },
    [navigate]
  )
  return <BottomNavigation {...{
    value: location.pathname,
    onChange
  }}>
    <BottomNavigationAction
      label="IDs"
      value="ids"
      icon={<BadgeIcon />}
    />
    <BottomNavigationAction
      label="Keys"
      value="keys"
      icon={<KeyIcon />}
    />
    <BottomNavigationAction
      label="Settings"
      value="settings"
      icon={<SettingsIcon />}
    />
  </BottomNavigation>
}
