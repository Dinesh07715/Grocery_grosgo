import API from '../api/api'
import { API_ENDPOINTS, getApiUrl } from '../config/api'

export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await API.get(API_ENDPOINTS.PRODUCTS, { params })
    return response.data
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await API.get(getApiUrl(API_ENDPOINTS.PRODUCT_DETAIL, { id }))
    return response.data
  },

  // Get products by category
  getProductsByCategory: async (category, options = {}) => {
    try {
      const { sortBy, minPrice, maxPrice, inStock } = options
      
      console.log('🔍 Fetching products for category:', category)
      
      // Try to fetch from category endpoint first
      try {
        const response = await API.get(getApiUrl(API_ENDPOINTS.PRODUCTS_BY_CATEGORY, { category }))
        let products = response.data.products || response.data || []
        
        console.log('📦 Products from category endpoint:', products.length)
        
        // If we got products from the category endpoint, apply filters
        if (products.length > 0) {
          // Apply price filters
          if (minPrice !== '' && minPrice !== undefined) {
            products = products.filter(p => (p.price || 0) >= Number(minPrice))
          }
          if (maxPrice !== '' && maxPrice !== undefined) {
            products = products.filter(p => (p.price || 0) <= Number(maxPrice))
          }
          
          // Apply stock filter
          if (inStock) {
            products = products.filter(p => (p.stock || p.inStock || 0) > 0)
          }
          
          // Apply sorting
          if (sortBy === 'price-low') {
            products.sort((a, b) => (a.price || 0) - (b.price || 0))
          } else if (sortBy === 'price-high') {
            products.sort((a, b) => (b.price || 0) - (a.price || 0))
          } else if (sortBy === 'name') {
            products.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          } else if (sortBy === 'rating') {
            products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          } else {
            products.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          }
          
          console.log('✅ Final filtered products:', products.length)
          return { products, total: products.length }
        }
      } catch (categoryError) {
        console.log('⚠️ Category endpoint failed, falling back to all products')
      }
      
      // Fallback: Fetch all products and filter client-side
      const response = await API.get(API_ENDPOINTS.PRODUCTS)
      let products = response.data.products || response.data || []

      console.log('📦 Total products from API:', products.length)
      
      // Log sample products to see structure
      if (products.length > 0) {
        console.log('📦 Sample product:', products[0])
      }

      // Filter by category
      products = products.filter(product => {
        const productCategory = (product.category || product.categoryName || '').toLowerCase()
        const searchCategory = category.toLowerCase()
        
        // Try multiple matching strategies
        const exactMatch = productCategory === searchCategory
        const partialMatch = productCategory.includes(searchCategory) || searchCategory.includes(productCategory)
        const nameMatch = product.name?.toLowerCase().includes(searchCategory)
        
        return exactMatch || partialMatch || nameMatch
      })

      console.log('✅ After category filter:', products.length, 'products')

      // Filter by price range
      if (minPrice !== '' && minPrice !== undefined) {
        products = products.filter(p => (p.price || 0) >= Number(minPrice))
        console.log('💰 After min price filter:', products.length)
      }
      if (maxPrice !== '' && maxPrice !== undefined) {
        products = products.filter(p => (p.price || 0) <= Number(maxPrice))
        console.log('💰 After max price filter:', products.length)
      }

      // Filter by stock
      if (inStock) {
        products = products.filter(p => (p.stock || p.inStock || 0) > 0)
        console.log('📦 After stock filter:', products.length)
      }

      // Sort products
      if (sortBy === 'price-low') {
        products.sort((a, b) => (a.price || 0) - (b.price || 0))
      } else if (sortBy === 'price-high') {
        products.sort((a, b) => (b.price || 0) - (a.price || 0))
      } else if (sortBy === 'name') {
        products.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      } else if (sortBy === 'rating') {
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      } else {
        // Default to popularity
        products.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      }

      console.log('✅ Final products:', products.length)

      return { products, total: products.length }
    } catch (error) {
      console.error('❌ Error fetching products by category:', error)
      throw error
    }
  },

  // Get products by multiple categories (combines results)
  getProductsByCategories: async (categories, options = {}) => {
    try {
      const { sortBy, minPrice, maxPrice, inStock } = options
      
      console.log('🔍 Fetching products for categories:', categories)
      
      // Fetch all products - use the PRODUCTS endpoint from config
      const response = await API.get(API_ENDPOINTS.PRODUCTS)
      let products = response.data.products || response.data || []

      console.log('📦 Total products from API:', products.length)

      // Filter by any of the categories
      products = products.filter(product => {
        const productCategory = (product.category || product.categoryName || '').toLowerCase()
        
        return categories.some(cat => {
          const searchCategory = cat.toLowerCase()
          return productCategory === searchCategory ||
                 productCategory.includes(searchCategory) || 
                 searchCategory.includes(productCategory) ||
                 product.name?.toLowerCase().includes(searchCategory)
        })
      })

      console.log('✅ After category filter:', products.length)

      // Apply filters
      if (minPrice !== '' && minPrice !== undefined) {
        products = products.filter(p => (p.price || 0) >= Number(minPrice))
      }
      if (maxPrice !== '' && maxPrice !== undefined) {
        products = products.filter(p => (p.price || 0) <= Number(maxPrice))
      }
      if (inStock) {
        products = products.filter(p => (p.stock || p.inStock || 0) > 0)
      }

      // Sort
      if (sortBy === 'price-low') {
        products.sort((a, b) => (a.price || 0) - (b.price || 0))
      } else if (sortBy === 'price-high') {
        products.sort((a, b) => (b.price || 0) - (a.price || 0))
      } else if (sortBy === 'name') {
        products.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      } else if (sortBy === 'rating') {
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      } else {
        products.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      }

      // Remove duplicates
      const uniqueProducts = products.filter((product, index, self) =>
        index === self.findIndex(p => p.id === product.id)
      )

      return { products: uniqueProducts, total: uniqueProducts.length }
    } catch (error) {
      console.error('❌ Error fetching products by categories:', error)
      throw error
    }
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await API.get(API_ENDPOINTS.SEARCH, {
      params: { q: query, ...params },
    })
    return response.data
  },

  // Get categories
  getCategories: async () => {
    const response = await API.get(API_ENDPOINTS.CATEGORIES)
    return response.data
  },

  // Get banners
  getBanners: async () => {
    const response = await API.get(API_ENDPOINTS.BANNERS)
    return response.data
  },
}