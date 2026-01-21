import { createContext, useContext, useState, useEffect } from 'react'
import { locationService } from '../services/locationService'
import API from "../api/api"
import toast from 'react-hot-toast'



const LocationContext = createContext()

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load saved location from localStorage
    const savedLocation = localStorage.getItem('selectedLocation')
    if (savedLocation) {
      setSelectedLocation(JSON.parse(savedLocation))
    }

    // Load saved addresses
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      setLoading(true)
      // ✅ FETCH USER'S SAVED ADDRESS FROM BACKEND
      const token = localStorage.getItem('token')
      if (token) {
        const res = await API.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const user = res.data
        if (user.address) {
          const userAddress = {
            id: 'user-address',
            name: user.name || 'User',
            address: user.address,
            city: user.city,
            state: user.state,
            pincode: user.pincode,
            phone: user.phone,
            type: 'Home',
            isDefault: true
          }
          setAddresses([userAddress])
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
      // Fallback to localStorage if backend fails
      const savedAddresses = localStorage.getItem('addresses')
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses))
      }
    } finally {
      setLoading(false)
    }
  }

  const setLocation = async (location) => {
    try {
      // Check serviceability
      if (location.lat && location.lng) {
        // const serviceable = await locationService.checkServiceability(location.lat, location.lng)
        // For now, assume serviceable
        setSelectedLocation(location)
        localStorage.setItem('selectedLocation', JSON.stringify(location))
        toast.success('Location updated successfully')
      } else {
        setSelectedLocation(location)
        localStorage.setItem('selectedLocation', JSON.stringify(location))
      }
    } catch (error) {
      toast.error('Failed to set location')
      throw error
    }
  }

  const saveAddress = async (addressData) => {
    try {
      // ✅ SAVE ADDRESS TO BACKEND
      const token = localStorage.getItem('token')
      const res = await API.put('/users/address', addressData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const updatedUser = res.data
      const userAddress = {
        id: 'user-address',
        name: updatedUser.name || 'User',
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        pincode: updatedUser.pincode,
        phone: updatedUser.phone,
        type: 'Home',
        isDefault: true
      }

      setAddresses([userAddress])
      toast.success('Address saved successfully')
      return userAddress
    } catch (error) {
      toast.error('Failed to save address')
      throw error
    }
  }

  const deleteAddress = async (addressId) => {
    try {
      // await locationService.deleteAddress(addressId)
      const updatedAddresses = addresses.filter((addr) => addr.id !== addressId)
      setAddresses(updatedAddresses)
      localStorage.setItem('addresses', JSON.stringify(updatedAddresses))
      toast.success('Address deleted successfully')
    } catch (error) {
      toast.error('Failed to delete address')
      throw error
    }
  }

  const detectLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            // Reverse geocoding to get address
            // In real app, use Google Maps Geocoding API or similar
            const location = {
              lat: latitude,
              lng: longitude,
              address: `Lat: ${latitude}, Lng: ${longitude}`,
              type: 'current',
            }
            await setLocation(location)
            resolve(location)
          } catch (error) {
            reject(error)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  }

  const value = {
    selectedLocation,
    addresses,
    loading,
    setLocation,
    saveAddress,
    deleteAddress,
    detectLocation,
    loadAddresses,
  }

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}


