import React,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useSelector } from 'react-redux';

const SellerNavbar = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const {user} = useSelector(s=>s.auth)
  const {items:archiveItems} = useSelector(s=>s.archive)
  const archiveCount = archiveItems?.length;

  return (
    <>
      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 bg-white flex justify-between items-center w-full px-6 py-4 border-b-2 border-black">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 border-2 border-black hover:bg-black hover:text-white transition-colors group"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-lg leading-none">arrow_back</span>
          </button>
          <span
            className="font-black tracking-tighter text-xl uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            PRODUCT_ENTRY
          </span>
        </div>

        {/* Right: Desktop nav links + overflow */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <Link
              to="/seller"
              className="text-black text-sm font-bold tracking-widest uppercase hover:text-[#506600] transition-colors"
            >
              INVENTORY
            </Link>
            <Link
              to="/seller/create-product"
              className=" text-black text-sm font-bold tracking-widest hover:text-[#506600] transition-colors uppercase px-2"
            >
              ADD PRODUCT
            </Link>
            <Link
              to="/"
              className="text-black text-sm font-bold tracking-widest uppercase hover:text-[#506600] transition-colors"
            >
              CATALOG
            </Link>
            <Link
              to="/auth/login"
              onClick={handleLogout}
              className="text-black text-sm font-bold tracking-widest uppercase hover:text-[#506600] transition-colors"
            >
              LOGOUT
            </Link>
          </div>
        </div>
         <button
                    id="catalog-menu-btn"
                    onClick={() => setMenuOpen((p) => !p)}
                    className="hover:bg-[#ccff00] md:hidden hover:text-black transition-colors p-1 flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-[#1b1b1b]">
                        {menuOpen ? "close" : "menu"}
                    </span>
                </button>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#f9f9f9] border-b-2 border-black z-50 flex flex-col md:hidden">
            {["CATALOG", "ARCHIVE","CREATE PRODUCT", user?.role === "seller" && "INVENTORY", user?._id ? "LOGOUT" : "LOGIN"].filter(Boolean).map((item) => (
              <Link to={item === "CATALOG" ? "/" : item === "ARCHIVE" ? "/archive" : item === "INVENTORY" ? "/seller" : item === "CREATE PRODUCT" ? "/seller/create-product" : "/auth/login"}>

                <button
                  key={item}
                  className="px-6 py-4 text-left font-['Space_Grotesk'] font-black text-sm uppercase tracking-widest hover:bg-[#ccff00] transition-colors border-b border-black/10"
                  onClick={() => {
                    setMenuOpen(false);
                    if (item === "LOGOUT") {
                      handleLogout();
                    }
                  }}
                >
                  {item}
                  {item === "ARCHIVE" && archiveCount > 0 && (
                    <span className="ml-2 bg-[#ccff00] text-black text-[8px] font-black px-1.5 py-0.5 border border-black">
                      {archiveCount}
                    </span>
                  )}
                </button>
              </Link>
            ))}


          </div>
        )}
      </nav>
    </>
  );
};

export default SellerNavbar;
