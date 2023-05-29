import Marquee from 'react-fast-marquee';
import service from 'core/services/publicService';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import parse from 'html-react-parser';

export default function RunningText({ text }) {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    service
      .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/running-text`)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => { });
  }, [router.pathname]);

  return (
    <div className="">
      <div className="bg-[#2E2D2D] px-2 py-1 text-slate-50 text-center ">
        <Marquee gradient={false} speed={40} style={{ paddingRight: '1px' }}>
          {data?.map((item, index) => (
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
