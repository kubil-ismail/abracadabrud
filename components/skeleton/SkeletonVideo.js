import Link from 'next/link';

export default function SkeletonVideo() {
  return (
    <div className="max-w-5xl m-auto">
      <div className="grid grid-cols-1 gap-4 text-slate-50">
        <div className="flex flex-col gap-3 mb-[20px]">
          <div className="w-full h-[191px] md:h-[240px] rounded-[23px] overflow-hidden animate-pulse" />
        </div>
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex justify-between w-full text-slate-50">
            <div className="flex gap-[10px]">
              <div className="flex-0">
                <Link href="/user">
                  <div className="w-[52px] h-[52px] rounded-full animate-pulse"></div>
                </Link>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex gap-1 items-center text-xs font-normal">
                  <span className="w-1/2 h-2 animate-pulse" />
                  <span className="w-1 h-1 rounded-full animate-pulse" />
                  <span className="w-[40%]" />
                </div>
                <h3 className="w-1/2 h-2"></h3>
              </div>
            </div>
            <div className="flex-0">{/* <ThreeDotVideo /> */}</div>
          </div>
          {/* <div className="flex justify-between">
                                <div className="w-[64px] invisible"/>
                                <div className="flex gap-3 w-full">
                                    <div className="flex-1 flex items-center gap-3 md:gap-8 w-full">
                                    <BottomSheetsFavorite />
                                    <BottomSheetsComment />
                                    <BottomSheetsVote />
                                    </div>
                                    <div className="flex-0">
                                    <button type="button" onClick={() =>
                                        !isAuthenticated ? dispatch(setModal({ name: 'modalLogin', value: true })) : setIsOpen(true)
                                    } className="flex items-center gap-2 py-2 px-3 bg-[#FF00CA] text-[#0000FF] rounded-md">
                                        <img src="/assets/icons/btn-vote-icon.svg" alt="btn-vote-icon" className="w-5" />
                                        <span className="text-sm font-extrabold">Vote</span>
                                    </button>
                                    </div>
                                </div> 

                            </div> */}
        </div>
      </div>
    </div>
  );
}
