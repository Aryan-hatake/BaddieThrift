import React from "react";
import { useNavigate } from "react-router-dom";

/* ──────────────────────────────────────────
   Currency symbol helper
────────────────────────────────────────── */
const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", GBP: "£", JPY: "¥" };

const CatalogProductCard = ({ product }) => {
  const navigate = useNavigate();

  const {
    _id,
    title,
    description,
    price: { amount = 0, currency = "USD" },
    images = [],
    stock = 0,
    status,
  } = product;

  const thumb = images?.[0];
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const isSoldOut = status !== "active" || stock === 0;
  
  const isNew = (() => {
    const created = new Date(product.createdAt);
    const diff = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return diff < 14;
  })();

  return (
    <article className="relative group border-r-2 border-b-2 border-black overflow-hidden bg-white flex flex-col h-full">
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden relative bg-[#e2e2e2] flex-shrink-0">
        {thumb ? (
          <img
            src={thumb}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
              No Image
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isSoldOut && (
            <span
              className="bg-black text-white font-['Space_Grotesk'] text-[10px] font-black px-2 py-1 border-2 border-black uppercase"
            >
              Sold Out
            </span>
          )}
          {isNew && !isSoldOut && (
            <span
              className="bg-[#ccff00] text-black font-['Space_Grotesk'] text-[10px] font-black px-2 py-1 border-2 border-black uppercase"
            >
              New Arrival
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <div className="flex justify-between items-start gap-2">
          <h3
            className="font-['Space_Grotesk'] text-sm md:text-base font-black uppercase leading-tight tracking-tighter line-clamp-2"
          >
            {title}
          </h3>
          <span className="font-['Space_Grotesk'] text-sm md:text-base font-black shrink-0 whitespace-nowrap">
            {symbol}{Number(amount).toFixed(2)}
          </span>
        </div>
        {description && (
          <span className="font-['Inter'] text-[10px] text-[#5e5e5e] uppercase tracking-widest line-clamp-1">
            {description}
          </span>
        )}
      </div>

      {/* Hover CTA */}
      {!isSoldOut && (
        <button
          id={`add-to-bag-${_id}`}
          onClick={() => navigate(`/product/${_id}`)}
          className="w-full py-3 px-2 border-t-2 border-black bg-black text-white font-['Space_Grotesk'] font-black uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0"
        >
          View Product
        </button>
      )}
    </article>
  );
};

export default CatalogProductCard;
