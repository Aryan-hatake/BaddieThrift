import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1b1b1b] text-white pt-24 pb-12 px-8 md:px-12 relative z-[70]">
      <div className="max-w-[1600px] mx-auto">

        {/* ── Top Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-20">

          {/* Brand Statement */}
          <div className="col-span-1 sm:col-span-2">
            <h4
              className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ASPHALT THEORY
            </h4>
            <p
              className="max-w-xs text-xs text-[#c6c6c6] leading-loose uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              AN INDEPENDENT DESIGN COLLECTIVE ARCHIVING THE EVOLUTION OF URBAN
              ARMOR.
            </p>
          </div>

          {/* Directories */}
          <div>
            <h5
              className="text-[10px] font-black tracking-[0.4em] uppercase text-[#ccff00] mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              DIRECTORIES
            </h5>
            <ul className="space-y-4">
              {['Archive Access', 'System Catalog', 'Drop Schedule'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-xs uppercase tracking-widest text-white/70 hover:text-[#ccff00] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Protocols */}
          <div>
            <h5
              className="text-[10px] font-black tracking-[0.4em] uppercase text-[#ccff00] mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              PROTOCOLS
            </h5>
            <ul className="space-y-4">
              {['Shipping', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-xs uppercase tracking-widest text-white/70 hover:text-[#ccff00] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-t border-white/10 pt-8">
          <div className="flex gap-8">
            {['INSTAGRAM', 'TWITTER/X', 'DISCORD'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[10px] font-black tracking-[0.3em] uppercase text-white/70 hover:text-[#ccff00] transition-colors"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {social}
              </a>
            ))}
          </div>
          <div
            className="text-[9px] font-black tracking-[0.4em] text-white/30"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ©2024. ASPHALT THEORY. ALL SYSTEMS RESERVED. v1.0.42
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
