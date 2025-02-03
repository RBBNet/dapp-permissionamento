import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { configPromise } from './util/configLoader.ts'

const config = await configPromise;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App config={config} />
  </StrictMode>,
)
