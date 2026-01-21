// Mock data for development and demonstration
// Replace with actual API calls in production

export const mockCategories = [
  { id: 1, name: 'Fruits & Vegetables', icon: '🥬', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400' },
  { id: 2, name: 'Dairy & Bakery', icon: '🥛', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400' },
  { id: 3, name: 'Beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400' },
  { id: 4, name: 'Snacks', icon: '🍿', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400' },
  { id: 5, name: 'Meat & Fish', icon: '🥩', image: 'https://images.unsplash.com/photo-1599582907579-8a09e97a7df7?w=400' },
  { id: 6, name: 'Frozen Foods', icon: '❄️', image: 'https://images.unsplash.com/photo-1609501676725-7186f70fb6a0?w=400' },
  { id: 7, name: 'Personal Care', icon: '🧴', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400' },
  { id: 8, name: 'Home & Cleaning', icon: '🏠', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400' },
]

export const mockBanners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200',
    title: 'Free Delivery on Orders Above ₹199',
    subtitle: 'Use code FREE199',
    link: '/products/snacks',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200',
    title: 'Fresh Fruits & Vegetables',
    subtitle: 'Get 20% off on all fresh produce',
    link: '/products/fruits-vegetables',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=1200',
    title: 'New Arrivals - Premium Products',
    subtitle: 'Shop the latest additions to our catalog',
    link: '/products',
  },
]

export const mockProducts = [
  // Fruits & Vegetables
  {
    id: 1,
    name: 'Fresh Red Tomatoes',
    category: 'Fruits & Vegetables',
    categoryId: 1,
    price: 45,
    originalPrice: 55,
    quantity: '500g',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
    images: [
      'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800',
      'https://images.unsplash.com/photo-1546470427-e26264be0f42?w=800',
    ],
    stock: 50,
    rating: 4.5,
    reviews: 234,
    description: 'Fresh, juicy red tomatoes perfect for salads and cooking.',
    manufacturer: 'Farm Fresh Co.',
    deliveryTime: '10-15 mins',
  },
  {
    id: 2,
    name: 'Organic Spinach',
    category: 'Fruits & Vegetables',
    categoryId: 1,
    price: 35,
    originalPrice: 40,
    quantity: '250g',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    images: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800',
    ],
    stock: 30,
    rating: 4.7,
    reviews: 189,
    description: 'Fresh organic spinach leaves, rich in iron and vitamins.',
    manufacturer: 'Green Valley Farms',
    deliveryTime: '10-15 mins',
  },
  {
    id: 3,
    name: 'Bananas - Robusta',
    category: 'Fruits & Vegetables',
    categoryId: 1,
    price: 55,
    originalPrice: 60,
    quantity: '1 dozen',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
    ],
    stock: 100,
    rating: 4.6,
    reviews: 456,
    description: 'Sweet and fresh Robusta bananas, perfect for daily nutrition.',
    manufacturer: 'Tropical Farms',
    deliveryTime: '10-15 mins',
  },
  {
    id: 4,
    name: 'Carrots - Premium',
    category: 'Fruits & Vegetables',
    categoryId: 1,
    price: 40,
    originalPrice: 45,
    quantity: '500g',
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400',
    images: [
      'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800',
    ],
    stock: 75,
    rating: 4.4,
    reviews: 321,
    description: 'Premium quality carrots, crunchy and sweet.',
    manufacturer: 'Fresh Garden',
    deliveryTime: '10-15 mins',
  },
  
  // Dairy & Bakery
  {
    id: 5,
    name: 'Full Cream Milk',
    category: 'Dairy & Bakery',
    categoryId: 2,
    price: 65,
    originalPrice: 70,
    quantity: '1L',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    images: [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800',
    ],
    stock: 200,
    rating: 4.8,
    reviews: 892,
    description: 'Fresh full cream milk, pasteurized and pure.',
    manufacturer: 'Dairy Fresh',
    deliveryTime: '10-15 mins',
  },
  {
    id: 6,
    name: 'White Bread - Premium',
    category: 'Dairy & Bakery',
    categoryId: 2,
    price: 45,
    originalPrice: 50,
    quantity: '400g',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    ],
    stock: 150,
    rating: 4.5,
    reviews: 567,
    description: 'Soft and fresh white bread, perfect for breakfast.',
    manufacturer: 'Bakery Fresh',
    deliveryTime: '10-15 mins',
  },
  {
    id: 7,
    name: 'Butter - Unsalted',
    category: 'Dairy & Bakery',
    categoryId: 2,
    price: 120,
    originalPrice: 130,
    quantity: '200g',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7fe135a9c4?w=400',
    images: [
      'https://images.unsplash.com/photo-1589985270826-4b7fe135a9c4?w=800',
    ],
    stock: 80,
    rating: 4.7,
    reviews: 234,
    description: 'Premium unsalted butter, rich and creamy.',
    manufacturer: 'Cream Valley',
    deliveryTime: '10-15 mins',
  },
  
  // Beverages
  {
    id: 8,
    name: 'Coca Cola',
    category: 'Beverages',
    categoryId: 3,
    price: 50,
    originalPrice: 55,
    quantity: '750ml',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    images: [
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800',
    ],
    stock: 300,
    rating: 4.6,
    reviews: 1234,
    description: 'Classic refreshing cola drink.',
    manufacturer: 'Coca Cola Company',
    deliveryTime: '10-15 mins',
  },
  {
    id: 9,
    name: 'Orange Juice - Fresh',
    category: 'Beverages',
    categoryId: 3,
    price: 85,
    originalPrice: 95,
    quantity: '1L',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    images: [
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
    ],
    stock: 120,
    rating: 4.5,
    reviews: 456,
    description: '100% fresh orange juice with pulp.',
    manufacturer: 'Fresh Juice Co.',
    deliveryTime: '10-15 mins',
  },
  
  // Snacks
  {
    id: 10,
    name: 'Lay\'s Classic Salted',
    category: 'Snacks',
    categoryId: 4,
    price: 20,
    originalPrice: 25,
    quantity: '52g',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400',
    images: [
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800',
    ],
    stock: 500,
    rating: 4.8,
    reviews: 2345,
    description: 'Classic salted potato chips, crispy and delicious.',
    manufacturer: 'Lay\'s',
    deliveryTime: '10-15 mins',
  },
  {
    id: 11,
    name: 'Kurkure Masala Munch',
    category: 'Snacks',
    categoryId: 4,
    price: 20,
    originalPrice: 22,
    quantity: '60g',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400',
    images: [
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800',
    ],
    stock: 400,
    rating: 4.7,
    reviews: 1890,
    description: 'Spicy and tangy extruded snack.',
    manufacturer: 'Kurkure',
    deliveryTime: '10-15 mins',
  },
]

export const mockCoupons = [
  {
    id: 1,
    code: 'WELCOME50',
    discount: 50,
    type: 'flat',
    minOrder: 100,
    maxDiscount: 50,
    description: 'Flat ₹50 off on orders above ₹100',
    validTill: '2024-12-31',
  },
  {
    id: 2,
    code: 'FIRST10',
    discount: 10,
    type: 'percentage',
    minOrder: 200,
    maxDiscount: 100,
    description: '10% off on orders above ₹200 (max ₹100)',
    validTill: '2024-12-31',
  },
  {
    id: 3,
    code: 'FREE199',
    discount: 0,
    type: 'freeDelivery',
    minOrder: 199,
    description: 'Free delivery on orders above ₹199',
    validTill: '2024-12-31',
  },
]

export const getProductImageUrl = (image) => {
  if (!image) {
    return 'https://via.placeholder.com/400x400?text=No+Image'
  }
  return image
}

export const getCategoryImageUrl = (categoryId) => {
  const category = mockCategories.find(c => c.id === categoryId)
  return category?.image || 'https://via.placeholder.com/400x400?text=Category'
}


