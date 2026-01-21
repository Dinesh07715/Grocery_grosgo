// Helper utility functions

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL|| 'http://localhost:8081/api'
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2')
  }
  return phone
}

export const validatePhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10
}

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice) return 0
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100
  return Math.round(discount)
}

export const getTimeSlotLabel = (slot) => {
  const slots = {
    '10-15': '10-15 mins',
    '15-30': '15-30 mins',
    '30-45': '30-45 mins',
    '45-60': '45-60 mins',
  }
  return slots[slot] || slot
}

export const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const getImageUrl = (path) => {
  if (!imagepath) return '/no-image.png'
  if(imagepath.startsWith('http') || imagepath.startsWith('https')) return imagepath
  return `${API_BASE_URL}/${imagePath.replace(/^\//, '')}`
}


