import { useEffect, useState, useRef } from 'react';
import { AiOutlineEye, AiFillStar, AiOutlinePlus } from 'react-icons/ai';
import Select from 'react-select';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setModal } from 'core/redux/reducers/modalSlice';
import {
  eventApi,
  useGetAllEventsQuery,
  useGetContestIdQuery,
  useGetGenresQuery,
  useUploadVideoMutation
} from 'core/services/rtk/EventServices';
import {
  authenticationApi,
  useContestantProfileMutation,
  useMeQuery
} from 'core/services/rtk/AuthenticationServices';
import ErrorMessage from '../error/ErrorMessage';
import InputMember from './InputMember';
import ModalShareVideo from 'components/element/modal/ModalShareVideo';
import { useTranslation } from 'react-i18next';
import { setCredentials } from 'core/redux/reducers/authenticationSlice';

export default function FormUpload() {
  const firstInput = useRef();
  const timestampRef = useRef(Date.now()).current;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isAuthenticated, user } = useSelector((state) => state.authentication);
  const { modalShareVideo } = useSelector((state) => state.modal);
  const { allEvents: dataEvent } = useSelector((state) => state.global);
  const router = useRouter();
  const [optionsEvents, setOptionsEvents] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [deletedMembers, setDeletedMembers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [countMembers, setCountMembers] = useState(0);
  const [dataContestant, setDataContestant] = useState({
    artist_band_name: '',
    description: '-',
    genre_ids: [],
    member_names: [],
    member_emails: []
  });

  const [dataToUpload, setDataToUpload] = useState({
    contest_id: null,
    genre_ids: [],
    video_url: '',
    caption: ''
  });

  const { data: contestIdData } = useGetContestIdQuery();

  // Update contest ID in dataToUpload when contestIdData changes
  useEffect(() => {
    if (contestIdData) {
      setDataToUpload((prevDataToUpload) => ({
        ...prevDataToUpload,
        contest_id: contestIdData.data.contest_id
      }));
    }
  }, [contestIdData]);

  const [errorContestant, setErrorContestant] = useState({
    artist_band_name: '',
    description: '',
    genre_ids: '',
    member_names: '',
    member_emails: ''
  });

  const [errorToUpload, setErrorToUpload] = useState({
    contest_id: '',
    genre_ids: '',
    video_url: '',
    caption: ''
  });

  const [errorGenre, setErrorGenre] = useState('');
  const [errorVideoUrl, setErrorVideoUrl] = useState('');

  const { data, error, isLoading } = useGetAllEventsQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );

  const { data: dataGenres, isLoading: isLoadingGenres, error: errorGenres } = useGetGenresQuery();

  // console.log('pea', dataGenres?.genres?.data);

  const [
    contestantProfile,
    {
      data: dataContestantProfile,
      error: errorContestantProfile,
      isLoading: isLoadingContestantProfile,
      isSuccess: isSuccessContestantProfile
    }
  ] = useContestantProfileMutation();

  const [
    uploadVideo,
    { data: dataUpload, error: errorUpload, isLoading: isLoadingUpload, isSuccess: isSuccessUpload }
  ] = useUploadVideoMutation();

  // add input
  const addInput = (e) => {
    e.preventDefault();
    setCountMembers(countMembers + 1);
  };

  // set array of member names and emails
  const setMemberArray = (e) => {
    // get input with name member_name
    const memberNames = document.getElementsByName('member_name');
    // get input with name member_email
    const memberEmails = document.getElementsByName('member_email');
    // create array of member names
    const memberNamesArray = [];
    // create array of member emails
    const memberEmailsArray = [];

    // push member names to array
    memberNames.forEach((memberName) => {
      const name = memberName.value;
      if (name === '') {
        setDataContestant({
          ...dataContestant,
          member_names: []
        });
        return;
      }
      memberNamesArray.push(name);
    });

    // push member emails to array
    memberEmails.forEach((memberEmail) => {
      const email = memberEmail.value;
      if (email === '') {
        setDataContestant({
          ...dataContestant,
          member_emails: []
        });
        return;
      }
      memberEmailsArray.push(email);
    });

    // set member names and emails to dataContestant
    setDataContestant({
      ...dataContestant,
      member_names: memberNamesArray,
      member_emails: memberEmailsArray
    });
  };

  // on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // const error = countErrorMessage();
    // if (error > 0) {
    //   return;
    // }
    if (!dataToUpload.caption) {
      setErrorToUpload({
        ...errorToUpload,
        ...{ caption: 'Tell us your song name' }
      });
      firstInput.current.scrollIntoView();
      return;
    }

    if (!dataToUpload.genre_ids?.length) {
      setErrorGenre('Genre is required');
      firstInput.current.scrollIntoView();
      return;
    }

    if (!dataToUpload?.video_url) {
      setErrorVideoUrl('Input the youtube link of your song');
      firstInput.current.scrollIntoView();
      return;
    }

    if (!dataContestant.artist_band_name) {
      setErrorContestant({
        ...errorContestant,
        ...{ artist_band_name: 'Tell us your band/artist name' }
      });
      firstInput.current.scrollIntoView();
      return;
    }

    if (
      dataToUpload.genre_ids?.length &&
      dataToUpload.video_url &&
      dataToUpload.caption &&
      dataContestant.artist_band_name &&
      errorContestant.artist_band_name === '' &&
      errorContestant.description === '' &&
      errorContestant.genre_ids === '' &&
      errorContestant.member_names === '' &&
      errorContestant.member_emails === '' &&
      errorToUpload.caption === '' &&
      errorToUpload.video_url === '' &&
      errorToUpload.genre_ids === '' &&
      errorToUpload.contest_id === ''
    ) {
      contestantProfile(dataContestant);
      uploadVideo(dataToUpload);
    }
  };

  // function to embed youtube video
  const embedYoutube = (url) => {
    // get video id from url
    const allKindOfUrl = [
      ...url.matchAll(
        /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})/gm
      )
    ];

    // if video id is not found
    if (allKindOfUrl?.length === 0) {
      return null;
    }

    // get video id
    const videoId = allKindOfUrl[0][1];

    // return embed url
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // on changes validation fe
  const handleChanges = (e) => {
    const { name, value } = e.target;

    if (name === 'artist_band_name') {
      if (value.length === 0) {
        setErrorContestant({
          ...errorContestant,
          artist_band_name: 'Tell us your band/artist name'
        });
      } else if (value.length < 3) {
        setErrorContestant({
          ...errorContestant,
          artist_band_name: 'Artist/Band name must be at least 3 characters'
        });
      } else if (value.length > 50) {
        setErrorContestant({
          ...errorContestant,
          artist_band_name: 'Artist/Band name must be at most 50 characters'
        });
      } else {
        setErrorContestant({
          ...errorContestant,
          artist_band_name: ''
        });
      }
      setDataContestant({
        ...dataContestant,
        artist_band_name: value
      });
    }

    if (name === 'video_url') {
      if (value?.length === 0) {
        setErrorVideoUrl('Input the youtube link of your song');
      } else {
        if (!value.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
          setErrorVideoUrl('Video URL is invalid');
        } else {
          setErrorVideoUrl('');
        }
      }
      setDataToUpload({
        ...dataToUpload,
        video_url: value
      });
    }

    if (name === 'caption') {
      if (value.length === 0) {
        setErrorToUpload({
          ...errorToUpload,
          caption: 'Caption is required'
        });
      } else if (value.length < 3) {
        setErrorToUpload({
          ...errorToUpload,
          caption: 'Caption must be at least 3 characters'
        });
      } else if (value.length > 50) {
        setErrorToUpload({
          ...errorToUpload,
          caption: 'Caption must be at most 50 characters'
        });
      } else {
        setErrorToUpload({
          ...errorToUpload,
          caption: ''
        });
      }
      setDataToUpload({
        ...dataToUpload,
        caption: value
      });
    }

    if (name === 'genre_ids') {
      if (!value) {
        setErrorGenre('Genre is required');
      } else {
        setErrorGenre('');
      }
      setDataToUpload({
        ...dataToUpload,
        genre_ids: value
      });
    }
  };

  useEffect(() => {
    setMemberArray();
  }, [countMembers]);

  // me
  useEffect(() => {
    if (user) {
      setDataContestant({
        ...dataContestant,
        artist_band_name: user?.contestant?.artist_band_name
      });

      setCountMembers(user?.contestant?.members?.length);
    }
  }, [user]);

  // events
  useEffect(() => {
    if (data) {
      const options = data?.data?.data?.map((event) => ({
        value: event?.id,
        label: event?.title,
        contest_id: event?.current_contest?.id
      }));
      setOptionsEvents(options);
      setSelectedEvent(options);
    }
  }, [data]);

  useEffect(() => {
    setDataToUpload({
      ...dataToUpload,
      contest_id: data?.data?.data?.[0]?.current_contest?.id
    });
  }, [selectedEvent]);

  // event
  useEffect(() => {
    setDataToUpload({
      ...dataToUpload,
      genre_ids: []
    });
  }, [dataEvent]);

  // error handling
  useEffect(() => {
    if (errorContestantProfile) {
      if (errorContestantProfile?.data?.errors?.artist_band_name) {
        setErrorContestant({
          ...errorContestant,
          artist_band_name: errorContestantProfile?.data?.errors?.artist_band_name[0]
        });
      }
      if (errorContestantProfile?.data?.errors?.description) {
        setErrorContestant({
          ...errorContestant,
          description: errorContestantProfile?.data?.errors?.description[0]
        });
      }
      if (errorContestantProfile?.data?.errors?.genre_ids) {
        setErrorContestant({
          ...errorContestant,
          genre_ids: errorContestantProfile?.data?.errors?.genre_ids[0]
        });
      }
    }
  }, [errorContestantProfile]);

  useEffect(() => {
    if (errorUpload) {
      if (errorUpload?.data?.message === 'api.video.must_order_quota_upload') {
        router.push('/');
        dispatch(setModal({ name: 'modalContinuePay', value: true }));
      }
    }
  }, [errorUpload]);

  // success handling
  useEffect(() => {
    if (isSuccessContestantProfile && isSuccessUpload) {
      console.log('dataContestantProfile', dataContestantProfile);
      dispatch(setModal({ name: 'modalShareVideo', value: true }));
      dispatch(setCredentials(dataContestantProfile));
    }
  }, [isSuccessContestantProfile, isSuccessUpload]);

  useEffect(() => {
    if (dataGenres) {
      setGenreOptions(
        dataGenres?.genres?.data.map((genre) => ({
          value: genre.id,
          label: genre.name
        }))
      );
    }
  }, [dataGenres]);

  return (
    <div className="container flex flex-col gap-5" ref={firstInput}>
      {/* Conditional Rendering */}
      {data && data?.data?.data?.length > 1 ? (
        <div className="flex flex-col gap-3">
          <label className="text-base text-[#FF00FE] font-semibold">{t('Select Event')}</label>
          <Select
            options={optionsEvents}
            className="text-zinc-800"
            onChange={(e) => {
              setDataToUpload({
                ...dataToUpload,
                contest_id: e.contest_id
              });
            }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <AiFillStar />
          <h3 className="text-xl font-bold">
            {data?.data?.data?.length === 1 ? data?.data?.data?.[0].title : `${t('No Event')}`}
          </h3>
        </div>
      )}
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label className="text-base text-[#FF00FE] font-semibold">{t('Song Name')}</label>
            <input
              type="text"
              className={
                errorToUpload.caption
                  ? 'text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md border-2 border-red-500 focus:outline-none'
                  : 'text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md focus:outline-none'
              }
              placeholder={t('Enter your song name')}
              name="caption"
              value={dataToUpload.caption}
              onChange={(e) => {
                handleChanges(e);
              }}
            />
            <ErrorMessage message={t(errorToUpload.caption)} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-base text-[#FF00FE] font-semibold">{t('Music Genre')}</label>
            <Select
              className="custom-select"
              options={genreOptions}
              isMulti
              closeMenuOnScroll
              size="200px"
              styles={{
                control: (base) => ({
                  ...base,
                  border: errorGenre ? '2px solid #F04444 !important' : 'none'
                })
              }}
              onChange={(e) => {
                // get selected option
                const val = e?.map((item) => item?.value);
                setDataContestant({
                  ...dataContestant,
                  genre_ids: val
                });
                setDataToUpload({
                  ...dataToUpload,
                  genre_ids: val
                });
                setErrorGenre('');
              }}
              value={genreOptions?.filter(
                (item) =>
                  dataToUpload?.genre_ids &&
                  dataContestant?.genre_ids?.find((items) => items === item?.value)
              )}
              // value={dataToUpload?.genre_ids}
              name="favoriteMusicGenres"
            />
            <ErrorMessage message={t(errorGenre)} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-base text-[#FF00FE] font-semibold">{t('YouTube Link')}</label>
            <input
              type="text"
              className={
                errorVideoUrl
                  ? 'text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md border-2 border-red-500 focus:outline-none'
                  : 'text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md focus:outline-none'
              }
              placeholder={t('Enter the link of your song on YouTube')}
              name="video_url"
              value={dataToUpload.video_url}
              onChange={(e) => {
                handleChanges(e);
              }}
            />
            <ErrorMessage message={t(errorVideoUrl)} />
          </div>
          <div className="rounded-lg flex flex-col gap-4 p-3 w-full aspect-video">
            <iframe
              className="h-full w-full rounded-lg bg-[#454445]"
              title="video_url"
              src={embedYoutube(dataToUpload.video_url)}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="flex items-center gap-3 text-center m-auto">
              <AiOutlineEye className="text-[#23FF2C]" />
              <h6 className="m-0 text-base">{t('Video Preview')}</h6>
            </div>
          </div>
          {/* <div className="flex flex-col gap-3">
                    <label className="text-base text-[#FF00FE] font-semibold">Select the songs original artist</label>
                    <ArtistSongs />
                    </div> */}
          <div className="flex flex-col gap-3">
            <label className="text-base text-[#FF00FE] font-semibold">
              {t('Your Name / Band Name')}
            </label>
            <input
              type="text"
              className={
                errorContestant?.artist_band_name
                  ? 'text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md border-2 border-red-500 focus:outline-none'
                  : 'text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md focus:outline-none'
              }
              placeholder={t('Enter your name or the bands name')}
              name="artist_band_name"
              value={dataContestant.artist_band_name}
              onChange={(e) => {
                handleChanges(e);
              }}
              disabled={user?.contestant?.artist_band_name ? true : false}
            />
            {user?.contestant?.artist_band_name && (
              <p className="text-xs text-white font-light">
                {t('*Name changes must be made in the account page')}
              </p>
            )}
            <ErrorMessage message={t(errorContestant?.artist_band_name)} />
          </div>

          <span className="text-base font-light mt-[-15px]">
            {t(
              'Note: If the name of a band is entered above, the performer will appear as the band name under all videos uploaded on this account. Names changes must be made on the account page.'
            )}
          </span>

          <div className="flex flex-col gap-3">
            <label className="text-base text-slate-50 font-semibold mb-1">
              {t('Add band members (Optional)')}{' '}
            </label>
            {[...new Array(countMembers)]
              ?.map((data, i) => i.toString())
              ?.filter((res) => (deletedMembers?.find((_res) => _res === res) ? null : res))
              ?.map((i) => {
                const index = i;
                return (
                  <InputMember
                    key={i}
                    index={index}
                    setMember={setMemberArray}
                    value1={user?.contestant?.members?.[index]?.name ?? ''}
                    value2={user?.contestant?.members?.[index]?.email ?? ''}
                    onClose={(e) => {
                      // create array of member names

                      setDeletedMembers([...deletedMembers, ...[e]]);
                    }}
                  />
                );
              })}
          </div>
          <div
            className="flex justify-end items-center gap-1 mt-2 cursor-pointer"
            onClick={(e) => {
              addInput(e);
            }}>
            <button type="button" className="text-sm font-medium">
              {t('add additional member')}
            </button>
            <span type="button">
              <AiOutlinePlus />
            </span>
          </div>
          <div className="flex gap-2 items-center mt-4 w-full">
            <button
              type="button"
              className="text-sm font-semibold p-3 border-2 border-[#FF00FE] text-[#FF00FE] w-1/2 rounded-md"
              onClick={() => {
                router.push('/');
              }}>
              {t('I’ll do it later')}
            </button>
            <button
              type="submit"
              className="text-sm font-semibold p-3 bg-[#FF00FE] text-[#6CFF00] w-1/2 rounded-md"
              onClick={(e) => {
                if (!isLoadingUpload) {
                  dispatch(eventApi.util.invalidateTags([{ type: 'PaymentVideo' }]));
                  dispatch(authenticationApi.util.invalidateTags([{ type: 'Video' }]));
                }
              }}
              disabled={isLoadingUpload}>
              {isLoadingUpload && (
                <svg
                  aria-hidden="true"
                  className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
              {isLoadingUpload ? t('Loading...') : t('Submit')}
            </button>
          </div>
        </div>
      </form>
      {modalShareVideo && (
        <ModalShareVideo dataUpload={dataUpload} name={dataContestant.artist_band_name} />
      )}
    </div>
  );
}
