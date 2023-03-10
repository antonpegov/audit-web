import { SnackbarProvider } from 'notistack'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Slide, ThemeProvider } from '@mui/material'
import ReactDOM from 'react-dom/client'

import 'index.css'
import App from 'App'
import { store } from 'app.store'
import { AppHeader } from 'shared/containers/app-header/AppHeader'
import { theme } from 'theme'
import { AppFooter } from 'shared/containers/app-footer/AppFooter'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        TransitionComponent={Slide}
        maxSnack={3}
      >
        <BrowserRouter>
          <AppHeader />

          <AnimatePresence>
            <App />
          </AnimatePresence>

          <AppFooter />
        </BrowserRouter>
      </SnackbarProvider>
    </Provider>
  </ThemeProvider>,
)
