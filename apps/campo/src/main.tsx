import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { avisarSeInconsistente } from '@termovida/shared'
import '@termovida/shared/tokens.css'
import '@termovida/shared/base.css'
import './styles.css'
import { App } from './App'
import { ProvedorEstado } from './estado'

if (import.meta.env.DEV) avisarSeInconsistente()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProvedorEstado>
        <App />
      </ProvedorEstado>
    </BrowserRouter>
  </StrictMode>,
)
