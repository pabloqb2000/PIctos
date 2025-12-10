import { fileToBase64 } from '../utils/fileUtils'

const getApiUrl = (): string => {
  const storedUrl = localStorage.getItem('apiUrl')
  if (storedUrl) {
    return storedUrl
  }
  const defaultUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  localStorage.setItem('apiUrl', defaultUrl)
  return defaultUrl
}

export interface UploadImageResponse {
  message: string
  filename: string
}

export interface UploadImageError {
  detail: string
}

/**
 * Uploads an image file to the backend server
 * @param file - The image file to upload
 * @returns Promise that resolves to the upload response
 * @throws Error if the upload fails or the file is invalid
 */
export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  // Convert file to base64
  const base64 = await fileToBase64(file)

  // Get current API URL from localStorage
  const currentApiUrl = getApiUrl()

  // Send to backend
  const response = await fetch(`${currentApiUrl}/upload-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_base64: base64,
    }),
  })

  if (!response.ok) {
    const errorData: UploadImageError = await response.json()
    throw new Error(errorData.detail || 'Failed to upload image')
  }

  const data: UploadImageResponse = await response.json()
  return data
}

