import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {useArchieve} from "../../hooks/useArchieve";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥" };
const sym = (c) => CURRENCY_SYMBOLS[c] ?? c;

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const STATUS_LABEL = { VAULTED: "error", ARCHIVED: "primary", active: "on-surface-variant" };

/* ─────────────────────────────────────────
   Filter tabs config
───────────────────────────────────────── */
const TABS = ["ALL_ITEMS", "AVAILABLE", "SOLD OUT", "VAULTED"];

/* ─────────────────────────────────────────
   Single archive card  (matches the bento
   secondary grid style from the reference)
───────────────────────────────────────── */
const ArchiveCard = ({ item, onRemove, onView }) => {
  const isSoldOut =  (item.variant?.stock ?? 0) === 0;
  const price = item.variant.price?.priceAmount ?? 0;
  const currency = item.variant.price?.priceCurrency ?? "USD";
  const thumb = item.variant.images?.[0] || item.product.images?.[0];

  return (
    <article className="group cursor-pointer hover:bg-[#e8e8e8] transition-colors border-b-2 border-r-2 border-black p-6 flex flex-col">
      {/* Image */}
      <div
        className="aspect-[3/4] mb-6 overflow-hidden bg-[#e2e2e2] border-2 border-black relative"
        onClick={onView}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={item.product.title}
            className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-5xl text-[#5e5e5e]">
              image_not_supported
            </span>
            <span
              className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              NO_IMAGE
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-0 left-0 bg-black text-white px-4 py-2 font-['Space_Grotesk'] text-[10px] font-black uppercase tracking-widest">
          TIMESTAMP: {fmtDate(item.createdAt)}
        </div>
      </div>

      {/* Meta row */}
      <div
        className="font-['Space_Grotesk'] text-[10px] flex justify-between mb-2 font-black uppercase tracking-widest"
        onClick={onView}
      >
        <span>{item.product.sku ?? item.product._id?.slice(-8).toUpperCase()}</span>
        <span
          className={
            isSoldOut
              ? "text-[#ba1a1a]"
              : item.product.status === "active"
              ? "text-[#506600]"
              : "text-[#5e5e5e]"
          }
        >
          {isSoldOut ? "UNAVAILABLE" : "AVAILABLE"}
        </span>
      </div>

      {/* Title + Status */}
      <div className="flex items-start gap-2 mb-2" onClick={onView}>
        <span
          className="w-2 h-2 rounded-full shrink-0 mt-[5px]"
          style={{ background: isSoldOut ? "#ba1a1a" : "#506600" }}
        />
        <h3
          className="font-['Space_Grotesk'] font-bold text-lg uppercase leading-tight tracking-tighter"
        >
          {item.product.title}
        </h3>
      </div>

      {/* Price */}
      <p
        className="font-['Space_Grotesk'] text-sm font-black text-[#506600] mb-3"
        onClick={onView}
      >
        {sym(currency)}
        {Number(price).toFixed(2)}{" "}
        <span className="text-[#5e5e5e] font-bold text-[10px]">{currency}</span>
      </p>

      {/* Description */}
      {item.description && (
        <div
          className="mt-auto pt-4 border-t border-black/10 font-['Inter'] text-[11px] leading-tight text-[#5e5e5e] line-clamp-2"
          onClick={onView}
        >
          {item.description}
        </div>
      )}

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="mt-4 w-full py-2 border-2 border-black/20 text-[10px] font-black uppercase tracking-widest font-['Space_Grotesk'] hover:border-[#ba1a1a] hover:text-[#ba1a1a] transition-colors flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-sm leading-none">delete</span>
        REMOVE
      </button>
    </article>
  );
};

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
const Archive = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {handleRemoveToArchieve} = useArchieve();
  const {items} = useSelector((s) => s.archive);


  const [activeTab, setActiveTab] = useState("ALL_ITEMS");
  const [confirmClear, setConfirmClear] = useState(false);

  /* Filter logic */
  const filtered = items.filter((item,idx) => {

    const isSoldOut =  (item.variant.stock ?? 0) === 0;
    if (activeTab === "ALL_ITEMS") return true;
    if (activeTab === "AVAILABLE") return !isSoldOut;
    if (activeTab === "SOLD OUT") return isSoldOut;
    if (activeTab === "VAULTED") return item.status === "vaulted";
    return true;
  });

  const lastUpdated = items.length ? fmtDate(items[0].archivedAt) : "—";

  return (
    <div className="bg-[#f9f9f9] min-h-screen text-[#1b1b1b]">

      {/* ── Hero Header ── */}
      <header className="p-6 md:p-12 border-b-2 border-black">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p
              className="font-['Space_Grotesk'] text-xs tracking-[0.3em] uppercase mb-2 text-[#5e5e5e]"
            >
              System // Database
            </p>
            <h1
              className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tighter font-['Space_Grotesk'] uppercase"
            >
              THE
              <br />
              ARCHIVE
            </h1>
          </div>
          <div className="max-w-xs text-right">
            <p className="font-['Inter'] text-sm leading-relaxed mb-4 text-[#5e5e5e]">
              A personal compendium of saved pieces from the drop. Every item
              you've marked, preserved for your consideration.
            </p>
            <div
              className="font-['Space_Grotesk'] text-[10px] uppercase border-t border-black pt-2 space-y-0.5"
            >
              <span className="block">Total_Entries: {items.length}</span>
              <span className="block">Last_Update: {lastUpdated}</span>
            </div>

            {/* Clear all */}
            {items.length > 0 && (
              <div className="mt-4">
                {confirmClear ? (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        dispatch(clearArchive());
                        setConfirmClear(false);
                      }}
                      className="px-4 py-2 bg-[#ba1a1a] text-white font-['Space_Grotesk'] text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      CONFIRM
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-4 py-2 border-2 border-black font-['Space_Grotesk'] text-[10px] font-black uppercase tracking-widest hover:bg-[#e8e8e8] transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="px-4 py-2 border-2 border-black/20 font-['Space_Grotesk'] text-[10px] font-black uppercase tracking-widest hover:border-[#ba1a1a] hover:text-[#ba1a1a] transition-colors flex items-center gap-1 ml-auto"
                  >
                    <span className="material-symbols-outlined text-sm leading-none">
                      delete_sweep
                    </span>
                    CLEAR ALL
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Filter Tab Strip ── */}
      <div className="flex overflow-x-auto border-b-2 border-black bg-[#f3f3f3] sticky top-[73px] z-40">
        {TABS.map((tab) => (
          <button
            key={tab}
            id={`archive-tab-${tab.replace(/\s/g, "-")}`}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 border-r-2 border-black font-['Space_Grotesk'] font-bold text-xs tracking-widest uppercase whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-[#ccff00] text-[#1b1b1b]"
                : "hover:bg-[#1b1b1b] hover:text-[#f9f9f9]"
            }`}
          >
            {tab}
            {tab === "ALL_ITEMS" && items.length > 0 && (
              <span className="ml-2 bg-black text-white text-[9px] px-1.5 py-0.5 font-black">
                {items.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Main content ── */}
      <main>
        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 border-b-2 border-black">
            <span className="material-symbols-outlined text-7xl text-[#5e5e5e]">
              history
            </span>
            <div className="text-center">
              <p
                className="font-['Space_Grotesk'] text-sm font-black uppercase tracking-widest text-[#5e5e5e] mb-2"
              >
                {activeTab === "ALL_ITEMS"
                  ? "ARCHIVE_EMPTY"
                  : `NO_${activeTab.replace(/\s/g, "_")}_ITEMS`}
              </p>
              <p className="font-['Inter'] text-xs text-[#5e5e5e] max-w-sm text-center">
                {activeTab === "ALL_ITEMS"
                  ? 'Save items from any product page using the "SAVE TO ARCHIVE" button.'
                  : `No items match the ${activeTab} filter.`}
              </p>
            </div>
            <button
              id="archive-goto-catalog-btn"
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-black text-white font-['Space_Grotesk'] font-black text-xs uppercase tracking-widest hover:bg-[#ccff00] hover:text-black transition-colors border-2 border-black"
            >
              BROWSE CATALOG
            </button>
          </div>
        )}

        {/* Bento feature row — first 2 items large + side */}
        {filtered.length >= 1 && (
          <section className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 border-b-2 border-black">
            {/* Feature item (large) */}
            <div
              className={`md:col-span-4 ${
                filtered.length > 1
                  ? "lg:col-span-8 border-b-2 lg:border-b-0 lg:border-r-2"
                  : "lg:col-span-12"
              } border-black group cursor-pointer relative overflow-hidden`}
              onClick={() => navigate(`/product/${filtered[0].product._id}/${filtered[0].variant._id}`)}
            >
              <div className="aspect-video w-full overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-500">
                {filtered[0].product.images[0] ? (
                  <img
                    src={filtered[0].product.images[0]}
                    alt={filtered[0].product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#e2e2e2] flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-[#5e5e5e]">
                      image_not_supported
                    </span>
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start">
                  <span
                    className={`px-3 py-1 font-['Space_Grotesk'] text-[10px] font-black ${
                      (filtered[0].variant?.stock ?? 0) === 0
                        ? "bg-[#ccff00] text-black"
                        : "bg-[#506600] text-white"
                    }`}
                  >
                    {(filtered[0].variant?.stock ?? 0) === 0
                      ? "SOLD OUT"
                      : "AVAILABLE"}
                  </span>
                  <span className="font-['Space_Grotesk'] text-white text-[10px] font-black">
                    SKU: {filtered[0].product?.sku ?? "—"}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-black text-white uppercase leading-tight tracking-tighter">
                    {filtered[0].product?.title}
                  </h3>
                  <p className="font-['Space_Grotesk'] text-[#ccff00] text-xs mt-2 tracking-widest font-black">
                    ARCHIVED: {fmtDate(filtered[0].createdAt)}
                  </p>
                </div>
              </div>

              {/* Mobile title */}
              <div className="p-6 lg:hidden">
                <h3 className="text-2xl font-['Space_Grotesk'] font-black uppercase">
                  {filtered[0].product?.title}
                </h3>
                <p className="text-xs font-['Space_Grotesk'] text-[#5e5e5e] mt-1">
                  SKU: {filtered[0].product?.sku ?? "—"}
                </p>
              </div>
            </div>

            {/* Side item (2nd entry) */}
            {filtered.length > 1 && (
              <div
                className="md:col-span-2 lg:col-span-4 border-b-2 lg:border-b-0 border-black group cursor-pointer"
                onClick={() => navigate(`/product/${filtered[1].product._id}/${filtered[1].variant._id}`)}
              >
                <div className="aspect-square w-full grayscale contrast-150 overflow-hidden relative">
                  {filtered[1].product.images[0] ? (
                    <img
                      src={filtered[1].product.images[0]}
                      alt={filtered[1].product.title}
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#e2e2e2] flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-[#5e5e5e]">
                        image_not_supported
                      </span>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 bg-black text-white px-4 py-2 font-['Space_Grotesk'] text-[10px] font-black">
                    TIMESTAMP: {fmtDate(filtered[1].createdAt)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        (filtered[1].variant?.stock ?? 0) === 0
                          ? "bg-[#ba1a1a]"
                          : "bg-[#506600]"
                      }`}
                    />
                    <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-tighter font-black">
                      {(filtered[1].variant?.stock ?? 0) === 0
                        ? "STATUS: UNAVAILABLE"
                        : "STATUS: AVAILABLE"}
                    </span>
                  </div>
                  <h3 className="text-xl font-['Space_Grotesk'] font-bold uppercase mb-2">
                    {filtered[1].product?.title}
                  </h3>
                  <p className="text-[10px] font-['Space_Grotesk'] text-[#5e5e5e] font-black">
                    SKU: {filtered[1].product?.sku ?? "—"}
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Secondary grid (remaining items) ── */}
        {filtered.length > 2 && (
          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 border-b-2 border-black">
            {filtered.slice(2).map((item) => (
              <ArchiveCard
                key={item.product._id}
                item={item}
                onView={() => navigate(`/product/${item.product._id}/${item.variant._id}`)}
                onRemove={() => handleRemoveToArchieve(item.product._id,item.variant._id)}
              />
            ))}
          </section>
        )}

        {/* Remove buttons for the featured bento items */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-b-2 border-black bg-[#f3f3f3] flex flex-wrap gap-3">
            <span className="font-['Space_Grotesk'] text-[10px] font-black uppercase tracking-widest text-[#5e5e5e] self-center">
              FEATURED ENTRIES:
            </span>
            {filtered.slice(0, 2).map((item) => (
              <button
                key={item.product._id}
                onClick={() => handleRemoveToArchieve(item.product._id,item.variant._id)}
                className="flex items-center gap-1 px-3 py-1.5 border-2 border-black/20 font-['Space_Grotesk'] text-[10px] font-black uppercase tracking-widest hover:border-[#ba1a1a] hover:text-[#ba1a1a] transition-colors"
              >
                <span className="material-symbols-outlined text-sm leading-none">close</span>
                {item.product?.title?.slice(0, 20)}
                {item.title?.length > 20 ? "..." : ""}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ── Archival Policy Footer ── */}
      <section className="p-6 md:p-12 bg-[#1b1b1b] text-[#f9f9f9] flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xl">
          <h2 className="text-3xl font-['Space_Grotesk'] font-black uppercase mb-6 text-[#ccff00]">
            ARCHIVAL_POLICY_V1.0
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-['Space_Grotesk'] text-xs uppercase tracking-widest leading-loose">
            <div>
              <p className="mb-4 text-[#e2e2e2]">
                01. All archived items are stored locally in your browser session.
              </p>
              <p className="mb-4 text-[#e2e2e2]">
                02. Sold-out listings are preserved for reference and potential restock.
              </p>
            </div>
            <div>
              <p className="mb-4 text-[#e2e2e2]">
                03. Click any item to return to its product detail page.
              </p>
              <p className="mb-4 text-[#e2e2e2]">
                04. Remove individual entries or clear the full archive at any time.
              </p>
            </div>
          </div>
        </div>
        <div className="md:text-right flex flex-col justify-end">
          <div className="text-[80px] md:text-[120px] font-['Space_Grotesk'] font-black leading-none opacity-10 select-none uppercase">
            BADDIE
          </div>
          <p className="font-['Space_Grotesk'] text-[10px] uppercase mt-4 text-[#5e5e5e]">
            © 2025 BADDIE THRIFT ARCHIVE. ALL ENTRIES PRESERVED.
          </p>
        </div>
      </section>

      {/* Mobile spacer */}
    
    </div>
  );
};

export default Archive;
