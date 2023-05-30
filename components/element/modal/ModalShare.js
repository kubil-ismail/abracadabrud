import { useState } from 'react';
import ShareSocialMedia from './ShareSocialMedia';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { shareVideoWithNavigator } from 'lib/shareWithNavigator';
import { getCurrentUser } from 'core/redux/reducers/authenticationSlice';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function ModalShare({ show, name, captions, onHide, text, quote, url, isUser }) {
  // let [isOpen, setIsOpen] = useState(true);
  // SwiperCore.use([Navigation]);

  // function closeModal() {
  //   setIsOpen(false);
  // }

  // function openModal() {
  //   setIsOpen(true);
  // }
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [shareText, setShareText] = useState('');
  const router = useRouter();
//   const shareTextMe = `
//   ${captions} - ${name}
//   Check out my music video! Make sure to vote for it often so I can win the opportunity to perform at the wePOP come together on 6 August 2023.
  
// It's Easy! Click this link, vote for me now, and you too can win amazing weekly prizes:
// THANKS!
// `

//   const shareTextMe = `
//   ${captions} - ${name}
// Yuk, tonton videoku! Jangan lupa vote ya biar aku bisa menangkan kesempatan tampil di wePOP come together pada 6 Agustus 2023.
  
// Caranya gampang! Klik tautan ini, kasih vote kamu, dan kamu juga bisa menangkan hadiah mingguan yang keren
// Makasih ya!
// `
//   const shareTextMe = `
//   Halo, saya ${name},

//   Lihat video musikku yang berjudul ${captions} - ${name} Tolong untuk vote videoku sesering mungkin, agar aku bisa memenangkan kompetisi dan kesempatan untuk tampil di acara konser wePOP pada tanggal 6 Agustus 2023 di JIEXPO Kemayoran.
  
//   Caranya mudah! Klik tautan ini, lalu tekan tombol Vote dan Kirim. Kamu juga bisa memenangkan hadiah mingguan yang menakjubkan.
  
//   Terima kasih.
// `
  const shareTextMe = `
  Vote videoku ini, dan bantu aku untuk memenangkan kesempatan tampil di konser wePOP. Caranya mudah. Klik link ini, dapatkan poin gratis dan pakai untuk vote videoku. Kamu juga dapat menang hadiah keren setiap minggu!
`
//   const shareTextOther = `Hey, 
// Check out abracadabra, a cool new music platform where Indonesian performers are competing to perform as the opening act at the wePOP concert. You can upload your music video, vote for other videos, and win amazing prizes. 

// Prizes include cash, free concert tickets, travel and accommodation, backstage tours, meet ‘n greet, selfies with the headline artists, and more! 

// Register using this link `
  
// const shareTextOther = `Hey, 
// Yuk mampir ke abracadabra, platform musik baru yang keren banget! Di sini, performer-performer Indonesia akan bersaing untuk tampil sebagai opening act di konser wePOP. Caranya, kamu tinggal unggah video penampilan kamu atau vote video performer lain. Hasilnya, kamu bisa menangkan hadiah utama yang luar biasa.

// Hadiahnya apa? Ada uang tunai, tiket konser gratis, perjalanan dan akomodasi, tur di backstage, Meet ‘n Greet, sesi foto bareng Judika, Rizky Febian, Kahitna artis utama, dan banyak lagi!

// Daftar lewat link ini sekarang!`

// const shareTextOther = `Hey, 
// Ayo daftar ke abracadabra, platform yang keren banget! Musisi-musisi akan berkompetisi untuk tampil bersama Artis Idola di konser wePOP.

// Hadiahnya ada uang tunai, tiket konser, akomodasi, tur di backstage...  dan banyak lagi!`

const shareTextOther = `Cek abracadabra! Platform musik yang keren tempat musisi dan penyanyi berbakat bersaing untuk kesempatan tampil di konser wePOP. Pilih video musik favoritmu,menangkan tiket konser VIP, "meet n greet" berikut hotel dan tiket pesawat serta lainnya! Klik: `;



  useEffect(() => {
    if (isUser || router.pathname === '/uploads') {
      setShareText(shareTextMe);
    } else {
      setShareText(shareTextOther);
    }
  }, [isUser])

  const handleCopy = () => {
    if (isUser) {
      navigator.clipboard.writeText(
        text = `
        ${shareTextMe}${url}
        `,
      );
      setShareText(shareTextMe);
    } else {
      navigator.clipboard.writeText(
        text = `
        ${shareTextOther}${url}
        `,
      );
      setShareText(shareTextOther);
    }

    toast.success(t('Link copied to clipboard'));
    // dispatch(setModal({ name: 'modalShare', value: false }))
  };

  const user = useSelector(getCurrentUser);

  const handleShare = async () => {
    shareVideoWithNavigator({
      link: url,
      user,
      authorId: user?.id,
      performer: name,
      caption: captions,
    });
  };

  return (
    <>
      <div className="">
        <div className="bg-black/40 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2C2C2C] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-between items-center space-x-4  border-b border-zinc-600 pb-4">
              <h3 className="text-2xl leading-6 mb-5 font-bold">{t('Share')}</h3>
              <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/close-icon.png`}
              alt="close"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={onHide}
              />
              {/* <RiCloseFill size={32} className="cursor-pointer" onClick={onHide} /> */}
            </div>
            <div className="flex flex-col space-y-4 mt-4">
              <span className="text-xs md:text-sm font-light">{t('Share this link via')}</span>
              <ShareSocialMedia text={shareText} quote={shareText} subject={shareText} url={url} />
              <div className="flex flex-col space-y-3">
                <span className="text-[10px] md:text-xs font-light text-zinc-300">
                  {t('Or via link')}
                </span>
                <div className="flex items-center w-full">
                  <div className="flex-1">
                    <input
                      type="text"
                      className="text-xs md:text-sm bg-zinc-700  px-4 py-3 rounded-md text-zinc-400 w-full focus:outline-none"
                      value={url}
                    />
                  </div>
                  <div className="flex-0 flex items-center justify-center px-2 py-3 text-sm">
                  <Image
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/copy-icon.png`}
                  alt="copy"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={handleCopy}
                  />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className="w-40 md:w-48 rounded-md bg-[#3a3939] flex items-center gap-4 p-3"
                  onClick={handleShare}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/share-icon.svg`}
                    alt="share-icon"
                    className="w-6"
                    loading="lazy"
                    width="100%"
                    height="100%"
                  />
                  <span className="text-sm">{t('Share (Others)')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#2c2c2c] text-slate-50 p-8 mx-3 md:mx-0 text-left align-middle shadow-xl transition-all">
                 
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
    </>
  );
}