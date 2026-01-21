// src/components/DebugStorage.jsx
// Add this temporarily to your AdminLogin page to see what's in localStorage

import { useState, useEffect } from 'react'

const DebugStorage = () => {
  const [storage, setStorage] = useState({})

  const refreshStorage = () => {
    const items = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      items[key] = localStorage.getItem(key)
    }
    setStorage(items)
  }

  useEffect(() => {
    refreshStorage()
    
    // Refresh every second
    const interval = setInterval(refreshStorage, 1000)
    return () => clearInterval(interval)
  }, [])

  const clearAll = () => {
    localStorage.clear()
    refreshStorage()
    window.location.reload()
  }

  const clearUserOnly = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userToken')
    refreshStorage()
  }

  const clearAdminOnly = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')
    refreshStorage()
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-auto z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">🔍 LocalStorage Debug</h3>
        <button 
          onClick={refreshStorage}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-2 mb-3">
        {Object.keys(storage).length === 0 ? (
          <p className="text-xs text-gray-500">LocalStorage is empty</p>
        ) : (
          Object.entries(storage).map(([key, value]) => (
            <div key={key} className="border border-gray-200 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold ${
                  key.includes('user') || key.includes('User') ? 'text-green-600' :
                  key.includes('admin') || key.includes('Admin') ? 'text-blue-600' :
                  'text-gray-600'
                }`}>
                  {key}
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem(key)
                    refreshStorage()
                  }}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-gray-600 break-all max-h-20 overflow-auto">
                {value.substring(0, 100)}
                {value.length > 100 ? '...' : ''}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={clearUserOnly}
          className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Clear User
        </button>
        <button
          onClick={clearAdminOnly}
          className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Clear Admin
        </button>
        <button
          onClick={clearAll}
          className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Clear All & Reload
        </button>
      </div>
    </div>
  )
}

export default DebugStorage