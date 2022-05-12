import { useState, useEffect } from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import './App.css'

import Spinner from './Spinner'
import TopNav from './TopNav'
import BottomNav from './BottomNav'

import MainPage from './MainPage'
import IdsPage from './IdsPage'
import KeysPage from './KeysPage'
import SettingsPage from './SettingsPage'


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
    <Container
      disableGutters
      sx={{
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <TopNav />
      <Paper sx={{ p: 1, flexGrow: 1 }} elevation={1}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/ids" element={<IdsPage />} />
          <Route path="/keys" element={<KeysPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Paper>
      <Paper elevation={3} >
        <BottomNav />
      </Paper>
    </Container>
  </Router>
}
