import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useProduct } from "../../hooks/useProduct";
import { useCart } from "../../../cart/hooks/useCart";
import { addToArchive, removeFromArchive } from "../../store/archive.slice";


/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥" };

const currencySymbol = (c) => CURRENCY_SYMBOLS[c] ?? c;

/* Format a flat attribute object { color:"black", size:"L" } into chips */
const AttributeChips = ({ attribute }) => {
  if (!attribute || typeof attribute !== "object") return null;
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(attribute).map(([k, v]) => (
        <span
          key={k}
          className="flex items-center gap-1 bg-[#e8e8e8] border border-black/20 px-2 py-1"
        >
          <span
            className="text-[9px] font-black uppercase tracking-widest text-[#5e5e5e]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {k}
          </span>
          <span className="w-px h-3 bg-black/20" />
          <span
            className="text-[11px] font-black uppercase tracking-wide text-[#1b1b1b]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {v}
          </span>
        </span>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────
   Image Gallery
───────────────────────────────────────── */
const ImageGallery = ({ images = [], title }) => {
  const [active, setActive] = useState(0);

  const all = images.filter(Boolean);

  if (all.length === 0) {
    return (
      <div className="aspect-[4/5] bg-[#e2e2e2] flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-6xl text-[#5e5e5e]">
          image_not_supported
        </span>
        <span
          className="text-[10px] font-black uppercase tracking-widest text-[#5e5e5e]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          NO_IMAGE
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative overflow-hidden bg-[#e8e8e8] group">
        <img
          src={all[active]}
          alt={`${title} — view ${active + 1}`}
          className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {/* Index badge */}
        <span
          className="absolute top-4 left-4 bg-black text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {String(active + 1).padStart(2, "0")} / {String(all.length).padStart(2, "0")}
        </span>

        {/* Arrow nav */}
        {all.length > 1 && (
          <>
            <button
              onClick={() => setActive((p) => (p - 1 + all.length) % all.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white border-2 border-black p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ccff00]"
              aria-label="Previous image"
            >
              <span className="material-symbols-outlined text-base leading-none block">
                chevron_left
              </span>
            </button>
            <button
              onClick={() => setActive((p) => (p + 1) % all.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border-2 border-black p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ccff00]"
              aria-label="Next image"
            >
              <span className="material-symbols-outlined text-base leading-none block">
                chevron_right
              </span>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {all.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {all.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden border-2 transition-all ${i === active
                  ? "border-black shadow-[3px_3px_0px_#ccff00]"
                  : "border-black/20 hover:border-black/60"
                }`}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Skeleton loader
───────────────────────────────────────── */
const Skeleton = () => (
  <div className="flex flex-col lg:flex-row w-full animate-pulse">
    <div className="w-full lg:w-[60%] p-6 lg:p-12 border-r-2 border-black bg-[#f3f3f3]">
      <div className="aspect-[4/5] bg-[#e2e2e2]" />
    </div>
    <div className="w-full lg:w-[40%] p-8 lg:p-12 space-y-6">
      <div className="h-10 bg-[#e2e2e2] w-3/4" />
      <div className="h-6 bg-[#e2e2e2] w-1/3" />
      <div className="h-4 bg-[#e2e2e2] w-full" />
      <div className="h-4 bg-[#e2e2e2] w-5/6" />
      <div className="h-14 bg-[#e2e2e2] w-full mt-8" />
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Main Page Component
───────────────────────────────────────── */
const ProductDetails = () => {
  const { id, variantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleProductDetails } = useProduct();
  const { handleAddToCart } = useCart();

  const { selectedProduct: product, loading } = useSelector((s) => s.product);
  const { user } = useSelector((state) => state.auth);
  const archiveItems = useSelector((s) => s.archive.items);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(null);
  const [archiveFeedback, setArchiveFeedback] = useState(false);

  useEffect(() => {
    if (id) handleProductDetails(id);
  }, [id]);

  /* Sync selected variant from URL when product loads */
  useEffect(() => {
    if (!product?.variants?.length) {
      setSelectedVariantIdx(null);
      return;
    }
    if (variantId) {
      const idx = product.variants.findIndex((v) => v._id === variantId);
      setSelectedVariantIdx(idx !== -1 ? idx : null);
    } else {
      setSelectedVariantIdx(null);
    }
  }, [product?._id, variantId]);

  if (loading) {
    return (
      <div className="bg-[#f9f9f9] min-h-screen">

        <Skeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#f9f9f9] min-h-screen">
        
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <span className="material-symbols-outlined text-6xl text-[#5e5e5e]">
            inventory_2
          </span>
          <p
            className="font-black text-sm uppercase tracking-widest text-[#5e5e5e]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            PRODUCT_NOT_FOUND
          </p>
          <button
            onClick={() => navigate("/catalog")}
            className="px-8 py-3 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-[#ccff00] hover:text-black transition-colors border-2 border-black"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ← Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  /* ── Base product fields ── */
  const {
    title,
    description,
    price: { amount, currency } = {},
    stock,
    sku,
    status,
    images = [],
    variants = [],
    createdAt,
  } = product;

  const selectedVariant = selectedVariantIdx !== null ? variants[selectedVariantIdx] : null;

  /* ── Variant-override logic ──────────────────────────────────────────────
     Fields that a variant CAN override (if the variant has them):
       • price.priceAmount  → activeAmount
       • price.priceCurrency → activeCurrency
       • stock              → activeStock
       • images             → activeImages (variant images replace, not append)
     Fields that ALWAYS stay from the product (variants have no such field):
       • title, description, sku, status, createdAt
  ──────────────────────────────────────────────────────────────────────── */
  const activeAmount = selectedVariant?.price?.priceAmount ?? amount ?? 0;
  const activeCurrency = selectedVariant?.price?.priceCurrency ?? currency ?? "USD";
  const activeStock = selectedVariant?.stock ?? stock ?? 0;
  const symbol = currencySymbol(activeCurrency);

  /* Images: if the selected variant has its own images use those exclusively,
     otherwise fall back to the product's images */
  const variantImages = selectedVariant?.images?.filter(Boolean) ?? [];
  const activeImages = variantImages.length > 0 ? variantImages : images.filter(Boolean);

  const isSoldOut = status !== "active" || activeStock === 0;

  const isNew = (() => {
    const diff = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24);
    return diff < 14;
  })();

  return (
    <div className="bg-[#f9f9f9] min-h-screen text-[#1b1b1b]">
     
      {/* ── Breadcrumb ── */}
      <nav className="px-6 py-3 border-b border-black/10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest font-['Space_Grotesk'] text-[#5e5e5e]">
        <button
          onClick={() => navigate("/catalog")}
          className="hover:text-[#506600] transition-colors"
        >
          CATALOG
        </button>
        <span>/</span>
        <span className="text-[#1b1b1b] truncate max-w-[200px]">{title?.toUpperCase()}</span>
      </nav>

      <main>
        <div className="flex flex-col lg:flex-row w-full">

          {/* ── Left: Image Gallery ── */}
          <section className="w-full lg:w-[60%] bg-[#f3f3f3] p-4 md:p-8 lg:p-12 border-r-2 border-black">
            <ImageGallery images={activeImages} title={title} />
          </section>

          {/* ── Right: Product Info ── */}
          <section className="w-full lg:w-[40%] p-6 lg:p-12 lg:sticky lg:top-[73px] lg:h-fit bg-[#f9f9f9]">

            {/* Badge row */}
            <div className="flex items-center gap-2 mb-4">
              {isNew && !isSoldOut && (
                <span
                  className="bg-[#ccff00] text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-widest border border-black"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  NEW_ARRIVAL
                </span>
              )}
              {isSoldOut && (
                <span
                  className="bg-black text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  SOLD_OUT
                </span>
              )}
              <span
                className="text-[9px] font-black uppercase tracking-widest text-[#5e5e5e] border border-black/20 px-2 py-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {status?.toUpperCase() ?? "ACTIVE"}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-4xl font-black uppercase leading-none tracking-tighter mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="text-2xl font-black text-[#506600]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {symbol}{Number(activeAmount).toFixed(2)}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-widest text-[#5e5e5e]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {activeCurrency}
              </span>
              {selectedVariant && (
                <span
                  className="text-[9px] font-black uppercase tracking-widest text-[#5e5e5e] border border-dashed border-black/30 px-1.5 py-0.5"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  VARIANT PRICE
                </span>
              )}
            </div>

            {/* Description */}
            <p className="font-['Inter'] text-sm text-[#5e5e5e] leading-relaxed mb-8 border-l-2 border-[#ccff00] pl-3">
              {description}
            </p>

            {/* ── Variants ── */}
            {variants.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[11px] font-black uppercase tracking-widest text-[#5e5e5e]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    SELECT VARIANT
                  </span>
                  {selectedVariant && (
                    <button
                      onClick={() => navigate(`/product/${id}`, { replace: true })}
                      className="text-[9px] font-black uppercase tracking-widest text-[#ba1a1a] hover:underline"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Clear ×
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {variants.map((v, i) => {
                    const isSelected = selectedVariantIdx === i;
                    const isOutOfStock = (v.stock ?? 0) === 0;
                    const vSymbol = currencySymbol(v.price?.priceCurrency ?? "USD");

                    return (
                      <button
                        key={v._id ?? i}
                        id={`variant-btn-${i}`}
                        onClick={() => {
                          if (isSelected) {
                            navigate(`/product/${id}`, { replace: true });
                          } else {
                            navigate(`/product/${id}/${v._id}`, { replace: true });
                          }
                        }}
                        disabled={isOutOfStock}
                        className={`w-full flex items-center justify-between px-4 py-3 border-2 transition-all text-left ${isSelected
                            ? "border-black bg-black text-white shadow-[4px_4px_0px_#ccff00]"
                            : isOutOfStock
                              ? "border-black/20 bg-[#f3f3f3] opacity-40 cursor-not-allowed"
                              : "border-black/30 bg-white hover:border-black hover:shadow-[3px_3px_0px_#1b1b1b] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                          }`}
                      >
                        {/* Attributes */}
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(v.attribute ?? {}).map(([k, val]) => (
                            <span
                              key={k}
                              className={`text-[10px] font-black uppercase tracking-wide ${isSelected ? "text-[#ccff00]" : "text-[#1b1b1b]"
                                }`}
                              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                              {k}: <span className={isSelected ? "text-white" : "text-[#506600]"}>{val}</span>
                            </span>
                          ))}
                        </div>

                        {/* Price + stock */}
                        <div className="flex flex-col items-end shrink-0 ml-4">
                          <span
                            className={`text-sm font-black ${isSelected ? "text-[#ccff00]" : "text-[#506600]"
                              }`}
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                          >
                            {vSymbol}{Number(v.price?.priceAmount ?? 0).toFixed(2)}
                          </span>
                          <span
                            className={`text-[8px] font-bold uppercase tracking-widest ${isSelected ? "text-white/60" : "text-[#5e5e5e]"
                              }`}
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                          >
                            {isOutOfStock ? "OUT OF STOCK" : `QTY: ${v.stock}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`w-2 h-2 rounded-full ${isSoldOut ? "bg-[#ba1a1a]" : activeStock <= 3 ? "bg-[#f0a500]" : "bg-[#506600]"
                  }`}
              />
              <span
                className="text-[10px] font-black uppercase tracking-widest text-[#5e5e5e]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {isSoldOut
                  ? "OUT OF STOCK"
                  : activeStock <= 3
                    ? `ONLY ${activeStock} LEFT`
                    : `IN STOCK — ${activeStock} UNITS`}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 mb-10">
              <button
                id="add-to-bag-btn"
                disabled={isSoldOut}
                onClick={() => {
                  if (user?._id) {
                    handleAddToCart(id, variantId, 1);
                    navigate(`/cart/${user._id}`);
                  } else {
                    navigate("/login");
                  }
                }}
                className="w-full bg-[#ccff00] text-black py-5 font-black text-lg tracking-tighter uppercase border-2 border-black shadow-[4px_4px_0px_0px_#1b1b1b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {isSoldOut ? "SOLD OUT" : "ADD TO BAG"}
              </button>
              <button
                id="save-to-archive-btn"
                onClick={() => {
                  const isAlready = archiveItems.some((i) => i._id === product._id);
                  if (isAlready) {
                    dispatch(removeFromArchive(product._id));
                    setArchiveFeedback(false);
                  } else {
                    dispatch(addToArchive(product));
                    setArchiveFeedback(true);
                    setTimeout(() => setArchiveFeedback(false), 2000);
                  }
                }}
                className={`w-full border-2 border-black py-5 font-black text-sm tracking-tighter uppercase flex items-center justify-center gap-2 transition-all ${
                  archiveItems.some((i) => i._id === product._id)
                    ? "bg-[#ccff00] text-black shadow-[4px_4px_0px_0px_#1b1b1b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    : "bg-transparent hover:bg-[#f3f3f3]"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="material-symbols-outlined text-base leading-none" style={{ fontVariationSettings: archiveItems.some((i) => i._id === product._id) ? "'FILL' 1" : "'FILL' 0" }}>
                  favorite
                </span>
                {archiveFeedback
                  ? "SAVED! VIEW ARCHIVE →"
                  : archiveItems.some((i) => i._id === product._id)
                  ? "IN YOUR ARCHIVE"
                  : "SAVE TO ARCHIVE"}
              </button>
              <button
                id="back-to-catalog-btn"
                onClick={() => navigate("/catalog")}
                className="w-full border-2 border-black/20 bg-transparent py-4 font-bold text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 hover:border-black hover:bg-[#f3f3f3] transition-colors text-[#5e5e5e] hover:text-[#1b1b1b]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="material-symbols-outlined text-sm leading-none">
                  arrow_back
                </span>
                BACK TO CATALOG
              </button>
            </div>

            {/* ── Product Specs ── */}
            <div className="border-t-2 border-black pt-8">
              <h3
                className="font-black text-sm tracking-widest uppercase mb-5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                PRODUCT SPECS
              </h3>
              <ul className="space-y-3 text-sm font-['Inter']">
                {[
                  { label: "SKU", value: sku },
                  { label: "Status", value: status?.toUpperCase() },
                  {
                    label: "Base Price",
                    value: `${currencySymbol(currency)}${Number(amount).toFixed(2)} ${currency}`,
                  },
                  { label: "Total Stock", value: stock },
                  { label: "Variants", value: variants.length || "None" },
                ]
                  .filter((r) => r.value !== undefined && r.value !== null)
                  .map(({ label, value }) => (
                    <li
                      key={label}
                      className="flex justify-between border-b border-[#c4c9ac]/40 pb-2"
                    >
                      <span
                        className="text-[#5e5e5e] uppercase text-[11px] font-bold"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {label}
                      </span>
                      <span
                        className="font-bold text-[#1b1b1b]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {value}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* ── Selected Variant Detail ── */}
            {selectedVariant && (
              <div className="mt-8 border-2 border-black/10 bg-[#f3f3f3] p-4">
                <span
                  className="text-[10px] font-black uppercase tracking-widest text-[#5e5e5e] mb-3 block"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  SELECTED VARIANT — VAR_{String(selectedVariantIdx + 1).padStart(2, "0")}
                </span>
                <AttributeChips attribute={selectedVariant.attribute} />
              </div>
            )}
          </section>
        </div>

        {/* ── System / Meta bar ── */}
        <div className="border-t-2 border-black bg-black text-white px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <span
            className="text-[9px] font-black uppercase tracking-[0.25em] text-[#5e5e5e]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            PRODUCT_ID // {id}
          </span>
          <span
            className="text-[9px] font-black uppercase tracking-[0.25em] text-[#5e5e5e]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            BADDIE_THRIFT // BRUTALIST_V1.0
          </span>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-black text-white p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4
              className="text-xl font-black uppercase tracking-tighter mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              BADDIE THRIFT
            </h4>
            <p className="font-['Inter'] text-xs text-[#5e5e5e] leading-relaxed max-w-xs">
              Pre-loved garments meet brutalist silhouettes. Curating the edge
              of modern streetwear for the metropolitan citizen.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {[
              { label: "Catalog", links: ["New Arrivals", "Top Sellers"] },
              { label: "Support", links: ["Shipping", "Returns", "Contact"] },
            ].map(({ label, links }) => (
              <div key={label} className="flex flex-col gap-4">
                <span
                  className="text-xs font-black uppercase tracking-widest text-[#506600]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {label}
                </span>
                {links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="font-['Inter'] text-xs hover:underline decoration-[#506600] underline-offset-4"
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <span
              className="text-xs font-black uppercase tracking-widest text-[#506600]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Newsletter
            </span>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-transparent border-b-2 border-white text-white font-['Space_Grotesk'] text-xs focus:outline-none focus:border-[#ccff00] p-2 placeholder:text-[#5e5e5e]"
                placeholder="EMAIL ADDRESS"
                type="email"
              />
              <button className="bg-[#ccff00] text-black px-6 py-2 font-['Space_Grotesk'] text-xs font-black uppercase hover:bg-[#506600] hover:text-white transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-[#5e5e5e]/30 flex justify-between items-center">
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-[#5e5e5e]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            © 2025 BADDIE THRIFT ARCHIVE
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-[#5e5e5e]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            BRUTALIST_V1.0
          </span>
        </div>
      </footer>

      <div className="h-20 md:hidden" />

    </div>
  );
};

export default ProductDetails;
