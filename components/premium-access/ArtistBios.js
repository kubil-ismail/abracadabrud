import Head from 'next/head';
import Image from 'next/image';

export default function ArtisBios({ title, image, description }) {
  return (
    <div className="container w-full h-full">
      <div className="flex flex-col items-center gap-5">
        <img src={image} alt="wld-htp" className="w-full h-64 md:h-[320px] m-auto object-cover" />
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-[#23FF2C]">{title}</h3>
          <span
            className="text-sm font-normal"
            dangerouslySetInnerHTML={{ __html: description }}></span>
        </div>
      </div>
    </div>
  );
}
