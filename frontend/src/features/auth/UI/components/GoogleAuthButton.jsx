import React from "react";
import { motion } from "framer-motion";


/* ─────────────────────────────────────────────
   Shared "CONTINUE VIA G_PROTOCOL" button
   Drop this anywhere after a form's submit btn
───────────────────────────────────────────── */

/** Official Google "G" SVG — multicolour, 18 × 18 */
const GoogleG = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
      fill="#EA4335"
    />
  </svg>
);

const bgSlide = {
  rest: { x: "-100%" },
  hover: { x: "0%", transition: { duration: 0.28, ease: "easeOut" } },
};

const labelShift = {
  rest: { x: 0 },
  hover: { x: 3, transition: { duration: 0.2 } },
};
/**
 * @param {{ label?: string, onClick?: () => void }} props
 *   label  – override the button text (optional)
 *   onClick – callback; defaults to redirecting to backend Google OAuth route
 */

const label = "CONTINUE VIA G_PROTOCOL";
const GoogleAuthButton = () => {

  const handleClick = () => {
    // Point this to your backend's Google OAuth initiation route

    window.location.href = "https://baddiethrift.onrender.com/api/auth/google";
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="w-full relative overflow-hidden flex items-center justify-between gap-4 px-6 py-4 border border-[#1b1b1b]/15 bg-white hover:border-[#1b1b1b]/40 transition-colors cursor-pointer group"
    >
      {/* Neon-lime sweep (bottom→top) */}
      <motion.div
        className="absolute inset-0 bg-[#ccff00]/10"
        variants={bgSlide}
        aria-hidden="true"
      />

      {/* Left: G logo inside a dark box */}
      <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-[#1b1b1b] shrink-0">
        <GoogleG />
      </span>

      {/* Centre: label */}
      <motion.span
        className="relative z-10 flex-1 text-left text-[9px] font-black uppercase tracking-[0.28em] text-[#1b1b1b]"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        variants={labelShift}
      >
        {label}
      </motion.span>

      {/* Right: live signal dot */}
      <span className="relative z-10 flex items-center gap-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] animate-pulse" />
        <span
          className="text-[7px] font-black tracking-[0.2em] text-[#5e5e5e] uppercase hidden sm:block"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          OAUTH2
        </span>
      </span>
    </motion.button>
  );
};

export default GoogleAuthButton;
