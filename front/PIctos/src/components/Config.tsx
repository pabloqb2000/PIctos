import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Config = () => {
  const [selectedSong, setSelectedSong] = useState<string>('')
  const [apiUrl, setApiUrl] = useState<string>('')
  const [availableSongs] = useState<string[]>([
    'song_01.mp3',
    'song_02.mp3',
    'full_song.mp3',
    'short_song.mp3',
  ])

  const defaultApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    // Load selected song from local storage on mount
    const storedSong = localStorage.getItem('selectedSong')
    if (storedSong) {
      setSelectedSong(storedSong)
    } else if (availableSongs.length > 0) {
      // Set default to first song if nothing is stored
      setSelectedSong(availableSongs[0])
      localStorage.setItem('selectedSong', availableSongs[0])
    }

    // Load API URL from local storage on mount
    const storedApiUrl = localStorage.getItem('apiUrl')
    if (storedApiUrl) {
      setApiUrl(storedApiUrl)
    } else {
      // Set default API URL if nothing is stored
      setApiUrl(defaultApiUrl)
      localStorage.setItem('apiUrl', defaultApiUrl)
    }
  }, [availableSongs, defaultApiUrl])

  const handleSongChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const song = event.target.value
    setSelectedSong(song)
    localStorage.setItem('selectedSong', song)
  }

  const handleApiUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    setApiUrl(url)
    localStorage.setItem('apiUrl', url)
  }

  return (
    <div className="song-selector">
      <h2>Config</h2>
      <div className="selector-container">
        <label htmlFor="api-url-input">API URL:</label>
        <input
          id="api-url-input"
          type="text"
          value={apiUrl}
          onChange={handleApiUrlChange}
          placeholder={defaultApiUrl}
          style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '16px' }}
        />
      </div>
      <div className="selector-container">
        <label htmlFor="song-select">Song Selector:</label>
        <select
          id="song-select"
          value={selectedSong}
          onChange={handleSongChange}
          className="image-set-selector"
        >
          {availableSongs.map((song) => (
            <option key={song} value={song}>
              {song}
            </option>
          ))}
        </select>
      </div>
      {selectedSong && false && (
        <p className="selected-song-info">
          Selected: <strong>{selectedSong}</strong>
        </p>
      )}
      <nav className="navigation">
        <Link to="/" className="nav-link">Home</Link>
      </nav>
    </div>
  )
}

export default Config

