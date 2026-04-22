import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const Navbar = () => {
  const location= useLocation()

  return (
    <nav className="bg-white/80 backdrop-blur-md flex justify-between items-center w-full px-8 md:px-12 h-20 fixed top-0 z-[60] border-b border-[#1b1b1b]/5">
      {/* Left: Brand + Nav Links */}
      <div className="flex items-center  gap-8 lg:gap-12">
        <a
          href="/"
          className="text-2xl md:text-3xl font-black tracking-tighter text-[#1b1b1b] uppercase"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Baddie Thrift
        </a>

        <div className="hidden md:flex gap-8 lg:gap-10">
          <Link to={"/"} className="text-[#1b1b1b] text-xs font-bold uppercase tracking-[0.2em] hover:text-[#506600] transition-colors">
            CATALOG
          </Link>
       

        </div>
      </div>

      {/* Right: Sign In link only (no user data yet) */}
      <div className="flex gap-4 items-center">
        <Link
          to={location.pathname.endsWith("register") ? "/auth/login" : "/auth/register"}
          className="text-[9px] font-black whitespace-nowrap uppercase tracking-[0.3em] border border-[#1b1b1b]/20 px-4 py-2 hover:border-[#ccff00] hover:text-[#506600] transition-all"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {location.pathname.endsWith("register") ? "SIGN UP" : "SIGN IN"}
        </Link>
        <Link
          to={"/"}
          className="text-[9px] font-black uppercase tracking-[0.3em] border border-[#1b1b1b]/20 px-4 py-2 hover:border-[#ccff00] hover:text-[#506600] transition-all"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          CATALOG
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
