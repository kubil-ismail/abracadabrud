import Head from 'next/head';
import Image from 'next/image';

export default function ArtisBios({ title, image, description }) {
  return (
    <div className="container w-full h-full">
      <div className="flex flex-col space-y-5">
        <img src={image} alt="image" className="w-full h-64 md:h-[480px] m-auto object-cover rounded-md" />
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-bold text-[#23FF2C]">{title}</h3>
          <span
            className="text-sm font-normal w-full"
            dangerouslySetInnerHTML={{ __html: description }}></span>
        </div>
      </div>
    </div>
  );
}
