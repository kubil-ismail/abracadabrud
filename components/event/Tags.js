// import { useEffect } from 'react'
// import Head from 'next/head'
// import Image from 'next/image'
// import parse from 'html-react-parser';
// import { BsCalendarDate } from 'react-icons/bs';
// import { useGetEventsQuery, useGetEventQuery } from '../../core/services/rtk/EventServices'
// import { useRouter } from 'next/router'
// import moment from 'moment';

// export default function Tags() {
//   const { data, error, isLoading } = useGetEventsQuery({
//     page: 1,
//     type: 7,
//     search: '',
//     page_size: 10,
//   },
//   {
//     refetchOnMountOrArgChange: true,
//   }

//   )

//   if (isLoading) {
//     return <div>Loading...</div>
//   }

//   if (error) {
//     return <div>{error.message}</div>
//   }

//   if (!data || !data.data?.data) {
//     return (
//       <div>
//         <h3 className="font-bold text-2xl text-[#6CFF00]">Current Event</h3>
//         <p>No Event</p>
//       </div>)
//   }

//   console.log(data.data.data);

//   return (
//     <div className="flex flex-col gap-3 mt-5 text-slate-50">
//         <h3 className="text-base font-bold">Tags</h3>
//         <div className="flex flex-wrap gap-3 justify-center w-full">
//         {
//             data.data.data.map((event) => (
//                 <span className="text-[10px] py-1 px-3 bg-[#302C2C] rounded-full">{event?.tags}</span>
//             ))
//         }
//         </div>

//     </div>
//   )
// }
