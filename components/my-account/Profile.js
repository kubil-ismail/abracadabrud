import { useEffect, useState } from 'react';
import ModalCrop from './profile/ModalCrop';
import { useUpdateBasicProfileMutation } from 'core/services/rtk/AuthenticationServices';
import { setModal } from 'core/redux/reducers/modalSlice';
import ErrorMessage from '../error/ErrorMessage';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import upload from 'utils/uploadFile';
import {
  changePhotoProfile,
  changePhotoBanner,
  setNameProfile
} from 'core/redux/reducers/authenticationSlice';
import { useTranslation } from 'react-i18next';
import compressFile from 'utils/compressFile';
import Image from 'next/image';

export default function Profile({ me }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.authentication);
  const [modalCrop, setModalCrop] = useState(false);
  const { t } = useTranslation();
  const [photo, setPhoto] = useState({});
  const [banner, setBanner] = useState({});
  const [renderPhoto, setRenderPhoto] = useState(null);
  const [renderBanner, setRenderBanner] = useState(null);
  const [imagesCrop, setImagesCrop] = useState();
  const [configCrop, setConfigCrop] = useState({
    cropShape: 'round',
    height: 150,
    width: 150
  });
  const [form, setForm] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: ''
  });
  const [errorForm, setErrorForm] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: ''
  });
  const [
    updateBasicProfile,
    {
      isSuccess: isSuccessUpdateBasicProfile,
      isError: isErrorUpdateBasicProfile,
      error: errorUpdateBasicProfile,
      isLoading
    }
  ] = useUpdateBasicProfileMutation();
  const dataMe = me;

  const onChange = (event) => {
    const { name } = event.currentTarget;
    const { value } = event.currentTarget;

    if (name === 'fullname') {
      if (value.length < 3) {
        setErrorForm({
          ...errorForm,
          fullname: 'Full name must be at least 3 characters'
        });
      } else {
        setErrorForm({ ...errorForm, fullname: '' });
      }
    }

    if (name === 'username') {
      // letters, numbers, and underscores
      const regex = /^[a-zA-Z0-9_]*$/;
      if (!regex.test(value)) {
        return;
      }

      if (value.length > 15) {
        return;
      }

      if (value.length < 3) {
        setErrorForm({
          ...errorForm,
          username: 'Username must be at least 3 characters'
        });
      } else {
        setErrorForm({ ...errorForm, username: '' });
      }
    }

    if (name === 'email') {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!regex.test(value)) {
        setErrorForm({ ...errorForm, email: 'Email is not valid' });
      } else {
        setErrorForm({ ...errorForm, email: '' });
      }
    }

    if (name === 'phone') {
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) {
        return;
      }

      if (value.length < 9) {
        setErrorForm({
          ...errorForm,
          phone: 'Phone number must be at least 9 characters'
        });
      } else {
        setErrorForm({ ...errorForm, phone: '' });
      }
      if (value.length > 13) {
        return;
      }
    }

    setForm({ ...form, [name]: value });
  };

  // onclick open file upload
  const openFileUpload = () => {
    document.getElementById('photo').click();
  };

  const openBannerUpload = () => {
    document.getElementById('banner').click();
  };

  const handlePhotoProfile = async (e) => {
    setConfigCrop({
      cropShape: 'round',
      height: 150,
      width: 150,
      field: 'profile',
      name: 'photo',
      url: `/auth/my-account/update-photo`
    });
    const [file] = e.target.files;
    const compressedFile = await compressFile(file);
    if (compressedFile) {
      const urlFile = URL.createObjectURL(compressedFile);
      setImagesCrop(urlFile);
      setModalCrop(true);
      // setProfileLoading(true);
    }
  };

  const handlePhotoBanner = async (e) => {
    setConfigCrop({
      cropShape: 'rect',
      height: 150,
      width: 350,
      field: 'banner',
      name: 'banner',
      url: '/auth/my-account/update-banner'
    });
    const [file] = e.target.files;
    const compressedFile = await compressFile(file);
    if (compressedFile) {
      const urlFile = URL.createObjectURL(compressedFile);
      setImagesCrop(urlFile);
      setModalCrop(true);
      // setBannerLoading(true);
    }
  };

  const resultCrop = (res) => {
    upload(
      {
        field: configCrop?.name,
        url: configCrop?.url,
        file: res.file,
        token
      },
      (result) => {
        if (result.status === 200) {
          const photoUrl = result?.data?.data?.user?.[configCrop?.name];

          if (configCrop?.field === 'profile') {
            setRenderPhoto(configCrop?.url);
            setPhoto(photoUrl);
            dispatch(changePhotoProfile(photoUrl));
            toast.success(t('Profile picture updated'));
          }
          if (configCrop?.field === 'banner') {
            setRenderBanner(configCrop?.url);
            setBanner(photoUrl);
            dispatch(changePhotoBanner(photoUrl));
            toast.success(t('Profile banner updated'));
          }
        } else {
          toast.error(t(`${configCrop?.field} profile failed`));
        }
      }
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateBasicProfile(form);
  };

  // useEffect(() => {
  //   if (isAuthenticated && token) {
  //     me();
  //   }
  // }, [isAuthenticated, token]);

  useEffect(() => {
    if (dataMe?.user) {
      setForm({
        fullname: user?.firstname ?? dataMe?.user?.firstname,
        username: dataMe?.user?.username,
        email: user?.email ?? dataMe?.user?.email,
        phone: dataMe?.user?.phone
      });

      setRenderPhoto(user?.photo ?? dataMe?.user?.photo);
      // setRenderBanner(`${process.env.NEXT_PUBLIC_ASSET_URL}/${dataMe?.user?.banner}`);
      setRenderBanner(user?.banner ?? dataMe?.user?.banner);
    }
  }, [dataMe, user]);

  useEffect(() => {
    if (isSuccessUpdateBasicProfile) {
      toast.success(t('Profile updated'));

      dispatch(setNameProfile(form?.fullname));
    }
    if (isErrorUpdateBasicProfile) {
      if (
        errorUpdateBasicProfile?.message === 'Username already taken' ||
        errorUpdateBasicProfile?.data?.errors?.username
      ) {
        setErrorForm({ ...errorForm, username: 'Username already taken' });
      }
      if (
        errorUpdateBasicProfile?.message === 'Email already taken' ||
        errorUpdateBasicProfile?.data?.errors?.email
      ) {
        setErrorForm({ ...errorForm, email: 'Email already taken' });
      }
    }
  }, [isSuccessUpdateBasicProfile, isErrorUpdateBasicProfile, errorUpdateBasicProfile]);

  return (
    <div className="flex flex-col gap-10">
      <h3 className="font-bold text-2xl">{t('My Account')}</h3>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-bold">{t('Profile')}</h3>
          <span className="text-xs md:text-sm">{t('Edit your profile here.')}</span>
        </div>
        <div className="relative">
          <img
            src={renderBanner || '/assets/images/empty-banner.webp'}
            alt="banner"
            className="h-44 md:h-[348px] w-full rounded-lg object-cover"
            onError={() => setRenderBanner('/assets/images/empty-banner.webp')}
            loading="lazy"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white/70 text-zinc-800 flex items-center justify-center"
              onClick={openBannerUpload}>
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/camera-icon.png`}
                alt="camera"
                width={18}
                height={18}
              />
              {/* <AiFillCamera /> */}
            </button>
            <input
              type="file"
              name="banner"
              id="banner"
              className="hidden"
              accept="image/*;capture=camera"
              onChange={handlePhotoBanner}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-3 items-center -mt-20 md:-mt-36 relative">
          <div className="relative">
            <img
              src={renderPhoto || '/assets/images/user.png'}
              alt="banner"
              className="w-44 h-44 md:w-64 md:h-64 rounded-full object-cover object-center border-4 border-white"
              onError={() => setRenderPhoto('/assets/images/user.png')}
              loading="lazy"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white/70 text-zinc-800 flex items-center justify-center"
                onClick={openFileUpload}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/camera-icon.png`}
                  alt="camera"
                  width={18}
                  height={18}
                />
                {/* <AiFillCamera /> */}
              </button>
            </div>
            <input
              type="file"
              name="photo"
              id="photo"
              className="hidden"
              accept="image/*;capture=camera"
              onChange={handlePhotoProfile}
            />
          </div>
          <span className="text-xs font-medium">{t('Image file maximum size 2mb')}</span>
        </div>
        <div className="">
          <form>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              <div className="flex flex-col space-y-3">
                <span className="text-sm">{t('Full Name')}</span>
                <input
                  type="text"
                  className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md"
                  placeholder={t('Enter fullname')}
                  name="fullname"
                  onChange={onChange}
                  value={form.fullname}
                />
                <ErrorMessage message={t(errorForm.fullname)} />
              </div>
              <div className="flex flex-col space-y-3">
                <span className="text-sm">{t('Username')}</span>
                <input
                  type="text"
                  className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md"
                  placeholder={t('Enter your username')}
                  name="username"
                  onChange={onChange}
                  value={form.username}
                />
                <ErrorMessage message={t(errorForm.username)} />
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-sm">{t('Email')}</span>

                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    className="flex-1 text-sm bg-white px-4 py-3 text-zinc-900 rounded-md w-full"
                    placeholder="Enter email"
                    name="email"
                    // onChange={onChange}
                    value={form.email}
                    readOnly
                  />
                  <button
                    type="button"
                    className="flex-0 px-3 py-2 text-slate-50 border border-zinc-700 font-semibold text-xs rounded-md h-full flex items-center justify-center"
                    style={{ display: 'inherit' }}
                    onClick={() => dispatch(setModal({ name: 'modalChangeEmail', value: true }))}>
                    {t('Change email')}
                  </button>
                  <ErrorMessage message={t(errorForm.email)} />
                </div>
                {/* <input
                    type="email"
                    className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md"
                    placeholder="Confirm your password here..."
                    name="email"
                    // onChange={onChange}
                    value={form.email}
                    readOnly
                  />
                  <ErrorMessage message={errorForm.email} />
                  <button
                    type="button"
                    className="mt-[-10px] text-xs text-[#FF00FE]"
                    style={{ display: 'inherit' }}
                    onClick={() => dispatch(setModal({ name: 'modalChangeEmail', value: true }))}>
                    Change email
                  </button> */}
              </div>
              <div className="flex flex-col space-y-3">
                <span className="text-sm">{t('Mobile Number')}</span>
                <input
                  type="number"
                  className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md"
                  placeholder={t('Enter your phone number')}
                  name="phone"
                  onChange={onChange}
                  value={form.phone}
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                />
                <ErrorMessage message={t(errorForm.phone)} />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="button"
                  className="px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base w-32 rounded-md"
                  onClick={onSubmit}
                  disabled={isLoading}>
                  {isLoading ? t('Loading...') : t('Save')}
                </button>
              </div>
            </div>
          </form>

          {modalCrop && (
            <ModalCrop
              show={modalCrop}
              onHide={() => setModalCrop(false)}
              imagesCrop={imagesCrop}
              resultCrop={resultCrop}
              configCrop={configCrop}
            />
          )}
        </div>
      </div>
    </div>
  );
}
