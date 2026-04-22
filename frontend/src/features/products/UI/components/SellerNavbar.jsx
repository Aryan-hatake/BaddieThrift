import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
const SellerNavbar = () => {
  const navigate = useNavigate();
  const {handleLogout} = useAuth();
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
            <Link
              to="/seller"
              className="text-black text-sm font-bold tracking-widest uppercase hover:text-[#506600] transition-colors"
            >
             INVENTORY
            </Link>
            <Link
              to="/seller/create-product"
              className=" text-black text-sm font-bold tracking-widest hover:text-[#506600] transition-colors uppercase px-2"
            >
              ADD PRODUCT
            </Link>
            <Link
              to="/"
              className="text-black text-sm font-bold tracking-widest uppercase hover:text-[#506600] transition-colors"
            >
              CATALOG
            </Link>
            <Link
              to="/auth/login"
              onClick={handleLogout}
              className="text-black text-sm font-bold tracking-widest uppercase hover:text-[#506600] transition-colors"
            >
              LOGOUT
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SellerNavbar;
