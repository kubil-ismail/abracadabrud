import { MdOutlineFileCopy } from 'react-icons/md';

export default function PaymentInstruction() {
  return (
    <div className="flex justify-between items-center w-full p-4 bg-[#4A4444] mt-4 rounded-md">
      <h3 className="text-sm font-bold">Virtual Account BNI</h3>
      <div className="flex gap-2">
        <span className="text-xs">8578371808652985</span>
        <MdOutlineFileCopy />
      </div>
    </div>
  );
}
