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

import DocumentsPage from './DocumentsPage'
import DocumentShowPage from './DocumentShowPage'
import IdentificationsPage from './IdentificationsPage'
import IdentificationCreatePage from './IdentificationCreatePage'
import IdentificationShowPage from './IdentificationShowPage'
import AccountsPage from './AccountsPage'
import AccountAddPage from './AccountAddPage'
// import DidsPage from './DidsPage'
// import DidShowPage from './DidShowPage'
// import DidCreatePage from './DidCreatePage'
// import DidResolvePage from './DidResolvePage'
// import KeysListPage from './KeysListPage'
// import KeyShowPage from './KeyShowPage'
// import KeyCreatePage from './KeyCreatePage'
import SettingsPage from './SettingsPage'

const HOMEPAGE = "/Documents"

const pages = [
  DocumentsPage,
  DocumentShowPage,
  IdentificationsPage,
  IdentificationCreatePage,
  IdentificationShowPage,
  AccountsPage,
  AccountAddPage,
  // DidsPage,
  // DidCreatePage,
  // DidResolvePage,
  // DidShowPage,
  // KeysListPage,
  // KeyCreatePage,
  // KeyShowPage,
  SettingsPage,
]

const pageToName = page => page.name.split('Page')[0]
const pageToPath = page => `/${pageToName(page)}`

export function CurrentRoute(){
  const [searchParams] = useSearchParams()
  const params = {}
  for (const [key, value] of searchParams) params[key] = value
  const routes = [
    {
      path: '/',
      element: <Navigate replace to={HOMEPAGE} />,
    },
    ...pages.map(Page => ({
      path: pageToPath(Page),
      element: <Page {...{params}}/>,
    })),
    {
      path: '*',
      // element: <Navigate to="/DidsPage" />,
      element: <span>NOT FOUND</span>
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
  const page = pages.find(page => pageToName(page) === pageName)
  if (!page) throw new Error(`page "${pageName}" not found`)
  const search = paramsToSearch(params)
  return {pathname: pageToPath(page), search}
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
