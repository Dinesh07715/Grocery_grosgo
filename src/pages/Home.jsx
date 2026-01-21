import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CategorySlider from '../components/CategorySlider'
import BannerCarousel from '../components/BannerCarousel'
import ProductSection from '../components/ProductSection'
import SkeletonLoader from '../components/SkeletonLoader'
import API from '../api/api'

const Home = () => {
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])

  const [allProducts, setAllProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [loading, setLoading] = useState(true)

  // 🔥 refs for category scroll
  const sectionRefs = useRef({})

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      setLoading(true)

      const res = await API.get('/foods/all')
      setAllProducts(res.data)

      setCategories([
        { id: 0, name: 'All', value: 'ALL', icon: '🛒' },
        { id: 1, name: 'Vegetables', value: 'Vegetables', icon: '🥦' },
        { id: 2, name: 'Fruits', value: 'Fruits', icon: '🍎' },
        { id: 3, name: 'Dairy', value: 'Dairy', icon: '🥛' },
        { id: 4, name: 'Bakery', value: 'Bakery', icon: '🍞' },
        { id: 5, name: 'Beverages', value: 'Beverages', icon: '🥤' },
        { id: 6, name: 'Snacks', value: 'Snacks', icon: '🍿' },
      ])

      setBanners([
        { id: 1, image: '/mango.jpg', title: 'Fresh Everyday', subtitle: 'Quality assured fruits & vegetables' },
        { id: 2, image: '/milk.jpg', title: 'Best Deals', subtitle: 'Amazing discounts on grocery items' },
        { id: 3, image: '/bread.jpg', title: 'Organic Products', subtitle: 'Farm fresh quality guaranteed' },
      ])
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setLoading(false)
    }
  }

  // 🔥 CATEGORY CLICK
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)

    if (category === 'ALL') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const section = sectionRefs.current[category]
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // =========================
  // 🔍 SEARCH FILTER (FIXED)
  // =========================
  const normalizedQuery = searchQuery.toLowerCase().trim()

  const searchedProducts = normalizedQuery
    ? allProducts.filter((product) =>
        product.name?.toLowerCase().includes(normalizedQuery) ||
        product.category?.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery)
      )
    : allProducts

  // =========================
  // 🗂 CATEGORY FILTER
  // =========================
  const categoryFilteredProducts =
    selectedCategory === 'ALL'
      ? searchedProducts
      : searchedProducts.filter(
          (product) => product.category === selectedCategory
        )

  // =========================
  // 📦 GROUP BY CATEGORY
  // =========================
  const productsByCategory = categoryFilteredProducts.reduce((acc, product) => {
    const category = product.category || 'Others'
    if (!acc[category]) acc[category] = []
    acc[category].push(product)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main>
        {/* Categories */}
        {loading ? (
          <div className="py-4 bg-white px-4 flex gap-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonLoader key={i} variant="category" />
            ))}
          </div>
        ) : (
          <CategorySlider
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {/* Banners */}
        {!loading && <BannerCarousel banners={banners} />}

        {/* Products */}
        {loading ? (
          <div className="px-4 py-6">
            <SkeletonLoader variant="productList" />
          </div>
        ) : Object.keys(productsByCategory).length === 0 ? (
          // ❌ NO SEARCH RESULTS
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src="/no-image.png"
              alt="No products"
              className="w-48 mb-6"
            />
            <h2 className="text-xl font-bold mb-2">No products found</h2>
            <p className="text-gray-500 mb-6">
              We couldn't find any products matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg"
            >
              Clear Search
            </button>
          </div>
        ) : (
          Object.entries(productsByCategory).map(([category, items]) => (
            <div
              key={category}
              ref={(el) => (sectionRefs.current[category] = el)}
            >
              <ProductSection
                title={category}
                products={items}
                category={category}
              />
            </div>
          ))
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Home
