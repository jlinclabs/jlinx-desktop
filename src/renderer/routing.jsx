import * as React from 'react'
import { useCallback } from 'react'

import {
  MemoryRouter as Router,
  Routes as ReactRouterRoutes,
  Route,
  Navigate,
  useRoutes,
  useSearchParams,
  useLocation,
  useHref,
  useNavigate,
} from 'react-router-dom'

import DidsPage from './DidsPage'
import DidShowPage from './DidShowPage'
import DidCreatePage from './DidCreatePage'
import KeysListPage from './KeysListPage'
import KeyShowPage from './KeyShowPage'
import KeyCreatePage from './KeyCreatePage'
import SettingsPage from './SettingsPage'

const pages = [
  // HomePage,
  DidsPage,
  DidCreatePage,
  // DidResolvePage,
  DidShowPage,
  KeysListPage,
  KeyCreatePage,
  KeyShowPage,
  SettingsPage,
]

export function CurrentRoute(){
  const [searchParams] = useSearchParams()
  const params = {}
  for (const [key, value] of searchParams) params[key] = value
  const routes = [
    {
      path: '/',
      element: <Navigate replace to="/DidsPage" />,
    },
    ...pages.map(Page => ({
      path: `/${Page.name}`,
      element: <Page {...{params}}/>,
    })),
    {
      path: '*',
      element: <Navigate to="/DidsPage" />,
    },
  ]
  const route = useRoutes(routes)
  return route
}

export { Router, useLocation, useHref, useNavigate }

export function openExternalUrl(url){
  window.electron.shell.openExternal(url)
}

export function toPage(pageName, params = {}){
  const page = pages.find(page => page.name === pageName)
  if (!page) throw new Error(`page "${pageName}" not found`)
  const search = paramsToSearch(params)
  console.log('TO PAGE', {pathname: `/${page.name}`, search})
  return {pathname: `/${page.name}`, search}
}

export function useGoToPage(){
  const navigate = useNavigate()
  return useCallback(
    (pageName, params) => {
      navigate(toPage(pageName, params))
    },
    [navigate]
  )
}


function paramsToSearch(params){
  const search = new URLSearchParams()
  for (const prop in params) search.set(prop, params[prop])
  return search.toString()
}

function searchToParams(search){
  const searchParams = new URLSearchParams(search);
  const props = {}
  for (const prop of searchParams)
    props[prop] = searchParams.get(prop)
  return props
}
