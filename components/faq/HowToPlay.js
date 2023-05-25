import Head from 'next/head';
import Image from 'next/image';
import { AiOutlineMenu } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import Navbar from '../navbar';
import MenuBar from '../navbar/MenuBar';

export default function HowToPlay({ children }) {
  return (
    <div className="px-5 py-8 bg-[#FF00FE] rounded-lg flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <img src="/assets/images/faq.png" alt="faq" className="w-full rounded-xl" />
        <div className="flex flex-col gap-5">
          <h3 className="font-bold text-[#23FF2C] text-4xl">How to play?</h3>
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-base text-slate-50">COLLECT POINTS & VOTE</h3>
            <span className="font-medium text-sm text-slate-50">
              Collect the most points by completing your profile, watching sponsor videos, and
              sharing your referral code with your friends, or uploading a video.
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-base text-slate-50">UPLOAD A VIDEO</h3>
            <span className="font-medium text-sm text-slate-50">
              Make a music video of you singing one of the events featured artists famous songs or
              one of your own original songs.
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-base text-slate-50">Upgrade to Premium</h3>
            <span className="font-medium text-sm text-slate-50">
              Upgrade to a premium account and get 200 votes per week.
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <h3 className="font-bold text-[#23FF2C] text-4xl">How to win!</h3>
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-base text-slate-50">1- GET THE MOST POINTS</h3>
          <span className="font-medium text-sm text-slate-50">
            Users who have earned the most points in one week will be entered into a weekly lucky
            draw to win concert tickets and meet and greet opportunities with artists at the live
            event. Travel and accommodation to the event from anywhere in Indonesia is included.{' '}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-base text-slate-50">2- VOTE OFTEN</h3>
          <span className="font-medium text-sm text-slate-50">
            Use your points to vote for your favorite videos. Players that have voted during the
            previous seven days will also be entered into the weekly lucky draw.
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-base text-slate-50">3- PICK THE WINNER</h3>
          <span className="font-medium text-sm text-slate-50">
            If the video you have the most votes for wins the competition, you will win XXXXX.
          </span>
        </div>
      </div>
    </div>
  );
}
