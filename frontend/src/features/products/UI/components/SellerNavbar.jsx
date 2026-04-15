import React from 'react';
import { useNavigate } from 'react-router-dom';

const SellerNavbar = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 bg-white flex justify-between items-center w-full px-6 py-4 border-b-2 border-black">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 border-2 border-black hover:bg-black hover:text-white transition-colors group"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-lg leading-none">arrow_back</span>
          </button>
          <span
            className="font-black tracking-tighter text-xl uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            PRODUCT_ENTRY
          </span>
        </div>

        {/* Right: Desktop nav links + overflow */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <a
              href="#"
              className="text-black text-sm font-bold tracking-widest uppercase hover:text-[#506600] transition-colors"
            >
              DASHBOARD
            </a>
            <a
              href="#"
              className="bg-[#ccff00] text-black text-sm font-bold tracking-widest uppercase px-2"
            >
              INVENTORY
            </a>
            <a
              href="#"
              className="text-black text-sm font-bold tracking-widest uppercase hover:text-[#506600] transition-colors"
            >
              SALES
            </a>
          </div>
          <button
            className="flex items-center justify-center w-9 h-9 hover:bg-[#f3f3f3] transition-colors"
            aria-label="More options"
          >
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default SellerNavbar;
