import { useRef, useEffect } from 'react'

const eligibleRandomSongs = [
  'song_01.mp3',
  'song_02.mp3',
  'song_03.mp3',
  'song_04.mp3',
  'song_05.mp3',
]

const SongButton = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element on mount
    audioRef.current = new Audio()
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handlePlay = () => {
    // Get selected song from local storage
    let selectedSong = localStorage.getItem('selectedSong')
    
    if (!selectedSong || selectedSong.toLowerCase() == "random") {
      selectedSong = eligibleRandomSongs[Math.floor(Math.random() * eligibleRandomSongs.length)]
    }

    if (audioRef.current) {
      // Set the source to the selected song
      audioRef.current.src = `/songs/${selectedSong}`
      
      // Play the song
      audioRef.current.play().catch((error) => {
        console.error('Error playing song:', error)
        alert('Error playing song. Please try again.')
      })
    }
  }

  return (
    <button onClick={handlePlay} className="song-button">
      Play Song
    </button>
  )
}

export default SongButton

