import Marquee from 'react-fast-marquee';
import service from 'core/services/publicService';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function RunningText({ text }) {
  const [data, setData] = useState([]);
  const router = useRouter();
  useEffect(() => {
    service
      .get('/running-text')
      .then((res) => {
        setData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
                dangerouslySetInnerHTML={{ __html: `${item.text}` }}></span>

              <span
                dangerouslySetInnerHTML={{ __html: `&#x2022;` }}
                style={{ marginRight: '10px', marginLeft: '5px' }}></span>
            </>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
