/**
 * Converts a File object to a base64 string
 * @param file - The file to convert
 * @returns Promise that resolves to the base64 string (without data URL prefix)
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Validates if a file is an image
 * @param file - The file to validate
 * @returns true if the file is an image, false otherwise
 */
export const validateImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

