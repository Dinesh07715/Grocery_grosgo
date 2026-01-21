import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const CategorySlider = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="py-4 bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode
          navigation
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id} style={{ width: 'auto' }}>
              <button
                onClick={() => onCategorySelect(category.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg min-w-[100px]
                  transition-all
                  ${
                    selectedCategory === category.value
                      ? 'bg-green-100 scale-105'
                      : 'hover:bg-gray-50'
                  }`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-md">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <span className="text-xs font-semibold text-center">
                  {category.name}
                </span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default CategorySlider
