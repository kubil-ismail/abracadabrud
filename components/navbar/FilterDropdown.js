import { useRouter } from 'next/router';
import { useState } from 'react';

export default function FilterDropdown() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const router = useRouter();
  return (
    <div className="">
      <select
        name="category-list"
        id="category-list"
        className="bg-transparent text-slate-50 focus:outline-none border-0"
      >
        <option value="" className="text-zinc-900 text-xs p-3">
          Sort By
        </option>
        <option value="Outdoor" className="text-zinc-900 text-xs">
          Outdoor
        </option>
        <option value="Indoor" className="text-zinc-900 text-xs">
          Indoor
        </option>
        <option value="Aquatics" className="text-zinc-900 text-xs">
          Aquatics
        </option>
      </select>
    </div>
  );
}
