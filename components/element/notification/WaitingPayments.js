import moment from 'moment';

export default function WaitingPayments({ data }) {
  //   const typeName = type === 'membership' ? 'membership' : 'video';

  return (
    <div
      className={`${data?.has_read ? 'bg-[#3a383e]' : 'bg-[#404040]'} mt-2 p-4 hover:bg-[#3a383e] text-slate-50 shadow-[-1px_2px_14px_-1px_rgba(0,0,0,0.04)] rounded-lg transition-all ease-in-out delay-75 cursor-pointer`}
      //   style={{
      //     background: data.has_read ? 'rgba(255, 0, 254, 0.4)' : style?.primary_background,
      //     backgroundColor: style?.primary_background,
      //   }}
      //   onClick={() => onClick(data.id)}
      aria-hidden>
      <div className="flex gap-3">
        <div className="flex-1 flex gap-3 py-1">
          <div className="flex-none">
            <img src="/assets/images/wait-payment.png" alt="crown" className="w-10 md:w-16" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold m-0 text-xs md:text-base">{data?.title}</h3>

              <p className="m-0 font-light text-[10px] md:text-sm w-full">{data?.body}</p>
              <p className="font-light text-[10px] md:text-[11px] w-full mt-2">
                {moment(data?.created_at).format('LLL')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
