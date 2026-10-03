import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Setup from './pages/Setup.jsx'
import Interview from './pages/Interview.jsx'
import Report from './pages/Report.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/report" element={<Report />} />
    </Routes>
  )
}