import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ApiClient from '../services/apiClient';

export const RECTANGLE_ADS = 1;
export const LEADERBOARD_ADS = 2;
export const INTERSTITIAL_ADS = 3;
export const WIDE_SKYSCRAPER_ADS = 4;
export const VIDEO_ADS = 5;
export const VIDEO_ADS_PAGE_MODE = 1;
export const VIDEO_ADS_VIDEO_MODE = 2;

const useAds = ({ type_id, video_mode, firstFetching = true }) => {
  const [adError, setAdError] = useState(null);
  const [ads, setAds] = useState(null);

  const isMobile = () => {
    const ua = navigator.userAgent;
    return /Android|Mobi|iPhone|iPad|iPod|IEMobile|Windows Phone/i.test(ua);
  };

  const { locale, asPath } = useRouter();

  const postAction = async ({ action }) => {
    try {
      await ApiClient({ locale }).post('ads-action', {
        action,
        ads_id: ads?.id,
        ads_type: type_id,
        video_mode,
        referer: asPath
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onClick = () => {
    if (ads) {
      postAction({ action: 'click' });
      if (typeof window !== 'undefined') {
        window.open(ads?.target_url, '_blank');
      }
    }
  };

  const resetAds = () => {
    setAds(null);
  };

  const onEnded = () => {
    if (ads) {
      postAction({ action: 'ended' });
      resetAds();
    }
  };

  const onSkip = () => {
    if (ads) {
      postAction({ action: 'skip' });
      resetAds();
    }
  };

  const onPlay = () => {
    if (ads) {
      postAction({ action: 'play' });
    }
  };

  const onLoad = () => {
    if (ads) {
      postAction({ action: 'impression' });
    }
  };

  const getAds = async () => {
    try {
      const response = await ApiClient({ locale }).get('ads-shuffle', {
        params: {
          type_id,
          is_mobile: isMobile() ? 1 : 0,
          video_mode
        }
      });
      let videoUrl = response?.data?.data?.video_url;
      if (videoUrl) {
        if (videoUrl.indexOf('?') > -1) {
          videoUrl += '&autoplay=1';
        } else {
          videoUrl += '?autoplay=1';
        }
      }
      setAds({ ...response.data.data, video_url: videoUrl });
    } catch (error) {
      setAdError(error);
    }
  };

  const fetchAds = async () => {
    setAds(null);
    await getAds();
  };

  useEffect(() => {
    if (firstFetching) {
      getAds();
    }
  }, []);

  return {
    adError,
    ads,
    onClick,
    onLoad,
    onEnded,
    onPlay,
    fetchAds,
    resetAds,
    onSkip
  };
};

export default useAds;
