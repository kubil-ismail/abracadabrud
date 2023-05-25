import { useDispatch, useSelector } from 'react-redux';
import { useGetEventsAllQuery } from 'core/services/rtk/EventServices';
import { setFilterContent } from 'core/redux/reducers/modalSlice';
import Select from 'react-select';
import ErrorMessage from 'components/error/ErrorMessage';
import { useState } from 'react';
import Image from 'next/image';

export default function ModalReportVideo() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState(null);
  const [errors, setErrors] = useState('');
  const [errors2, setErrors2] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dates, setDates] = useState({
    start: null,
    end: null
  });
  const { data, error, isLoading } = useGetEventsAllQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );
  const { filterContent } = useSelector((state) => state.modal);

  return (
    <>
      {filterContent === 'events' && (
        <form
          id="form-reason"
          onSubmit={(e) => {
            e.preventDefault();

            if (!errors) {
              dispatch(
                setFilterContent({
                  type: 'events',
                  value: events
                })
              );
            }
          }}>
          <div className="">
            <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
              <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
                <div className="flex justify-end">
                <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/close-icon.png`}
                alt="close"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(setFilterContent(null));
                }}
                />
                  {/* <RiCloseFill
                    size={32}
                    className="cursor-pointer"
                    onClick={() => {
                      dispatch(setFilterContent(null));
                    }}
                  /> */}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl leading-6 mb-4 font-bold">Filter Events</h3>
                  <span className="text-xs md:text-sm font-medium">
                    Select your favorite events.
                  </span>
                </div>
                <div className="my-3 mt-10">
                  <div className="flex flex-col gap-3 mb-3">
                    <Select
                      className="custom-select"
                      options={(data?.data ?? [])?.map((item) => ({
                        value: item?.id,
                        label: item?.title
                      }))}
                      value={(data?.data ?? [])
                        ?.map((item) => ({
                          value: item?.id,
                          label: item?.title
                        }))
                        ?.find((item) => item?.value === selectedEvent)}
                      size="200px"
                      onChange={(e) => {
                        setErrors('');
                        setEvents(e.value);
                        setSelectedEvent(e.value);
                      }}
                      required
                    />
                  </div>
                  <ErrorMessage message={errors} />
                </div>
                <div className="flex flex-col mt-5 mb-3 gap-2 border-t">
                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      className="inline-flex text-slate-50 justify-center rounded-md px-4 py-2 text-sm font-semibold focus:outline-none"
                      onClick={() => {
                        dispatch(
                          setFilterContent({
                            type: 'default'
                          })
                        );
                      }}>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center border-2 border-[#FF00FE] hover:bg-[#FF00FE] rounded-md px-4 py-2 text-sm tetx-slate-50 bg-second-accent text-third-accent focus:outline-none font-semibold cursor-pointer"
                      onClick={() => {
                        if (!events) {
                          setErrors('Event is required');
                        }
                      }}>
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {filterContent === 'date' && (
        <form
          id="form-reason"
          onSubmit={(e) => {
            e.preventDefault();

            if (!errors && !errors2) {
              dispatch(
                setFilterContent({
                  type: 'date',
                  value: dates
                })
              );
            }
          }}>
          <div className="">
            <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
              <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
                <div className="flex justify-end">
                <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/close-icon.png`}
                alt="close"
                width={24}
                height={24}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(setFilterContent(null));
                }}
                />
                  {/* <RiCloseFill
                    size={32}
                    className="cursor-pointer"
                    onClick={() => {
                      dispatch(setFilterContent(null));
                    }}
                  /> */}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl leading-6 mb-4 font-bold">Filter Date</h3>
                  {/* <span className="text-xs md:text-sm font-medium">Select your date range</span> */}
                </div>
                <div className="mt-5">
                  <div className="flex flex-col gap-3 mb-3">
                    <span className="text-sm">Select date start</span>
                    <input
                      type="date"
                      className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md"
                      min={
                        new Date(new Date().setFullYear(new Date().getFullYear() - 10))
                          .toISOString()
                          .split('T')[0]
                      }
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setDates({ ...dates, start: e.target.value });
                        setErrors('');
                      }}
                    />
                  </div>
                  <ErrorMessage message={errors} />
                </div>
                <div className="my-1">
                  <div className="flex flex-col gap-3 mb-3">
                    <span className="text-sm">Select date end</span>
                    <input
                      type="date"
                      className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md"
                      min={
                        new Date(new Date().setFullYear(new Date().getFullYear() - 10))
                          .toISOString()
                          .split('T')[0]
                      }
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setDates({ ...dates, end: e.target.value });
                        setErrors2('');
                      }}
                    />
                  </div>
                  <ErrorMessage message={errors2} />
                </div>
                <div className="flex flex-col mt-5 mb-3 gap-2 border-t">
                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      className="inline-flex text-slate-50 justify-center rounded-md px-4 py-2 text-sm font-semibold focus:outline-none"
                      onClick={() => {
                        dispatch(
                          setFilterContent({
                            type: 'default'
                          })
                        );
                      }}>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center border-2 border-[#FF00FE] hover:bg-[#FF00FE] rounded-md px-4 py-2 text-sm tetx-slate-50 bg-second-accent text-third-accent focus:outline-none font-semibold cursor-pointer"
                      onClick={() => {
                        if (!dates?.start) {
                          setErrors('Date start is required');
                        }

                        if (!dates?.end) {
                          setErrors2('Date end is required');
                        }
                      }}>
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
