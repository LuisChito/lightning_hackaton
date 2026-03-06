import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import Header from './components/layout/components/header'
import './App.css'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#050914',
      paper: '#0d162b',
    },
    primary: {
      main: '#2f5fa8',
    },
    text: {
      primary: '#e8efff',
      secondary: '#b8c7e7',
    },
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-shell">
        <Header />
      </Box>
    </ThemeProvider>
  )
}

export default App
