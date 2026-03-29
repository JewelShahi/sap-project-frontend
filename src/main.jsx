import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.jsx'
import ToastProvider from '@/components/toaster/ToastProvider.jsx'
import '@/index.css'
import { AuthProvider } from '@/context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider />
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
