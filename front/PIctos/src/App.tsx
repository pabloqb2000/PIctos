import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import FileUpload from './components/FileUpload'
import DefaultFiles from './components/DefaultFiles'
import SongSelector from './components/SongSelector'

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<>
          <h1>PIctos</h1>
          <nav className="navigation">
            <Link to="/file-upload" className="nav-link">File Upload</Link>
            <Link to="/default-files" className="nav-link">Default Files</Link>
            <Link to="/song-selector" className="nav-link">Song Selector</Link>
          </nav>
        </>} />
        <Route path="/file-upload" element={<FileUpload />} />
        <Route path="/default-files" element={<DefaultFiles />} />
        <Route path="/song-selector" element={<SongSelector />} />
      </Routes>
    </>
  )
}

export default App
