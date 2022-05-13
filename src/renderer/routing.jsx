import * as React from 'react'
import { useCallback } from 'react'

import {
  MemoryRouter as Router,
  Routes as ReactRouterRoutes,
  Route,
  Navigate,
  useRoutes,
  useLocation,
  useHref,
  useNavigate,
} from 'react-router-dom'

import DidsPage from './DidsPage'
import DidShowPage from './DidShowPage'
import DidCreatePage from './DidCreatePage'
import KeysPage from './KeysPage'
import SettingsPage from './SettingsPage'

const pages = [
  {
    path: '/',
    element: <Navigate replace to="/dids" />,
  },
  {
    name: 'Dids',
    path: '/dids',
    element: <DidsPage />,
  },
  {
    name: 'DidCreate',
    path: '/dids/new',
    element: <DidCreatePage />,
  },
  {
    name: 'DidShow',
    path: '/dids/:did',
    element: <DidShowPage />,
  },
  {
    name: 'Keys',
    path: '/keys',
    element: <KeysPage />,
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]

export function CurrentRoute(){
  return useRoutes(pages)
}

export { Router, useLocation, useHref, useNavigate }

export function openExternalUrl(url){
  window.electron.shell.openExternal(url)
}

export function useGoToPage(){
  const navigate = useNavigate()
  return useCallback(
    (pageName, params) => {
      const page = pages.find(page => page.name === pageName)
      if (!page) throw new Error(`page "${pageName}" not found`)
      navigate({pathname: page.path})
    },
    [navigate]
  )
}
