import moment from 'moment';
import EllipsisText from 'react-ellipsis-text';

export default function LoadingCheckout({ data }) {
  return (
    <div className="bg-[#282828]/70 fixed top-0 right-0 left-0 z-50 h-screen">
        <div className="flex items-center justify-center h-full w-full">
            <div className="flex flex-col space-y-2 text-white">
                <img src="/assets/images/magic.png" alt="wizard" className="w-16 m-auto animate-pulse" />
                <div class="loader">Harap tunggu ya <span class="loader__dot">.</span><span class="loader__dot">.</span><span class="loader__dot">.</span></div>
            </div>
        </div>
    </div>
  );
}
