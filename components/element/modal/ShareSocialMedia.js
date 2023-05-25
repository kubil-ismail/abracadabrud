import {
    EmailIcon,
    EmailShareButton, FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, LineIcon, LineShareButton, TelegramIcon, TelegramShareButton, WhatsappIcon, WhatsappShareButton
} from "react-share";
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


export default function ShareSocialMedia({ text, quote, subject, url, name, titleVideo }) {
  SwiperCore.use([Navigation]);

  return (
    <>
                        <div className="">
                    <Swiper
          modules={Navigation}
          navigation
          slidesPerView={4}
          spaceBetween={2}
          breakpoints={{
            640: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          className="mySwiper px-3"
        >
             <SwiperSlide className="flex flex-col gap-2 items-center">
                <WhatsappShareButton url={url} title={text} className="m-auto block mb-1">
                    <WhatsappIcon size={64} round={true} />
                </WhatsappShareButton>
                <span className="text-xs font-light text-center block m-auto">Whatsapp</span>
            </SwiperSlide>
            <SwiperSlide className="flex flex-col gap-1 items-center">
                <TwitterShareButton url={url} via={text} className="m-auto block mb-1">
                    <TwitterIcon size={64} round={true} />
                </TwitterShareButton>
                <span className="text-xs font-light text-center block m-auto">Twitter</span>
            </SwiperSlide>
             <SwiperSlide className="flex flex-col gap-1 items-center">
                <FacebookShareButton url={url} quote={text} className="m-auto block mb-1">
                    <FacebookIcon size={64} round={true} />
                </FacebookShareButton>
                <span className="text-xs font-light text-center block m-auto">Facebook</span>
            </SwiperSlide>
             <SwiperSlide className="flex flex-col gap-1 items-center">
                <TelegramShareButton url={url} title={text} className="m-auto block mb-1">
                    <TelegramIcon size={64} round={true} />
                </TelegramShareButton>
                <span className="text-xs font-light text-center block m-auto">Telegram</span>
            </SwiperSlide>
             <SwiperSlide className="flex flex-col gap-1 items-center">
                <LineShareButton url={url} title={text} className="m-auto block mb-1">
                    <LineIcon size={64} round={true} />
                </LineShareButton>
                <span className="text-xs font-light text-center block m-auto">Line</span>
            </SwiperSlide>
             <SwiperSlide className="flex flex-col gap-1 items-center">
                <EmailShareButton url={url} title={text} body={text} className="m-auto block mb-1">
                    <EmailIcon size={64} round={true} />
                </EmailShareButton>
                <span className="text-xs font-light text-center block m-auto">Email</span>
            </SwiperSlide>
        </Swiper>
                        

                    </div>
    </>
  );
}