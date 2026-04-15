import React from 'react';

const navItems = [
  { icon: 'grid_view',    label: 'DASHBOARD', href: '#', active: false },
  { icon: 'inventory_2',  label: 'INVENTORY',  href: '#', active: true,  filled: true },
  { icon: 'payments',     label: 'SALES',      href: '#', active: false },
  { icon: 'settings',     label: 'SETTINGS',   href: '#', active: false },
];

const SellerBottomNav = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-stretch bg-white border-t-2 border-black md:hidden"
      aria-label="Seller bottom navigation"
    >
      {navItems.map(({ icon, label, href, active, filled }) => (
        <a
          key={label}
          href={href}
          className={`flex flex-col items-center justify-center p-3 flex-1 transition-colors ${
            active
              ? 'bg-[#ccff00] text-black'
              : 'text-black hover:bg-[#f3f3f3]'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={
              filled
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            {icon}
          </span>
          <span
            className="text-[10px] font-bold uppercase mt-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {label}
          </span>
        </a>
      ))}
    </nav>
  );
};

export default SellerBottomNav;
