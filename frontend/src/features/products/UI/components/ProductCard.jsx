import React from "react";

/* ──────────────────────────────────────────
   Status config
────────────────────────────────────────── */
const STATUS = {
  active: {
    label: "ACTIVE",
    badgeCls: "bg-[#ccff00] text-black border border-black",
    cardCls: "border-2 border-black",
    action: { label: "Manage", cls: "bg-[#1b1b1b] text-white hover:bg-[#ccff00] hover:text-black" },
  },
  low_stock: {
    label: "LOW STOCK",
    badgeCls: "bg-[#ba1a1a] text-white border border-black",
    cardCls: "border-2 border-black border-l-[8px] border-l-[#ba1a1a]",
    action: { label: "Restock Now", cls: "bg-[#ccff00] text-black border-2 border-black hover:bg-[#506600] hover:text-white" },
  },
  draft: {
    label: "DRAFT",
    badgeCls: "bg-[#5e5e5e] text-white border border-black",
    cardCls: "border-2 border-black opacity-70 grayscale",
    action: { label: "Edit Draft", cls: "bg-transparent border border-black text-black hover:bg-black hover:text-white" },
  },
};

const ProductCard = ({ product, onAction }) => {
  const {
    _id,
    title,
    sku = "—",
    price :{amount = 0,currency = "USD"},
    stock = 0,
    status = "active",
    images = [],
    description,
  } = product;

  const cfg = STATUS[status] ?? STATUS.active;
  const isLowStock = status === "low_stock";
  const thumb = images?.[0];
  
  const displayPrice = amount != null
    ? `${currency ?? "$"} ${Number(amount).toFixed(2)}`
    : "—";

  return (
    <div
      className={`relative bg-[#f3f3f3] p-4 flex flex-col gap-4 transition-shadow hover:shadow-[4px_4px_0px_#1b1b1b] ${cfg.cardCls}`}
    >
      {/* ── Top row: image + info ── */}
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="w-24 h-24 border-2 border-black overflow-hidden flex-shrink-0 bg-white">
          {thumb ? (
            <img
              src={typeof thumb === "string" ? thumb : thumb?.url}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[#5e5e5e]">
                image_not_supported
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-grow flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3
                className="text-lg font-black uppercase leading-tight tracking-tighter truncate"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {title}
              </h3>
              <button
                type="button"
                className="text-[#5e5e5e] shrink-0"
                aria-label="More options"
              >
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <p
              className="text-[10px] font-bold text-[#5e5e5e] tracking-widest mt-0.5 uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              SKU: {sku}
            </p>
          </div>

          {/* Status + stock */}
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <span
              className={`text-[10px] font-black px-2 py-0.5 ${cfg.badgeCls}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {cfg.label}
            </span>
            {status !== "draft" && (
              <span
                className={`text-[10px] font-bold uppercase ${isLowStock ? "text-[#ba1a1a] font-black" : "text-[#5e5e5e]"}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {isLowStock
                  ? `Only ${stock} remaining`
                  : `STOCK: ${stock} UNITS`}
              </span>
            )}
            {status === "draft" && (
              <span
                className="text-[10px] font-bold text-[#5e5e5e] uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Pending Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom row: price + action ── */}
      <div className="flex justify-between items-end pt-2 border-t border-black/10">
        <div>
          <span
            className="block text-[10px] font-bold text-[#5e5e5e] uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {status === "draft" ? "Expected Price" : "Unit Price"}
          </span>
          <span
            className="text-2xl font-black tracking-tighter"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {displayPrice}
          </span>
          {status !== "draft" && (
            <span
              className="text-[8px] block text-[#5e5e5e] uppercase leading-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              tax inclusive
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAction?.(_id, status)}
          className={`px-4 py-2 font-black text-xs uppercase transition-colors ${cfg.action.cls}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {cfg.action.label}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
