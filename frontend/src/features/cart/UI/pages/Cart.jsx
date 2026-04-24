import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "../../hooks/useCart";
import { useProduct } from "../../../products/hooks/useProduct";


/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥" };
const sym = (c) => CURRENCY_SYMBOLS[c] ?? c ?? "$";

const SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 15;
const TAX_RATE = 0.08;

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

/* Product image with grayscale hover — matches the design */
const ItemImage = ({ images = [], title }) => {
    const src = images.find(Boolean);
    return (
        <div className="w-full md:w-56 lg:w-64 h-72 md:h-80 bg-[#f3f3f3] border-2 border-black overflow-hidden shrink-0 group">
            {src ? (
                <img
                    src={src}
                    alt={title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#5e5e5e]">
                    <span className="material-symbols-outlined text-5xl">
                        image_not_supported
                    </span>
                    <span
                        className="text-[9px] font-black uppercase tracking-widest"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        NO_IMAGE
                    </span>
                </div>
            )}
        </div>
    );
};

/* Quantity stepper */
const QuantityStepper = ({ quantity, onDecrease, onIncrease }) => (
    <div className="flex items-center border-2 border-black h-12 bg-white">
        <button
            onClick={onDecrease}
            aria-label="Decrease quantity"
            className="w-12 h-full flex items-center justify-center hover:bg-[#f3f3f3] transition-colors"
        >
            <span className="material-symbols-outlined text-lg leading-none">remove</span>
        </button>
        <span
            className="w-12 text-center font-black font-['Space_Grotesk'] text-sm select-none"
        >
            {String(quantity).padStart(2, "0")}
        </span>
        <button
            onClick={onIncrease}
            aria-label="Increase quantity"
            className="w-12 h-full flex items-center justify-center hover:bg-[#f3f3f3] transition-colors border-l-2 border-black"
        >
            <span className="material-symbols-outlined text-lg leading-none">add</span>
        </button>
    </div>
);

/* Skeleton row */
const SkeletonRow = () => (
    <div className="flex flex-col md:flex-row gap-8 pb-8 border-b-2 border-[#e2e2e2] animate-pulse">
        <div className="w-full md:w-64 h-80 bg-[#e2e2e2] border-2 border-black/10" />
        <div className="flex-grow flex flex-col gap-4 pt-2">
            <div className="h-8 bg-[#e2e2e2] w-2/3" />
            <div className="h-4 bg-[#e2e2e2] w-1/3" />
            <div className="h-4 bg-[#e2e2e2] w-1/2" />
            <div className="mt-auto h-12 bg-[#e2e2e2] w-36" />
        </div>
    </div>
);

/* Empty bag state */
const EmptyBag = ({ onShop }) => (
    <div className="flex flex-col items-center justify-center py-32 gap-8 border-2 border-black/10 bg-white">
        <span className="material-symbols-outlined text-7xl text-[#c4c9ac]">
            shopping_bag
        </span>
        <div className="text-center">
            <p
                className="font-black text-4xl uppercase tracking-tighter mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                YOUR BAG IS EMPTY
            </p>
            <p className="text-sm text-[#5e5e5e] font-['Inter']">
                Nothing in here yet. Start browsing the catalog.
            </p>
        </div>
        <button
            id="empty-bag-shop-btn"
            onClick={onShop}
            className="bg-[#ccff00] text-black border-2 border-black px-12 py-4 font-black text-sm uppercase tracking-widest font-['Space_Grotesk'] shadow-[4px_4px_0px_#1b1b1b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
            BROWSE CATALOG
        </button>
    </div>
);

/* ─────────────────────────────────────────
   Main Cart Page
───────────────────────────────────────── */
const Cart = () => {
    const navigate = useNavigate();
    const { handleGetCart, handleRemoveFromCart, handleUpdateQuantity } = useCart();
    const { handleGetAllProducts } = useProduct();

    const { cartItems, loading, error } = useSelector((state) => state.cart);
    const user = useSelector((state) => state.auth?.user);
    const catalogProducts = useSelector((state) => state.product?.catalogProducts ?? []);

    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoError, setPromoError] = useState("");

    useEffect(() => {
        handleGetCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch catalog if not already loaded
    useEffect(() => {
        if (catalogProducts.length === 0) {
            handleGetAllProducts({ limit: 50 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catalogProducts.length]);

    /* ── Price helpers ── */
    const resolveItem = (item) => {
        console.log("item",item)
        const product = item.product ?? {};
        const variant = item.variant ?? null;
        
        // Prefer variant price if available
        const rawAmount =
            variant?.price?.priceAmount ??
            variant?.price?.amount ??
            product?.price?.amount ??
            0;
        const rawCurrency =
            variant?.price?.priceCurrency ??
            variant?.price?.currency ??
            product?.price?.currency ??
            "USD";

        // Images: variant images > product images
        const variantImages = (variant?.images ?? []).filter(Boolean);
        const productImages = (product?.images ?? []).filter(Boolean);
        const images = variantImages.length > 0 ? variantImages : productImages;

        // Variant attributes label  e.g. "COLOR: BLACK / SIZE: L"
        const attrLabel = variant?.attribute
            ? Object.entries(variant.attribute)
                  .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                  .join(" / ")
            : null;

        return {
            title: product?.title ?? "Unknown Product",
            price: Number(rawAmount),
            currency: rawCurrency,
            images,
            attrLabel,
            productId: product?._id ?? item.product,
            variantId: variant?._id ?? item.variant ?? null,
            quantity: item.quantity ?? 1,
            status: product?.status ?? "active",
            stock: variant?.stock ?? product?.stock ?? 0,
        };
    };

    const resolvedItems = cartItems.map(resolveItem);

    const subtotal = resolvedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0
    );
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const taxes = subtotal * TAX_RATE;
    const discount = promoApplied ? subtotal * 0.1 : 0; // 10% mock promo
    const total = subtotal + shipping + taxes - discount;

    /* ── "You Might Also Like" — RegEx filter across catalog ── */
    const suggestedProducts = useMemo(() => {
        // IDs already in cart — exclude them
        const cartProductIds = new Set(
            resolvedItems.map((i) => String(i.productId))
        );

        // Build keyword list from cart item titles + descriptions
        const keywords = resolvedItems
            .flatMap((item) => {
                const words = [];
                if (item.title) words.push(...item.title.split(/\s+/));
                if (item.description) words.push(...item.description.split(/\s+/));
                return words;
            })
            .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").trim())
            .filter((w) => w.length > 2); // ignore tiny stop-words

        // Deduplicate and build RegEx (OR of all keywords)
        const uniqueKeywords = [...new Set(keywords)];
        const pattern =
            uniqueKeywords.length > 0
                ? new RegExp(uniqueKeywords.join("|"), "i")
                : null;

        const candidates = catalogProducts.filter((p) => {
            if (cartProductIds.has(String(p._id))) return false; // already in cart
            if (!pattern) return true; // no keywords → include all
            return pattern.test(p.title ?? "") || pattern.test(p.description ?? "");
        });

        // Shuffle and take up to 4
        const shuffled = [...candidates].sort(() => Math.random() - 0.5);
        // If no regex matches, fall back to a random slice of the full catalog
        if (shuffled.length === 0) {
            return [...catalogProducts]
                .filter((p) => !cartProductIds.has(String(p._id)))
                .sort(() => Math.random() - 0.5)
                .slice(0, 4);
        }
        return shuffled.slice(0, 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catalogProducts, cartItems]);

    const handleApplyPromo = () => {
        if (promoCode.trim().toUpperCase() === "BADDIE10") {
            setPromoApplied(true);
            setPromoError("");
        } else {
            setPromoError("INVALID CODE");
            setPromoApplied(false);
        }
    };

    return (
        <div className="bg-[#f9f9f9] min-h-screen text-[#1b1b1b]">
         

            {/* ── Hero Header ── */}
            <main className="pt-12 pb-24 px-6 md:px-10 max-w-screen-2xl mx-auto">
                <div className="flex flex-col gap-3 mb-10">
                    <h1
                        className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        YOUR BAG
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                        <span
                            className="bg-black text-[#ccff00] px-3 py-1 font-black text-xs uppercase tracking-widest"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {resolvedItems.length} ITEM{resolvedItems.length !== 1 ? "S" : ""}
                        </span>
                        {user && (
                            <span
                                className="text-[#5e5e5e] font-black text-xs tracking-widest uppercase"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                USER: {user._id?.slice(-8)?.toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Error Banner ── */}
                {error && (
                    <div className="mb-6 border-2 border-[#ba1a1a] bg-[#ffdad6] px-6 py-4 flex items-center justify-between">
                        <span
                            className="text-[#93000a] text-xs font-black uppercase tracking-widest"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {typeof error === "string" ? error : "FAILED TO SYNC CART"}
                        </span>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* ── Items List ── */}
                    <div className="flex-grow flex flex-col gap-10">
                        {loading ? (
                            <>
                                <SkeletonRow />
                                <SkeletonRow />
                            </>
                        ) : resolvedItems.length === 0 ? (
                            <EmptyBag onShop={() => navigate("/")} />
                        ) : (
                            resolvedItems.map((item, idx) => (
                                <div
                                    key={`${item.productId}-${item.variantId}-${idx}`}
                                    className="flex flex-col md:flex-row gap-8 pb-10 border-b-2 border-[#e2e2e2]"
                                >
                                    {/* Image */}
                                    <ItemImage images={item.images} title={item.title} />

                                    {/* Details */}
                                    <div className="flex-grow flex flex-col justify-between gap-6">
                                        <div>
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                <h3
                                                    className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight"
                                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                >
                                                    {item.title}
                                                </h3>
                                                <span
                                                    className="text-2xl md:text-3xl font-black shrink-0"
                                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                >
                                                    {sym(item.currency)}
                                                    {(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>

                                            {item.attrLabel && (
                                                <p
                                                    className="text-xs text-[#5e5e5e] uppercase tracking-widest font-black mb-1"
                                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                >
                                                    {item.attrLabel}
                                                </p>
                                            )}

                                            {/* Unit price when qty > 1 */}
                                            {item.quantity > 1 && (
                                                <p
                                                    className="text-[10px] text-[#5e5e5e] uppercase tracking-widest font-bold"
                                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                >
                                                    {sym(item.currency)}{item.price.toFixed(2)} EACH
                                                </p>
                                            )}

                                            {/* Stock warning */}
                                            {item.stock > 0 && item.stock <= 3 && (
                                                <p
                                                    className="mt-2 text-[10px] font-black uppercase tracking-widest text-[#f0a500]"
                                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                >
                                                    ⚠ ONLY {item.stock} LEFT IN STOCK
                                                </p>
                                            )}
                                        </div>

                                        {/* Bottom — stepper + remove */}
                                        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-end gap-4">
                                            <QuantityStepper
                                                quantity={item.quantity}
                                                onDecrease={() =>
                                                    item.quantity > 1
                                                        ? handleUpdateQuantity(
                                                              item.productId,
                                                              item.variantId,
                                                              -1
                                                          )
                                                        : handleRemoveFromCart(
                                                              item.productId,
                                                              item.variantId
                                                          )
                                                }
                                                onIncrease={() =>
                                                    handleUpdateQuantity(
                                                        item.productId,
                                                        item.variantId,
                                                         1
                                                    )
                                                }
                                            />

                                            <button
                                                id={`remove-item-${idx}`}
                                                onClick={() =>
                                                    handleRemoveFromCart(
                                                        item.productId,
                                                        item.variantId
                                                    )
                                                }
                                                className="flex items-center gap-1.5 text-[#5e5e5e] hover:text-[#ba1a1a] transition-colors font-black text-[10px] uppercase tracking-widest"
                                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                            >
                                                <span className="material-symbols-outlined text-sm leading-none">
                                                    close
                                                </span>
                                                REMOVE ITEM
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Continue shopping link */}
                        {resolvedItems.length > 0 && !loading && (
                            <button
                                onClick={() => navigate("/")}
                                className="self-start flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#5e5e5e] hover:text-[#506600] transition-colors border-b-2 border-transparent hover:border-[#506600] pb-0.5"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                <span className="material-symbols-outlined text-sm leading-none">
                                    arrow_back
                                </span>
                                CONTINUE SHOPPING
                            </button>
                        )}
                    </div>

                    {/* ── Order Summary Sidebar ── */}
                    {resolvedItems.length > 0 && (
                        <aside className="w-full lg:w-[400px] flex flex-col gap-6">
                            {/* Summary card */}
                            <div className="border-2 border-black bg-white p-8 sticky top-24">
                                <h2
                                    className="text-3xl font-black uppercase tracking-tighter mb-8"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    ORDER SUMMARY
                                </h2>

                                <div className="flex flex-col gap-4 mb-8">
                                    <div className="flex justify-between font-black text-xs uppercase tracking-widest"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        <span className="text-[#5e5e5e]">SUBTOTAL</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between font-black text-xs uppercase tracking-widest"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        <span className="text-[#5e5e5e]">EST. SHIPPING</span>
                                        <span>
                                            {shipping === 0 ? (
                                                <span className="text-[#506600]">FREE</span>
                                            ) : (
                                                `$${shipping.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between font-black text-xs uppercase tracking-widest"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        <span className="text-[#5e5e5e]">TAXES (8%)</span>
                                        <span>${taxes.toFixed(2)}</span>
                                    </div>

                                    {promoApplied && (
                                        <div className="flex justify-between font-black text-xs uppercase tracking-widest text-[#506600]"
                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                            <span>PROMO (BADDIE10)</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="h-0.5 bg-black my-2" />

                                    <div className="flex justify-between items-end">
                                        <span
                                            className="font-black text-xl uppercase tracking-tighter"
                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                        >
                                            TOTAL
                                        </span>
                                        <span
                                            className="font-black text-4xl tracking-tighter"
                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                        >
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex flex-col gap-4">
                                    <button
                                        id="proceed-to-checkout-btn"
                                        className="w-full bg-[#ccff00] text-black border-2 border-black h-16 font-black text-xl uppercase tracking-tighter shadow-[4px_4px_0px_#1b1b1b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-[0.98]"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        PROCEED TO CHECKOUT
                                    </button>

                                    <p
                                        className="text-[10px] text-center text-[#5e5e5e] tracking-widest uppercase"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        {subtotal >= SHIPPING_THRESHOLD
                                            ? "🎉 YOU'VE UNLOCKED FREE SHIPPING"
                                            : `FREE SHIPPING ON ORDERS OVER $${SHIPPING_THRESHOLD}`}
                                    </p>
                                </div>

                                {/* Promo Code */}
                                <div className="mt-10 pt-8 border-t-2 border-[#f3f3f3]">
                                    <label
                                        className="font-black text-[10px] uppercase tracking-widest mb-3 block"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        PROMO CODE
                                    </label>
                                    <div className="flex  flex-wrap md:flex-nowrap  gap-2">
                                        <input
                                            id="promo-code-input"
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => {
                                                setPromoCode(e.target.value);
                                                setPromoError("");
                                            }}
                                            placeholder="ENTER CODE"
                                            className="flex-grow border-2 border-black px-4 py-3 font-black text-sm uppercase tracking-widest outline-none focus:border-[#506600] transition-colors bg-white placeholder:text-[#c4c9ac]"
                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                        />
                                        <button
                                            id="apply-promo-btn"
                                            onClick={handleApplyPromo}
                                            className="border-2 border-black px-5 font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white py-4 transition-colors bg-white"
                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                        >
                                            APPLY
                                        </button>
                                    </div>
                                    {promoError && (
                                        <p
                                            className="mt-2 text-[10px] font-black uppercase tracking-widest text-[#ba1a1a]"
                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                        >
                                            {promoError}
                                        </p>
                                    )}
                                    {promoApplied && (
                                        <p
                                            className="mt-2 text-[10px] font-black uppercase tracking-widest text-[#506600]"
                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                        >
                                            ✓ 10% DISCOUNT APPLIED
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Help block */}
                            <div className="border-2 border-black bg-black p-8 text-white">
                                <h4
                                    className="font-black uppercase text-xl mb-5"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    NEED HELP?
                                </h4>
                                <div className="flex flex-col gap-3">
                                    {[
                                        "SHIPPING & RETURNS",
                                        "SIZE GUIDE",
                                        "CONTACT SUPPORT",
                                    ].map((link) => (
                                        <a
                                            key={link}
                                            href="#"
                                            className="text-[11px] font-black uppercase tracking-widest text-[#5e5e5e] hover:text-[#ccff00] transition-colors"
                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                        >
                                            {link}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    )}
                </div>

                {/* ── You Might Also Like ── */}
                {resolvedItems.length > 0 && suggestedProducts.length > 0 && (
                    <section className="mt-24">
                        <h2
                            className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-10"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            YOU MIGHT ALSO LIKE
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {suggestedProducts.map((product) => {
                                // Resolve image from product or first variant
                                const firstVariantImg =
                                    product.variants?.[0]?.images?.find(Boolean);
                                const firstProductImg = product.images?.find(Boolean);
                                const imgSrc = firstVariantImg ?? firstProductImg ?? null;

                                const rawAmount =
                                    product.variants?.[0]?.price?.priceAmount ??
                                    product.variants?.[0]?.price?.amount ??
                                    product.price?.amount ??
                                    0;
                                const rawCurrency =
                                    product.variants?.[0]?.price?.priceCurrency ??
                                    product.variants?.[0]?.price?.currency ??
                                    product.price?.currency ??
                                    "USD";

                                return (
                                    <button
                                        key={product._id}
                                        onClick={() =>
                                            navigate(`/product/${product._id}/${product?.variants[0]._id}`)
                                        }
                                        className="group text-left"
                                    >
                                        <div className="aspect-[3/4] bg-[#e8e8e8] border-2 border-black overflow-hidden mb-3">
                                            {imgSrc ? (
                                                <img
                                                    src={imgSrc}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#5e5e5e] group-hover:bg-[#e2e2e2] transition-colors">
                                                    <span className="material-symbols-outlined text-4xl">
                                                        checkroom
                                                    </span>
                                                    <span
                                                        className="text-[8px] font-black uppercase tracking-widest"
                                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                    >
                                                        NO IMAGE
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-start gap-2">
                                            <span
                                                className="font-black text-sm uppercase tracking-tight leading-tight line-clamp-2"
                                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                            >
                                                {product.title}
                                            </span>
                                            <span
                                                className="font-black text-sm shrink-0"
                                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                            >
                                                {sym(rawCurrency)}{Number(rawAmount).toFixed(2)}
                                            </span>
                                        </div>
                                        {product.description && (
                                            <p
                                                className="mt-1 text-[10px] text-[#5e5e5e] uppercase tracking-widest font-bold line-clamp-1"
                                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                            >
                                                {product.description}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>

            {/* ── Footer ── */}
            <footer className="bg-black text-white border-t-2 border-black flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-8">
                <div>
                    <span
                        className="text-lg font-black uppercase"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        BADDIE THRIFT
                    </span>
                    <p
                        className="text-[#5e5e5e] text-xs font-bold tracking-widest uppercase mt-2"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        ©2025 BADDIE THRIFT. ALL RIGHTS RESERVED.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    {["PRIVACY", "TERMS", "SHIPPING", "CONTACT"].map((l) => (
                        <a
                            key={l}
                            href="#"
                            className="text-xs font-black uppercase tracking-widest text-[#5e5e5e] hover:text-[#ccff00] transition-colors"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {l}
                        </a>
                    ))}
                </div>
            </footer>

       
           
        </div>
    );
};

export default Cart;
