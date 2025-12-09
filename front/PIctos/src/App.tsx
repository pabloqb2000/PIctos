import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import FileUpload from './components/FileUpload'
import DefaultFiles from './components/DefaultFiles'

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<>
          <h1>PIctos</h1>
          <nav className="navigation">
            <Link to="/file-upload" className="nav-link">File Upload</Link>
            <Link to="/default-files" className="nav-link">Default Files</Link>
          </nav>
        </>} />
        <Route path="/file-upload" element={<FileUpload />} />
        <Route path="/default-files" element={<DefaultFiles />} />
      </Routes>
    </>
  )
}

export default App
