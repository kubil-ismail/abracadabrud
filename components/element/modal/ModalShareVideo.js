import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setModal } from '../../../core/redux/reducers/modalSlice';
import ModalShare from './ModalShare';
import EllipsisText from 'react-ellipsis-text/lib/components/EllipsisText';

export default function ModalShareVideo({ dataUpload, name }) {
  const [modalShow, setModalShow] = useState(false);
  const [url, setUrl] = useState('');
  const { t } = useTranslation();
  const { basePath } = useRouter();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.authentication);
  const [shareText, setShareText] = useState('');
  const shareTextMe = `I just uploaded my video for this cool new competition. You should upload as well. Grand Prize winner lands you/your band to the wePOP concert main stage.`
  const shareTextOther = `
  Hey, 
Check out abracadabra, a cool new music platform where Indonesian performers are competing to perform as the opening act at the wePOP concert. You can upload your music video, vote for other videos, and win amazing prizes. 

Prizes include cash, free concert tickets, travel and accommodation, backstage tours, meet ‘n greet, selfies with the headline artists, and more! 

Register using this link
  `

  useEffect(() => {
    if (user) {
      setUrl(
        `${window.location.origin}${basePath}/video/${dataUpload?.data?.video?.id}?referral=${user?.my_referal_code}`
      );
      if (user?.id === dataUpload?.data?.video?.user_id) {
        setShareText(shareTextMe);
      } else {
        setShareText(shareTextOther);
      }
    } else {
      setUrl(`${window.location.origin}${basePath}/video/${dataUpload?.data?.video?.id}`);
    }
  }, [user]);

  const onClickShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/video/${dataUpload?.data?.video?.id}?referal=${user?.my_referal_code}`
    );

    toast.success(t('Link copied to clipboard'));
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(
      user?.my_referal_code
    );

    toast.success(t('Copied referral success'));
  };

  return (
    <>
      {
        modalShow && <ModalShare url={url} text={shareText} onHide={() => setModalShow(false)} name={name} captions={dataUpload?.data?.video?.caption}
          isUser={user?.id === dataUpload?.data?.video?.user_id} />
      }
      <div className="">
        <div className="bg-black/20 fixed inset-0 w-full z-40 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-6 pb-8 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
            <Image
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/close-icon.png`}
            alt="close"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() => {
              dispatch(setModal({ name: 'modalShareVideo', value: false }));
              router.push('/');
            }}
            />
              {/* <RiCloseFill
                size={32}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(setModal({ name: 'modalShareVideo', value: false }));
                  router.push('/');
                }}
              /> */}
            </div>
            <div className="flex flex-col gap-5">
              <div className="">
              <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/rtaf-htp.png`} alt="referral" className="w-32" />
              </div>
              <h3 className="text-3xl leading-6 mb-4 font-bold text-[#FF00FE]">
                {t('Share your video with friends!')}
              </h3>
              <span className="text-sm">
                {t('Get your friends to watch and vote for your video! The video with the most votes wins! The grand prize will put you on stage as the opening act for the main event with RP. 100,000,000 in your pocket!')}
              </span>
              <div className="flex justify-between items-center gap-3">
                <div className="flex-1 flex items-center gap-3">
                  <h3 className="font-bold text-sm md:text-xl">
                  <EllipsisText
                    text={user?.my_referal_code ?? ''}
                    length={16}
                      />
                    </h3>
                  {/* <MdContentCopy className="cursor-pointer" /> */}
                  <Image
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/copy-icon.png`}
                  alt="chevron"
                  width={20}
                  height={20}
                  onClick={handleCopy}
                  className="cursor-pointer"
                  />
                </div>
                <button
                  type="submit"
                  className="flex-0 px-5 py-2 bg-[#FF00FE] text-[#23FF2C] text-base focus:outline-none font-semibold rounded-md"
                  form="form-des"
                  // onClick={onClickShare}
                  onClick={() => setModalShow(true)}
                >
                  {t('Share')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
