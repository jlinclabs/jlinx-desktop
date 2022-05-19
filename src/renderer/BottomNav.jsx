import * as React from 'react'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount'
import BadgeIcon from '@mui/icons-material/Badge'
import KeyIcon from '@mui/icons-material/Key'
import SettingsIcon from '@mui/icons-material/Settings'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useLocation, useGoToPage } from './routing'

export default function BottomNav(props) {
  const location = useLocation()
  const goToPage = useGoToPage()
  const onChange = React.useCallback(
    (event, pageName) => { goToPage(pageName) },
    [goToPage]
  )
  const height = 56
  return <Box sx={{ height }}>
    <BottomNavigation {...{
      value: location.pathname.slice(1),
      onChange,
      sx: {
        height,
        postition: 'fixed',
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'primary.dark',
        'button': {
          color: 'grey.900',
        },
      },
    }}>
      <BottomNavigationAction
        label="Accounts"
        value="Accounts"
        icon={<SwitchAccountIcon />}
      />
      <BottomNavigationAction
        label="DIDs"
        value="Dids"
        icon={<BadgeIcon />}
      />
      <BottomNavigationAction
        label="Keys"
        value="KeysList"
        icon={<KeyIcon />}
      />
      <BottomNavigationAction
        label="Settings"
        value="Settings"
        icon={<SettingsIcon />}
      />
    </BottomNavigation>
  </Box>
}
