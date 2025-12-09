import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SongSelector = () => {
  const [selectedSong, setSelectedSong] = useState<string>('')
  const [availableSongs] = useState<string[]>([
    'song_01.mp3',
    'song_02.mp3'
  ])

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
  }, [availableSongs])

  const handleSongChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const song = event.target.value
    setSelectedSong(song)
    localStorage.setItem('selectedSong', song)
  }

  return (
    <div className="song-selector">
      <h2>Song Selector</h2>
      <div className="selector-container">
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

export default SongSelector

