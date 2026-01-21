// Mapping from UI category names to backend category values
// If multiple backend categories map to one UI category, list them as an array
export const categoryMapping = {
  'fruits-vegetables': ['VEG', 'FRUITS'],
  'dairy-bakery': ['DAIRY', 'BAKERY'],
  'snacks': ['SNACKS'],
  'beverages': ['BEVERAGES'],
  // Add more mappings as needed
}

// Function to get backend categories for a UI category
export const getBackendCategories = (uiCategory) => {
  return categoryMapping[uiCategory] || [uiCategory.toUpperCase()]
}

// Function to get UI category name from backend category (reverse mapping)
export const getUICategoryName = (backendCategory) => {
  for (const [uiCat, backCats] of Object.entries(categoryMapping)) {
    if (backCats.includes(backendCategory)) {
      return uiCat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }
  return backendCategory
}
