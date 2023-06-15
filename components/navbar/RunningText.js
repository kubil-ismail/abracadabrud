import Marquee from 'react-fast-marquee';
import parse from 'html-react-parser';

export default function RunningText({ text }) {

  return (
    <div className="">
      <div className="bg-[#2E2D2D] px-2 py-1 text-slate-50 text-center ">
        <Marquee gradient={false} speed={40} style={{ paddingRight: '1px' }}>
          {text?.map((item, index) => (
            <>
              <span
                className="text-xs font-medium block pr-1"
                key={`marque_item_${index}`}
                style={{ whiteSpace: 'nowrap' }}>
                {parse(item?.text)}
              </span>
            </>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
