import { useState } from 'react'
import '../App.css'
import { uploadImage } from '../services/imageService'
import { fetchImageAsFile } from '../utils/fileUtils'
import SongButton from './SongButton'

interface ImageItem {
  img_filename: string
}

interface ImageSet {
  name: string
  images: ImageItem[]
}

function DefaultFiles() {
  // Define image sets - each set contains a list of image dictionaries
  const dir_name = 'imgs/'
  const imageSets: ImageSet[] = [
    {
      name: 'Set 1',
      images: [
        { img_filename: 'ojos.png' },
        { img_filename: 'pelo.png' },
      ],
    },
    {
      name: 'Set 2',
      images: [
        { img_filename: 'ojos.png' },
        { img_filename: 'ojos.png' },
        { img_filename: 'pelo.png' },
        { img_filename: 'pelo.png' },
        { img_filename: 'pelo.png' },
        { img_filename: 'pelo.png' },
        { img_filename: 'pelo.png' },
      ],
    },
  ]

  const [selectedSetIndex, setSelectedSetIndex] = useState(0)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedSet = imageSets[selectedSetIndex]

  const handleImageClick = async (imageItem: ImageItem, index: number) => {
    setUploadingIndex(index)
    setError(null)
    setMessage(null)

    try {
      // Fetch the image from public folder and convert to File
      const file = await fetchImageAsFile(dir_name + imageItem.img_filename)
      
      // Upload to backend
      const data = await uploadImage(file)
      setMessage(`Success! ${data.message} - ${data.filename}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while uploading')
    } finally {
      setUploadingIndex(null)
    }
  }

  return (
    <div className="default-files-container">
      <div className="selector-container">
        <select
          id="image-set-selector"
          value={selectedSetIndex}
          onChange={(e) => {
            setSelectedSetIndex(Number(e.target.value))
            setMessage(null)
            setError(null)
          }}
          className="image-set-selector"
        >
          {imageSets.map((set, index) => (
            <option key={index} value={index}>
              {set.name}
            </option>
          ))}
        </select>
      </div>

      <div className="image-grid">
        {selectedSet.images.map((imageItem, index) => (
          <button
            key={index}
            className={`image-button ${uploadingIndex === index ? 'uploading' : ''}`}
            onClick={() => handleImageClick(imageItem, index)}
            disabled={uploadingIndex !== null}
          >
            <img
              src={`/${dir_name}${imageItem.img_filename}`}
              alt={imageItem.img_filename}
              className="button-image"
            />
            {uploadingIndex === index && (
              <div className="button-spinner"></div>
            )}
          </button>
        ))}
      </div>
      <center>
        <SongButton />
      </center>

      {message && false && (
        <div className="message success">
          {message}
        </div>
      )}

      {error && (
        <div className="message error">
          {error}
        </div>
      )}
    </div>
  )
}

export default DefaultFiles
