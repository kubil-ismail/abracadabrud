import moment from "moment";

export default function VoteNotif({ data }) {

  //   const typeName = type === 'membership' ? 'membership' : 'video';

  return (
    <div
      className={`${data?.has_read ? 'bg-[#3a383e]' : 'bg-[#404040]'} mt-2 p-4 hover:bg-[#3a383e] text-slate-50 shadow-[-1px_2px_14px_-1px_rgba(0,0,0,0.04)] rounded-lg transition-all ease-in-out delay-75 cursor-pointer`}
      //   style={{
      //     color: style?.light_text,
      //     background: style?.secondary_background,
      //     opacity: data.has_read ? 0.5 : 1,
      //   }}
      //   onClick={() => onClick(data.id)}
      aria-hidden>
      <div className="flex gap-3 items-center">
        <div className="flex-1 flex gap-3">
          <div className="flex-none">
            <img
              src={
                data?.payload?.voted_by?.photo.includes('uploads')
                  ? data?.payload?.voted_by?.photo
                  : '/assets/images/user.png'
              }
              alt="crown"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover object-center"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <h3 className="text-[10px] md:text-base font-semibold m-0">
                  {data?.payload?.voted_by?.fullname}
                </h3>
                {/* <span className="text-[10px] text-gray-200">{data?.payload?.voted_by?.username}</span> */}
                <div className="flex gap-1 items-center">
                  <div className="w-1 h-1 rounded-full text-gray-200" />
                  <span className="text-[8px] md:text-[10px] text-gray-200">
                    {moment(data?.created_at).fromNow()}
                  </span>
                </div>
              </div>
              <div className="">
                <span className="text-xs">
                  You received {data?.data?.total_vote} {data?.data?.total_vote >= 2 ? "Votes" : "vote"} from{' '}
                  {data?.payload?.voted_by?.username}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex-none">
          <div>
            <img src="/assets/images/user.png" alt="thumbnail" className="w-16 h-[32px] rounded-sm object-center object-cover" />
          </div>
        </div> */}
      </div>
    </div>
  );
}