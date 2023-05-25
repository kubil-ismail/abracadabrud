import { useState, useEffect } from 'react';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function BackstageGallery(data) {
  const [photo, setPhoto] = useState();
  const [width, setWidth] = useState();

  const isMobile = width <= 768;

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  console.log('aman?', data)

  return (
    <div className="flex flex-col gap-7">
      <h3 className="text-xl md:text-4xl font-extrabold text-[#23FF2C]">
        {data?.data?.main_title}
      </h3>
      <div className="mx-1">
        <Swiper
          style={{
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff'
          }}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: photo }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mb-5">
          {data?.data?.image?.map((item) => (
            <SwiperSlide>
              <div style={{ position: 'relative', height: '420px' }}>
                <img
                  src={item?.images}
                  className="w-full h-[340px] md:h-[420px] object-contain"
                  style={{ height: '420px', width: '100%', zIndex: 99999 }}
                />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-base font-medium drop-shadow-3xl w-full md:w-[90%]">{item?.caption}</h3>
                </div>
                <div
                  style={{
                    backgroundImage: `url(${item?.images})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '420px',
                    filter: 'blur(8px)',
                    marginTop: '-420px',
                    zIndex: -10,
                    position: 'relative'
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setPhoto}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper">
          {data?.data?.image?.map((item) => (
            <SwiperSlide>
              <div style={{ position: 'relative', height: '150px' }}>
                {isMobile ? (
                  <img
                    src={item?.images}
                    className="w-full"
                    style={{ height: '100px', width: '100%', zIndex: 99999, objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <img
                      src={item?.images}
                      className="w-full object-contain h-[180px] md:h-[150px]"
                      style={{ height: '150px', width: '100%', zIndex: 99999 }}
                    />
                    <div
                      style={{
                        backgroundImage: `url(${item?.images})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '150px',
                        filter: 'blur(3px)',
                        marginTop: '-150px',
                        zIndex: -10,
                        position: 'relative',
                        width: '100%'
                      }}
                    />
                  </>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
