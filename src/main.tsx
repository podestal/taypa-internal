import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TrackerMain from './components/tracker/TrackerMain.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TrackerMain />
  </StrictMode>,
)
