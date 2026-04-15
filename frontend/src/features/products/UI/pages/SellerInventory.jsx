import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../../hooks/useProduct";
import ProductCard from "../components/ProductCard";
import SellerBottomNav from "../components/SellerBottomNav";

/* ──────────────────────────────────────────
   Filter chip config
────────────────────────────────────────── */
const FILTERS = [
  { key: "all", label: "All Products" },
  { key: "active", label: "Active" },
  { key: "low_stock", label: "Low Stock" },
  { key: "draft", label: "Draft" },
];

/* ──────────────────────────────────────────
   Desktop Sidebar
────────────────────────────────────────── */
const DesktopSidebar = ({ onNavigate }) => {
  const navLinks = [
    { icon: "dashboard", label: "DASHBOARD", path: "/" },
    { icon: "inventory_2", label: "STOCK_LIST", path: "/seller/inventory", active: true },
    { icon: "monitoring", label: "ANALYTICS", path: "#" },
    { icon: "local_shipping", label: "SHIPMENTS", path: "#" },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 border-r-2 border-black bg-[#f9f9f9] flex-col pt-20 z-40">
      <div className="px-8 py-6 border-b-2 border-black/10 mb-4">
        <span
          className="font-black text-black text-xl uppercase tracking-widest"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          ADMIN_v1.0
        </span>
      </div>

      <nav className="flex-grow flex flex-col">
        {navLinks.map(({ icon, label, path, active }) => (
          <button
            key={label}
            type="button"
            onClick={() => onNavigate(path)}
            className={`flex items-center gap-4 px-8 py-4 text-left transition-colors ${active
              ? "bg-[#ccff00] text-black font-black"
              : "text-[#5e5e5e] hover:bg-[#e2e2e2]"
              }`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span
              className="font-bold text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {label}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => onNavigate("#")}
          className="mt-auto flex items-center gap-4 px-8 py-8 text-[#5e5e5e] hover:bg-[#e2e2e2] transition-colors"
        >
          <span className="material-symbols-outlined">settings</span>
          <span
            className="font-bold text-sm"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SETTINGS
          </span>
        </button>
      </nav>
    </aside>
  );
};

/* ──────────────────────────────────────────
   Main Page
────────────────────────────────────────── */
const SellerInventory = () => {
  const navigate = useNavigate();
  const { handleSellerProducts } = useProduct();

  const { sellerProducts, loading } = useSelector((s) => s.product);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  /* Fetch on mount */
  useEffect(() => {
    (async () => {
      await handleSellerProducts();
    })()
  }, []);

  /* Filtered + searched list */
  const filtered = (sellerProducts ?? []).filter((p) => {
   
    const matchesFilter = activeFilter === "all" || p.status === activeFilter;

    const q = search.toLowerCase();
    
    const matchesSearch =  !q || p.title?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  /* Stats for the summary bar */
  const totalActive = (sellerProducts ?? []).filter((p) => p.status === "active").length;
  const totalLowStock = (sellerProducts ?? []).filter((p) => p.status === "low_stock").length;
  const totalDraft = (sellerProducts ?? []).filter((p) => p.status === "draft").length;

  return (
    <div className="bg-[#f9f9f9] min-h-screen text-[#1b1b1b] pb-24 lg:pb-0">

      {/* ── Desktop Sidebar ── */}
      <DesktopSidebar onNavigate={(path) => path !== "#" && navigate(path)} />

      {/* ── Top Header ── */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-50 border-b-2 border-black bg-[#f9f9f9] h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined lg:hidden">menu</span>
          <h1
            className="text-xl font-black tracking-widest uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            INVENTORY_CORE
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/seller/create-product")}
          className="font-black uppercase tracking-tighter text-[#506600] text-sm hover:text-[#ccff00] hover:bg-[#1b1b1b] px-3 py-1 transition-colors"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          ADD_PRODUCT
        </button>
      </header>

      {/* ── Main canvas ── */}
      <main className="pt-20 px-4 max-w-2xl mx-auto lg:ml-72 lg:mx-0 lg:max-w-3xl">

        {/* Hero + status */}
        <section className="mb-8 mt-4">
          <div className="flex justify-between items-end mb-2">
            <h2
              className="text-4xl font-black leading-none uppercase tracking-tighter"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Inventory
            </h2>
            <span
              className="text-[10px] font-bold text-[#506600] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              SYSTEM_STATUS: NOMINAL
            </span>
          </div>
          <div className="h-1 w-full bg-[#1b1b1b]" />

          {/* Quick stats strip */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: "ACTIVE", value: totalActive, color: "#506600" },
              { label: "LOW STOCK", value: totalLowStock, color: "#ba1a1a" },
              { label: "DRAFT", value: totalDraft, color: "#5e5e5e" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="border-2 border-black p-3 bg-white"
              >
                <p
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {label}
                </p>
                <p
                  className="text-2xl font-black mt-0.5"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color }}
                >
                  {String(value).padStart(2, "0")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Actions + Search ── */}
        <section className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigate("/seller/create-product")}
              className="bg-[#ccff00] text-black font-black py-4 border-2 border-black flex items-center justify-center gap-2 hover:bg-[#506600] hover:text-white transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="material-symbols-outlined">add_circle</span>
              ADD NEW
            </button>
            <button
              type="button"
              className="bg-transparent text-[#1b1b1b] font-black py-4 border-2 border-black flex items-center justify-center gap-2 hover:bg-[#e2e2e2] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="material-symbols-outlined">export_notes</span>
              EXPORT CSV
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full bg-[#f3f3f3] border-b-2 border-[#1b1b1b] focus:border-[#506600] focus:shadow-[0_4px_0_0_#ccff00] px-4 py-4 text-sm italic placeholder:text-[#5e5e5e] outline-none transition-all"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#1b1b1b]">
              search
            </span>
          </div>

          {/* Filter chips */}
          <div className="flex overflow-x-auto gap-2 py-1" style={{ scrollbarWidth: "none" }}>
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={`whitespace-nowrap px-4 py-1 font-black text-xs uppercase transition-colors ${activeFilter === key
                  ? "bg-[#1b1b1b] text-white"
                  : "bg-[#e2e2e2] border-2 border-black text-[#1b1b1b] hover:bg-[#d0d0d0]"
                  }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Product List ── */}
        <section className="space-y-6">
          {loading && (
            <div className="border-2 border-black bg-white p-8 flex items-center justify-center gap-3">
              <span
                className="w-3 h-3 bg-[#ccff00] block animate-pulse"
              />
              <span
                className="text-xs font-black uppercase tracking-widest text-[#5e5e5e]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                LOADING_INVENTORY...
              </span>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="border-2 border-dashed border-black/30 bg-white p-12 flex flex-col items-center justify-center gap-3 text-center">
              <span className="material-symbols-outlined text-4xl text-[#5e5e5e]">
                inventory_2
              </span>
              <p
                className="text-sm font-black uppercase tracking-widest text-[#5e5e5e]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {search || activeFilter !== "all"
                  ? "NO_RESULTS_FOUND"
                  : "INVENTORY_EMPTY"}
              </p>
              <p
                className="text-[10px] text-[#5e5e5e] uppercase tracking-wider"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {search || activeFilter !== "all"
                  ? "Try clearing your filters"
                  : "Add your first product to get started"}
              </p>
              {!search && activeFilter === "all" && (
                <button
                  type="button"
                  onClick={() => navigate("/seller/create-product")}
                  className="mt-2 bg-[#ccff00] text-black font-black text-xs uppercase px-6 py-3 border-2 border-black hover:bg-[#506600] hover:text-white transition-colors"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  + Add Product
                </button>
              )}
            </div>
          )}

          {!loading &&
            filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAction={(id, status) => {
                  if (status === "draft") navigate(`/seller/edit-product/${id}`);
                  else navigate(`/seller/manage-product/${id}`);
                }}
              />
            ))}
        </section>

        {/* ── Footer metadata ── */}
        {!loading && sellerProducts?.length > 0 && (
          <div className="mt-8 pt-4 border-t-2 border-black/10 flex justify-between items-center pb-4">
            <p
              className="text-[9px] font-bold text-[#5e5e5e] uppercase tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Showing {filtered.length} of {sellerProducts.length} products
            </p>
            <p
              className="text-[9px] font-bold text-[#5e5e5e] uppercase tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Protocol: BADDIE_V1_CORE
            </p>
          </div>
        )}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <SellerBottomNav />
    </div>
  );
};

export default SellerInventory;
