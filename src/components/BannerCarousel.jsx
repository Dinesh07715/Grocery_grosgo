import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const BannerCarousel = ({ banners = [] }) => {
  if (!banners || banners.length === 0) {
    return null
  }

  console.log('Banners rendering:', banners.length, banners)

  return (
    <div className="py-4 bg-gray-50">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true 
          }}
          navigation={true}
          loop={banners.length > 1}
          className="banner-swiper h-48 md:h-64 rounded-lg overflow-hidden"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Link to={banner.link || '#'} className="block relative h-full group">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-white text-sm md:text-base opacity-90">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default BannerCarousel


