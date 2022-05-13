import { useState, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import { Router, CurrentRoute, useLocation, useHref } from './routing'
import './App.css'

import Spinner from './Spinner'
import TopNav from './TopNav'
import BottomNav from './BottomNav'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function App() {
  const [loaded, setLoaded] = useState(false)
  useEffect(
    () => {
      setTimeout(() => { setLoaded(true) }, 1000)
    },
    []
  )
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {loaded ? <Loaded /> : <Loading />}
    </ThemeProvider>
  )
}

function Loading(){
  return <Container
    disableGutters
    sx={{
      position: 'fixed',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Spinner sx={{
      width: '20vw',
    }}/>
  </Container>
}

function Loaded(){
  return <Router>
    <LogLocation />
    <Container
      disableGutters
      sx={{
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <TopNav />
      <Paper
        sx={{
          flexGrow: 1,
          maxHeight: 'calc(100vh - 64px - 56px)',
          overflow: 'scroll',
        }}
        elevation={1}
      >
        <CurrentRoute />
      </Paper>
      <Paper elevation={3} >
        <BottomNav />
      </Paper>
    </Container>
  </Router>
}

function LogLocation(){
  const location = useLocation()
  const href = useHref(location)
  console.log('➡', href)
  // window.location is not where this app manages location
  // console.log('➡', (window.location+'').split(window.location.origin)[1])
}
