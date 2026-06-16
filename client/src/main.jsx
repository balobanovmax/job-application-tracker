import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/themes.css'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Auth0ProviderWithNavigate from './components/Auth0ProviderWithNavigate'
import { ThemeProvider } from './context/ThemeContext.jsx'

const storedTheme = localStorage.getItem('theme')
document.documentElement.setAttribute(
  'data-theme',
  storedTheme === 'light' ? 'light' : 'dark'
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          <App />
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
