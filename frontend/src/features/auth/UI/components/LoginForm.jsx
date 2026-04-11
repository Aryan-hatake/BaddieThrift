import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, AlertTriangle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "./GoogleAuthButton";

const LoginForm = () => {
  const [identifierType, setIdentifierType] = useState("email"); // "email" | "contact"
  const formRef = useRef({});

  const { handleLogin } = useAuth();
  const { loading, error, user } = useSelector((state) => state.auth);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = formRef.current;
    await handleLogin(identifier.value.trim(), password.value);
    navigate("/")
  };

  if (user) {
    navigate("/")

  }


  useEffect(() => {
    console.log(user)
  }, [user])

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
    "focus:border-[#ccff00] focus:ring-0 px-4 py-4 text-sm " +
    "tracking-widest transition-all outline-none hover:bg-[#e8e8e8]";

  return (
    <div className="col-span-12 lg:col-span-5 lg:-ml-24 lg:mt-32 relative z-30">
      {/* ─── Form Card ─── */}
      <div className="bg-white p-8 md:p-12 lg:p-16 technical-border shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h3
              className="text-3xl font-black tracking-tighter uppercase mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ACCESS VAULT
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-[#ccff00]" />
              <span
                className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#5e5e5e]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                VERIFYING CREDENTIALS...
              </span>
            </div>
          </div>
          <span
            className="text-4xl font-black text-[#1b1b1b]/5 select-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            02
          </span>
        </div>

        {/* ── Toggle: Email / Contact ── */}
        <div className="flex mb-8 border border-[#1b1b1b]/10">
          <button
            type="button"
            onClick={() => setIdentifierType("email")}
            className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer ${identifierType === "email"
                ? "bg-[#1b1b1b] text-[#ccff00]"
                : "bg-transparent text-[#5e5e5e] hover:bg-[#f3f3f3]"
              }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            EMAIL
          </button>
          <button
            type="button"
            onClick={() => setIdentifierType("contact")}
            className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer ${identifierType === "contact"
                ? "bg-[#1b1b1b] text-[#ccff00]"
                : "bg-transparent text-[#5e5e5e] hover:bg-[#f3f3f3]"
              }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            CONTACT
          </button>
        </div>

        {/* Form */}
        <form className="space-y-10" onSubmit={handleSubmit}>
          <div className="space-y-8">

            {/* DIGITAL_COORD / CONTACT_NO */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label
                  className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {identifierType === "email" ? "DIGITAL_COORD" : "CONTACT_NO"}
                </label>
                <span className="text-[8px] text-[#ccff00] bg-[#1b1b1b] px-1 hidden group-focus-within:block">
                  {identifierType === "email" ? "SECURE_ONLY" : "REQUIRED"}
                </span>
              </div>
              <input
                key={identifierType}
                type={identifierType === "email" ? "email" : "tel"}
                placeholder={
                  identifierType === "email"
                    ? "ACCESS@ASPHALT.THEORY"
                    : "+91-99999 99999"
                }
                required
                ref={(e) => (formRef.current.identifier = e)}
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

          {/* Forgot Password */}
          <div className="flex justify-end -mt-4">
            <a
              href="#"
              className="text-[8px] font-black uppercase tracking-[0.25em] text-[#5e5e5e] hover:text-[#ccff00] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              RECOVER_KEY?
            </a>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 p-3 bg-[#ba1a1a]/5 border border-[#ba1a1a]/30">
              <AlertTriangle size={14} className="text-[#ba1a1a] shrink-0" />
              <span
                className="text-[9px] font-bold uppercase tracking-widest text-[#ba1a1a]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {typeof error === "string" ? error : "ACCESS_DENIED // INVALID_CREDENTIALS"}
              </span>
            </div>
          )}

          {/* ── AUTHENTICATE Button ── */}
          <motion.button
            type="submit"
            disabled={loading}
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="w-full bg-[#1b1b1b] text-[#b5c572] py-6 font-black text-lg uppercase tracking-[0.2em] flex items-center justify-between px-8 relative overflow-hidden cursor-pointer disabled:opacity-60"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {/* Neon lime background sweep */}
            <motion.div className="absolute inset-0 bg-[#ccff00]" variants={bgSwipe} />

            {/* Glitch text */}
            <motion.span className="relative z-10" variants={glitchText}>
              {loading ? "AUTHENTICATING..." : "BREACH_VAULT"}
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
        <div className="mt-4">
          <GoogleAuthButton label="CONTINUE VIA G_PROTOCOL" />
        </div>

        {/* Register Link */}
        <div className="mt-12 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-grow h-px bg-[#1b1b1b]/10" />
            <span
              className="text-[9px] font-black text-[#5e5e5e] tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              NEW_ENTITY?
            </span>
            <div className="flex-grow h-px bg-[#1b1b1b]/10" />
          </div>
          <a
            href="/register"
            className="text-center text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#506600] transition-colors py-2 border border-transparent hover:border-[#ccff00]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            INITIALIZE IDENTITY_V1.0
          </a>
        </div>
      </div>

      {/* Status Dots */}
      <div className="mt-8 flex justify-between items-center px-4">
        <div className="flex gap-4">
          <div className="w-2 h-2 bg-[#ccff00]" />
          <div className="w-2 h-2 bg-[#1b1b1b]/20" />
          <div className="w-2 h-2 bg-[#1b1b1b]/20" />
        </div>
        <span className="text-[8px] font-mono text-[#5e5e5e]">
          SYSTEM_STATUS: AWAITING_AUTH
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
