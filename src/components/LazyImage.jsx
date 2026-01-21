import { useState, useEffect, useRef } from 'react'

const LazyImage = ({
  src,
  alt = '',
  className = '',
  onError,
  loading = 'lazy',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState('/no-image.png')
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef(null)

  useEffect(() => {
    if (!src) {
      console.warn('LazyImage: No src provided')
      setImageSrc('/no-image.png')
      setIsLoading(false)
      return
    }

    console.log('LazyImage: Loading', src)
    const img = new Image()
    img.src = src
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      console.log('LazyImage: Loaded successfully', src)
      setImageSrc(src)
      setIsLoading(false)
    }

    img.onerror = () => {
      console.error(`LazyImage: Failed to load image: ${src}`)
      setImageSrc('/no-image.png')
      setIsLoading(false)
      if (onError) onError()
    }
  }, [src, onError])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading={loading}
        {...props}
      />
    </div>
  )
}

export default LazyImage
