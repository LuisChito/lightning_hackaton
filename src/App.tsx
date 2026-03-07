import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { router } from './application/routes/routers'
import { background, primary, text } from './theme/colors'
import './App.css'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: background.primary,
      paper: background.secondary,
    },
    primary: {
      main: primary.main,
    },
    text: {
      primary: text.primary,
      secondary: text.secondary,
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
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
