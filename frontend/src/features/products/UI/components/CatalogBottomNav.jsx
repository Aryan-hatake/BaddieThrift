import React from "react";

const CatalogBottomNav = ({ activePath = "/catalog" }) => {
  const tabs = [
    { icon: "home", label: "HOME", path: "/" },
    { icon: "storefront", label: "SHOP", path: "/catalog" },
    { icon: "search", label: "SEARCH", path: "#" },
    { icon: "person", label: "PROFILE", path: "/login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-[#f9f9f9]/80 backdrop-blur-xl border-t-2 border-black md:hidden">
      {tabs.map(({ icon, label, path }) => {
        const isActive = activePath === path;
        return (
          <a
            key={label}
            href={path}
            id={`bottom-nav-${label.toLowerCase()}`}
            className={`flex flex-col items-center justify-center p-2 transition-all flex-1 ${
              isActive
                ? "bg-[#ccff00] text-black"
                : "text-[#5e5e5e] hover:bg-[#f3f3f3]"
            }`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="font-['Space_Grotesk'] text-[10px] font-bold tracking-widest mt-1">
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
};

export default CatalogBottomNav;
