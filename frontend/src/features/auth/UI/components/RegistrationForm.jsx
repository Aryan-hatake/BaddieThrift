import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "./GoogleAuthButton";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const [agreed, setAgreed] = useState(false);

  const formRef = useRef({});

  const user = useSelector((state) => state.auth.user)

  const { handleRegister ,handleLoginForGoogle } = useAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, contactNo } = formRef.current;

    await handleRegister(fullName.value, email.value, password.value, contactNo.value);
    user.role === "seller" ? navigate("/seller") : navigate("/")

  };

  if (user) {
    user.role === "seller" ? navigate("/seller") : navigate("/")

  }



  /* ── Framer Motion variants ── */
  const bgSwipe = {
    rest: { y: "100%" },
    hover: { y: "0%", transition: { duration: 0.3, ease: "easeOut" } },
  };

  const glitchText = {
    rest: { x: 0 },
    hover: {
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.25, repeat: Infinity, ease: "linear" },
    },
  };

  const zapSlide = {
    rest: { x: 0 },
    hover: { x: 4, transition: { duration: 0.2 } },
  };

  /* ── Shared input class ── */
  const inputCls =
    "w-full bg-[#f3f3f3] border-0 border-b-2 border-[#1b1b1b]/10 " +
    "focus:border-[#ccff00] focus:ring-0 px-4 py-4 text-sm  " +
    "tracking-widest transition-all outline-none hover:bg-[#e8e8e8]";

  return (
    <div className="col-span-12 lg:col-span-5 lg:-ml-24 lg:mt-32 relative z-30">
      {/* ─── Form Card with technical-border corner brackets ─── */}
      <div className="bg-white p-8 md:p-12 lg:p-16 technical-border shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h3
              className="text-3xl font-black tracking-tighter uppercase mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              INITIALIZE IDENTITY
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-[#ccff00]" />
              <span
                className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#5e5e5e]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                ESTABLISHING CONNECTION...
              </span>
            </div>
          </div>
          <span
            className="text-4xl font-black text-[#1b1b1b]/5 select-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            01
          </span>
        </div>

        {/* Form */}
        <form className="space-y-10" onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* IDENTITY_ID */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label
                  className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  IDENTITY_ID
                </label>
                <span className="text-[8px] text-[#ccff00] bg-[#1b1b1b] px-1 hidden group-focus-within:block">
                  REQUIRED
                </span>
              </div>
              <input
                type="text"
                placeholder="GHOST_USER_NODE"
                required
                ref={(e) => (formRef.current.fullName = e)}
                className={inputCls}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
            </div>

            {/* DIGITAL_COORD */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label
                  className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  DIGITAL_COORD
                </label>
                <span className="text-[8px] text-[#ccff00] bg-[#1b1b1b] px-1 hidden group-focus-within:block">
                  SECURE_ONLY
                </span>
              </div>
              <input
                type="email"
                placeholder="ACCESS@ASPHALT.THEORY"
                required
                ref={(e) => (formRef.current.email = e)}
                className={inputCls}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
            </div>
            {/* CONTACT */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label
                  className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  CONTACT_NO
                </label>
                <span className="text-[8px] text-[#ccff00] bg-[#1b1b1b] px-1 hidden group-focus-within:block">
                  REQUIRED
                </span>
              </div>
              <input
                type="number"
                placeholder="+91-99999 99999"
                required
                ref={(e) => (formRef.current.contactNo = e)}
                className={inputCls}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
            </div>

            {/* ENCRYPTION_KEY */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label
                  className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  ENCRYPTION_KEY
                </label>
                <span className="text-[8px] text-[#ccff00] bg-[#1b1b1b] px-1 hidden group-focus-within:block">
                  SHA_256
                </span>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                required
                ref={(e) => (formRef.current.password = e)}
                className={inputCls}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
            </div>
          </div>

          {/* Protocol Agreement */}
          <div className="flex items-start gap-4 p-4 bg-[#1b1b1b]/[0.02] border border-[#1b1b1b]/5">
            <div className="pt-0.5 shrink-0">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 border-2 border-[#1b1b1b] text-[#1b1b1b] focus:ring-0 cursor-pointer accent-[#ccff00]"
              />
            </div>
            <label
              htmlFor="terms"
              className="text-[10px] font-medium text-[#5e5e5e] leading-tight uppercase tracking-tight cursor-pointer"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              I AGREE TO THE PROTOCOL. DATA WILL BE HANDLED WITHIN THE ENCRYPTED
              ASPHALT FRAMEWORK.
            </label>
          </div>

          {/* ── AUTHENTICATE Button (Framer Motion glitch) ── */}
          <motion.button
            type="submit"
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="w-full bg-[#1b1b1b] text-[#b5c572] py-6 font-black text-lg uppercase tracking-[0.2em] flex items-center justify-between px-8 relative overflow-hidden cursor-pointer"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {/* Neon lime background sweep */}
            <motion.div
              className="absolute inset-0 bg-[#ccff00]"
              variants={bgSwipe}
            />

            {/* Glitch text */}
            <motion.span
              className="relative z-10 group-hover:text-[#1b1b1b]"
              variants={glitchText}
            >
              AUTHENTICATE ACCESS
            </motion.span>

            {/* Zap icon slides right */}
            <motion.span className="relative z-10" variants={zapSlide}>
              <Zap size={20} />
            </motion.span>
          </motion.button>
        </form>

        {/* ── OR Divider ── */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-grow h-px bg-[#1b1b1b]/10" />
          <span
            className="text-[8px] font-black tracking-[0.3em] text-[#5e5e5e]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            OR
          </span>
          <div className="flex-grow h-px bg-[#1b1b1b]/10" />
        </div>

        {/* ── Google OAuth ── */}
        <div onClick={handleLoginForGoogle} className="mt-4">
          <GoogleAuthButton label="CONTINUE VIA G_PROTOCOL" />
        </div>

        {/* Login Link */}
        <div className="mt-12 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-grow h-px bg-[#1b1b1b]/10" />
            <span
              className="text-[9px] font-black text-[#5e5e5e] tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              EXISTING_ENTITY?
            </span>
            <div className="flex-grow h-px bg-[#1b1b1b]/10" />
          </div>
          <Link
            to="/auth/login"
            className="text-center text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#506600] transition-colors py-2 border border-transparent hover:border-[#ccff00]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ACCESS VAULT_V1.0
          </Link>
        </div>
      </div>

      {/* Status Dots */}
      <div className="mt-8 flex justify-between items-center px-4">
        <div className="flex gap-4">
          <div className="w-2 h-2 bg-[#1b1b1b]" />
          <div className="w-2 h-2 bg-[#1b1b1b]/20" />
          <div className="w-2 h-2 bg-[#1b1b1b]/20" />
        </div>
        <span className="text-[8px] font-mono text-[#5e5e5e]">
          SYSTEM_STATUS: NOMINAL
        </span>
      </div>
    </div>
  );
};

export default RegistrationForm;
