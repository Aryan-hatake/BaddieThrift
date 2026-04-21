import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CatalogNavbar = ({ cartCount: cartCountProp }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const cartItems = useSelector((state) => state.cart?.cartItems ?? []);
    const user = useSelector((state) => state.auth?.user);

    // Prop overrides Redux count (for pages that track their own state)
    const bagCount =
        cartCountProp !== undefined
            ? cartCountProp
            : cartItems.reduce((acc, item) => acc + (item.quantity ?? 1), 0);

    const handleBagClick = () => {
        if (user?._id) {
            navigate(`/cart/${user._id}`);
        } else {
            navigate("/login");
        }
    };

    return (
        <header className="flex justify-between items-center px-6 py-4 w-full bg-[#f9f9f9] border-b-2 border-black sticky top-0 z-[100]">
            {/* Left */}
            <div className="flex items-center gap-4">
                <button
                    id="catalog-menu-btn"
                    onClick={() => setMenuOpen((p) => !p)}
                    className="hover:bg-[#ccff00] hover:text-black transition-colors p-1 flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-[#1b1b1b]">
                        {menuOpen ? "close" : "menu"}
                    </span>
                </button>
                <button
                    id="catalog-logo-btn"
                    onClick={() => navigate("/")}
                    className="text-2xl font-black tracking-tighter text-[#1b1b1b] font-['Space_Grotesk'] uppercase hover:text-[#506600] transition-colors"
                >
                    BADDIE THRIFT
                </button>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-8 text-[#1b1b1b] font-['Space_Grotesk'] text-sm font-bold tracking-widest">
                <button
                    onClick={() => navigate("/catalog")}
                    className="text-[#506600] transition-colors uppercase"
                >
                    SHOP
                </button>
                <button className="hover:text-[#506600] transition-colors uppercase">
                    EDITORIAL
                </button>
                <button className="hover:text-[#506600] transition-colors uppercase">
                    ARCHIVE
                </button>
                <button
                    onClick={() => navigate("/login")}
                    className="hover:text-[#506600] transition-colors uppercase"
                >
                    LOGIN
                </button>
            </nav>

            {/* Right — Bag icon */}
            <div className="flex items-center gap-2">
                <button
                    id="catalog-bag-btn"
                    onClick={handleBagClick}
                    className="relative hover:bg-[#ccff00] hover:text-black transition-colors p-1 flex items-center justify-center"
                    aria-label={`View bag · ${bagCount} items`}
                >
                    <span className="material-symbols-outlined text-[#1b1b1b]">
                        shopping_bag
                    </span>
                    {bagCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-4 h-4 flex items-center justify-center font-['Space_Grotesk']">
                            {bagCount > 99 ? "99+" : bagCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#f9f9f9] border-b-2 border-black z-50 flex flex-col md:hidden">
                    {["SHOP", "EDITORIAL", "ARCHIVE"].map((item) => (
                        <button
                            key={item}
                            className="px-6 py-4 text-left font-['Space_Grotesk'] font-black text-sm uppercase tracking-widest hover:bg-[#ccff00] transition-colors border-b border-black/10"
                            onClick={() => {
                                setMenuOpen(false);
                                if (item === "SHOP") navigate("/catalog");
                            }}
                        >
                            {item}
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            navigate("/login");
                        }}
                        className="px-6 py-4 text-left font-['Space_Grotesk'] font-black text-sm uppercase tracking-widest hover:bg-[#ccff00] transition-colors border-b border-black/10"
                    >
                        LOGIN
                    </button>
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            handleBagClick();
                        }}
                        className="px-6 py-4 text-left font-['Space_Grotesk'] font-black text-sm uppercase tracking-widest hover:bg-[#ccff00] transition-colors flex items-center gap-3"
                    >
                        <span className="material-symbols-outlined text-base">shopping_bag</span>
                        BAG
                        {bagCount > 0 && (
                            <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.5 font-['Space_Grotesk']">
                                {bagCount}
                            </span>
                        )}
                    </button>
                </div>
            )}
        </header>
    );
};

export default CatalogNavbar;
