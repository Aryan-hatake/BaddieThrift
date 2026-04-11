import React from 'react';
import Navbar from './components/Navbar';
import LoginHeroSection from './components/LoginHeroSection';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

const Login = () => {
  return (
    <>
      {/* ── Grain Texture Overlay (fixed, pointer-events:none, z-99) ── */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Sticky Navbar ── */}
      <Navbar />

      {/* ── Main Content ── */}
      <main className="min-h-screen pt-20 relative flex flex-col items-center">

        {/* ASPHALT Watermark — fixed behind everything, 3% opacity */}
        <div
          className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center"
          style={{ opacity: 0.03 }}
          aria-hidden="true"
        >
          <span
            className="text-[40vw] font-black tracking-tighter uppercase select-none leading-none text-[#1b1b1b]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            VAULT
          </span>
        </div>

        {/* ── 12-Column Asymmetrical Grid ── */}
        <div className="w-full max-w-[1600px] px-6 lg:px-12 py-12 relative z-10">
          <div className="grid grid-cols-12 gap-6 items-start">
            <LoginHeroSection />
            <LoginForm />
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </>
  );
};

export default Login;