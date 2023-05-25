import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export default function ModalTransaction({ invoice, status, price, date, item, paymentMethod }) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md px-4 py-2 text-sm font-medium bg-[#FF00CA] text-[#0000FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          See Details
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#2B1462] text-slate-50 p-8 mx-3 md:mx-0 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-2xl leading-6 mb-5 font-bold">Detail Transaction</h3>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between gap-3">
                      <span className="text-sm font-reguler">Invoice ID</span>
                      <span className="text-sm font-bold underline">{invoice}</span>
                    </div>
                    <div className="flex justify-between gap-3 pb-2 border-b border-white">
                      <span className="text-sm font-reguler">Status</span>
                      <span className="text-sm font-bold">Pending</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-reguler">Price</span>
                      <input
                        type="text"
                        className="px-3 py-2 bg-white text-zinc-800 rounded-md text-sm"
                        value={price}
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-reguler">Date & Time</span>
                      <input
                        type="text"
                        className="px-3 py-2 bg-white text-zinc-800 rounded-md text-sm"
                        value="27 Feb 2023, 12:19 WIB"
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-reguler">Item</span>
                      <input
                        type="text"
                        className="px-3 py-2 bg-white text-zinc-800 rounded-md text-sm"
                        value="Video"
                        disabled
                      />
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-sm font-reguler">Payment Method</span>
                      <span className="text-sm font-bold">{paymentMethod}</span>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-3">
                      <button
                        type="button"
                        className="px-3 py-2 border border-[#FF00FE] text-[#FF00FE] rounded-md text-sm font-semibold"
                      >
                        Cancel Payment
                      </button>
                      <button
                        type="button"
                        className="px-8 py-2 bg-[#FF00FE] text-[#0000FF] rounded-md text-sm font-semibold"
                      >
                        Pay
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

// import { useState } from 'react';
// import { RiCloseFill } from 'react-icons/ri';
// import { useDispatch } from 'react-redux';
// import { setModal } from '../../../core/redux/reducers/modalSlice';

// export default function ModalTransaction() {
// const dispatch = useDispatch();
//   return (
//     <>
//       <div className="">
//         <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
//           <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
//             <div className="flex justify-end">
//               <RiCloseFill size={32} className="cursor-pointer" onClick={() => dispatch(setModal({ name: 'modalTransaction', value: false })) } />
//             </div>
//             <div className="flex flex-col gap-4">
//               <h3 className="text-2xl leading-6 mb-5 font-bold">Detail Transaction</h3>
//             </div>
//             <div className="flex flex-col gap-5">
//                 <div className="flex justify-between gap-3">
//                     <span className="text-sm font-reguler">Invoice ID</span>
//                     <span className="text-sm font-bold underline">order-1674620409</span>
//                 </div>
//                 <div className="flex justify-between gap-3 pb-2 border-b border-white">
//                     <span className="text-sm font-reguler">Status</span>
//                     <span className="text-sm font-bold">Sucess</span>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                     <span className="text-sm font-reguler">Price</span>
//                     <input type="text" className="px-3 py-2 bg-white text-zinc-800 rounded-md text-sm" value="200" disabled />
//                 </div>
//                 <div className="flex flex-col gap-2">
//                     <span className="text-sm font-reguler">Date & Time</span>
//                     <input type="text" className="px-3 py-2 bg-white text-zinc-800 rounded-md text-sm" value="27 Feb 2023, 12:19 WIB" disabled />
//                 </div>
//                 <div className="flex flex-col gap-2">
//                     <span className="text-sm font-reguler">Item</span>
//                     <input type="text" className="px-3 py-2 bg-white text-zinc-800 rounded-md text-sm" value="Membership" disabled />
//                 </div>
//                 <div className="flex justify-between gap-3">
//                     <span className="text-sm font-reguler">Payment Method</span>
//                     <span className="text-sm font-bold">Gopay</span>
//                 </div>
//                 <div className="flex items-center justify-end gap-3 mt-3">
//                     <button type="button" className="px-3 py-2 border border-[#FF00FE] text-[#FF00FE] rounded-md text-sm font-semibold">Cancel Payment</button>
//                     <button type="button" className="px-8 py-2 bg-[#FF00FE] text-[#0000FF] rounded-md text-sm font-semibold">Pay</button>
//                 </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
