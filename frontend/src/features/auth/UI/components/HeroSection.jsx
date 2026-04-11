import React from 'react';

const HeroSection = () => {
  return (
    <div className="col-span-12 lg:col-span-7 relative mb-24 lg:mb-0">

      {/* ── Headline Text ── */}
      <div className="relative z-20 pointer-events-none">
        <span
          className="text-[10px] font-bold tracking-[0.5em] text-[#ccff00] mb-4 block"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          ENTRY_POINT / ARCHIVE_ACCESS
        </span>

        <h2
          className="text-6xl sm:text-7xl md:text-[10rem] lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-8"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          THE{' '}
          <span className="bg-[#1b1b1b] text-[#ccff00] px-4">VAULT</span>
          <br />
          <span className="text-outline text-[#1b1b1b]">SYSTEM</span>
        </h2>
      </div>

      {/* ── Hero Image Group ── */}
      <div className="relative group ml-8 sm:ml-12 lg:ml-24">
        {/* Neon lime tint overlay behind image */}
        <div className="absolute -top-12 -left-12 w-full h-full bg-[#ccff00] mix-blend-multiply opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

        {/* Grayscale → full colour on hover */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA681pBn7LrEad8fN2YFb7P2D_Z0iArxbnK7ylAWJeqYtKrxfIXFhwOurQzzZFYQYinTAo_bSVWssVJkUzTGwGbXN9LcjavntVrwUb0CeG9h3NgGx1GE55sUpeObRtwF_UOSTp86LeLf6D-rK0kgDbaxGt_jUnnHvZlUjhpYBF0ZpGmByzL-iq-hvFVR-ZOoxgV_VmcCM4hmtgM-Ghyem5ICbHJWv4qZnxBWHOrg4tH97hJRIcqd4UwKSzBWbbDHJcOw-WCTmFJUOB3"
          alt="High-fashion streetwear model in industrial setting"
          className="w-full grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700 object-cover aspect-[4/5]"
        />

        {/* ── Vertical Status Strings ── */}
        <div className="absolute -right-8 bottom-24 vertical-lr hidden xl:flex gap-6 items-center">
          <span
            className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#1b1b1b]/40"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            PROTOCOL_V1.04 // SECURE_SOCKET
          </span>
          <div className="h-24 w-px bg-[#1b1b1b]/20" />
          <span
            className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#ccff00]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            TIMESTAMP: 2024.11.08
          </span>
        </div>
      </div>

      {/* ── Editorial Quote ── */}
      <div className="mt-12 max-w-sm ml-8 sm:ml-12 lg:ml-24">
        <p
          className="text-sm leading-relaxed text-[#5e5e5e] tracking-wide italic"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          "WE DO NOT BROADCAST. WE ARCHIVE. ACCESS IS RESERVED FOR THOSE WHO
          OBSERVE THE SHADOWS OF THE CONCRETE."
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
