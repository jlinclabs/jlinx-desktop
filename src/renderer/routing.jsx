import * as React from 'react'
import { useCallback } from 'react'

import { handleCommand } from './ipc'

import {
  MemoryRouter,
  Routes as ReactRouterRoutes,
  Route,
  Navigate,
  useRoutes,
  useSearchParams,
  useLocation,
  useParams,
  useSearchParams,
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
import AccountShowPage from './AccountShowPage'
import LoginRequestsPage from './LoginRequestsPage'
// import DidsPage from './DidsPage'
// import DidShowPage from './DidShowPage'
// import DidCreatePage from './DidCreatePage'
// import DidResolvePage from './DidResolvePage'
// import KeysListPage from './KeysListPage'
// import KeyShowPage from './KeyShowPage'
// import KeyCreatePage from './KeyCreatePage'
import SettingsPage from './SettingsPage'

const START_PAGE = (
  ('currentPage' in sessionStorage)
    ? JSON.parse(sessionStorage.currentPage)
    : { pathname: '/Documents' }
)
console.log(`START_PAGE`, START_PAGE)

const pages = [
  DocumentsPage,
  DocumentShowPage,
  IdentificationsPage,
  IdentificationCreatePage,
  IdentificationShowPage,
  AccountsPage,
  AccountAddPage,
  AccountShowPage,
  LoginRequestsPage,
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
  const { pathname, search } = useLocation()
  sessionStorage.currentPage = JSON.stringify({ pathname, search })
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())

  const routes = [
    {
      path: '/',
      element: <Navigate replace to={START_PAGE} />,
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

export { useLocation, useHref, useNavigate }

export function Router({children, ...props}){
  return <MemoryRouter {...props}>
    <MainProcessEventListener />
    {children}
  </MemoryRouter>
}

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

export function useCurrentPage(){
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const pageName = location.pathname.slice(1)
  console.log('CurrentPage:', { pageName, params })
  return { pageName, params }
}

function MainProcessEventListener(){
  const currentPage = useCurrentPage()
  const goToPage = useGoToPage()
  Object.assign(global, { currentPage, goToPage })
  React.useEffect(
    () => {
      return window.electron.ipcRenderer.on('gotoPage', (opts) => {
        const { pageName, params } = opts
        goToPage(pageName, params)
      })
    },
    []
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
