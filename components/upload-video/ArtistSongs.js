import { useState } from 'react';
import SwiperCore, { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function ArtistSongs() {
  SwiperCore.use([Navigation]);
  const [artists, setArtist] = useState([
    { id: 1, img: 'assets/images/banner-event.png', name: 'Jade Waren' },
    { id: 2, img: 'assets/images/banner-event.png', name: 'Jade Waren' },
    { id: 3, img: 'assets/images/banner-event.png', name: 'Jade Waren' }
  ]);

  return (
    <div className=" container">
      <Swiper
        modules={Navigation}
        slidesPerView={3}
        spaceBetween={4}
        navigation
        breakpoints={{
          640: {
            slidesPerView: 3,
            spaceBetween: 10
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 8
          }
        }}
        className="mySwiper"
      >
        {artists.map((artist) => (
          <SwiperSlide className="py-3" key={artist.id}>
            <div
              className="cursor-pointer hover:scale-105 ease-in-out duration-300 flex flex-col items-center gap-2"
              aria-hidden
            >
              <div className="w-24 h-24 overflow-hidden rounded-full">
                <img
                  src={artist.img}
                  alt="card-event"
                  layout="fill"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h6 className="text-sm">{artist.name}</h6>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
