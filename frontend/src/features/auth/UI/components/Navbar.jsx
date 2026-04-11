import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md flex justify-between items-center w-full px-8 md:px-12 h-20 fixed top-0 z-[60] border-b border-[#1b1b1b]/5">
      {/* Left: Brand + Nav Links */}
      <div className="flex items-center gap-8 lg:gap-12">
        <a
          href="/"
          className="text-2xl md:text-3xl font-black tracking-tighter text-[#1b1b1b] uppercase"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          ASPHALT THEORY
        </a>

        <div className="hidden md:flex gap-8 lg:gap-10">
          <a href="#" className="text-[#1b1b1b] text-xs font-bold uppercase tracking-[0.2em] hover:text-[#506600] transition-colors">
            CATALOG
          </a>
          <a href="#" className="text-[#1b1b1b] text-xs font-bold uppercase tracking-[0.2em] hover:text-[#506600] transition-colors">
            DROPS
          </a>
          <a href="#" className="text-[#506600] text-xs font-black uppercase tracking-[0.2em] relative">
            ARCHIVE
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ccff00]" />
          </a>
          <a href="#" className="text-[#1b1b1b] text-xs font-bold uppercase tracking-[0.2em] hover:text-[#506600] transition-colors">
            EDITORIAL
          </a>
        </div>
      </div>

      {/* Right: Sign In link only (no user data yet) */}
      <div className="flex items-center">
        <a
          href="/login"
          className="text-[9px] font-black uppercase tracking-[0.3em] border border-[#1b1b1b]/20 px-4 py-2 hover:border-[#ccff00] hover:text-[#506600] transition-all"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          SIGN IN
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
