import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import React from 'react';

// const inter = Inter({ subsets: ['latin'] });

export default function NotFound() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace('/');
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="h-[85vh] flex items-center justify-center w-full">
        <div className="flex flex-col items-center gap-5">
          <img src="/assets/images/sp-empty.png" alt="not-found" className="w-56" />
          <div className="flex flex-col gap-3 items-center">
            <h3 className="text-slate-50 font-bold text-3xl">Redirect to home...</h3>
            <span className="text-sm md:text-lg font-light text-center w-[45%] m-auto block">
              Loading...
            </span>
          </div>
          <button
            className="px-4 py-2 rounded-md bg-[#f903ef] w-48 mt-4"
            onClick={() => router.push('/')}>
            Go to Homefeed
          </button>
        </div>
      </div>
    </div>
  );
}
