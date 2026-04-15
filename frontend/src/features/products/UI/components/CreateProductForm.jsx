import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
/* ─────────────────────────────────────────
Utility: brutalist input classes
───────────────────────────────────────── */
const inputBase =
  "w-full px-4 py-3 border-2 border-black bg-white font-body text-base placeholder:text-[#747a60]/50 outline-none transition-all duration-200 focus:border-[#506600] focus:shadow-[4px_4px_0px_#ccff00]";

const inputError =
  "w-full px-4 py-3 border-2 border-[#ba1a1a] bg-[#fff5f5] font-body text-base placeholder:text-[#747a60]/50 outline-none transition-all duration-200 focus:border-[#ba1a1a] focus:shadow-[4px_4px_0px_#ff4444]";

const MAX_IMAGES = 7;
const MAX_FILE_SIZE_MB = 5;

/* ─────────────────────────────────────────
   FieldError: inline brutalist error tag
───────────────────────────────────────── */
const FieldError = ({ message }) => {
  if (!message) return null;
  return (
    <div
      className="flex items-center gap-2 mt-1.5 animate-[errorSlide_0.2s_ease-out]"
      role="alert"
      aria-live="polite"
      style={{ animation: "errorSlide 0.2s ease-out" }}
    >
      {/* Left red tick bar */}
      <span className="w-0.5 h-4 bg-[#ba1a1a] shrink-0" />
      {/* Error badge */}
      <span
        className="bg-[#ba1a1a] text-white text-[8px] font-black uppercase px-1.5 py-0.5 tracking-[0.15em] shrink-0"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        ERR
      </span>
      {/* Message */}
      <span
        className="text-[#ba1a1a] text-[10px] font-bold uppercase tracking-[0.1em]"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {message}
      </span>
    </div>
  );
};

/* ─────────────────────────────────────────
   FileSizeErrorBanner: dismissable overlay banner
───────────────────────────────────────── */
const FileSizeErrorBanner = ({ visible, onDismiss }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    // Auto-dismiss after 5s
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDismiss, 300);
  };

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 right-4 z-[9999] max-w-xs"
      style={{
        animation: exiting
          ? "bannerOut 0.3s ease-in forwards"
          : "bannerIn 0.3s ease-out forwards",
      }}
    >
      {/* Outer brutalist container */}
      <div className="bg-[#ba1a1a] border-2 border-black shadow-[6px_6px_0px_#000000] relative overflow-hidden">
        {/* Diagonal stripe accent */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #000 0, #000 2px, transparent 0, transparent 50%)",
            backgroundSize: "8px 8px",
          }}
        />

        {/* Top status bar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b-2 border-black/30 bg-black/20 relative">
          <div className="flex items-center gap-2">
            {/* Blinking indicator */}
            <span
              className="w-2 h-2 bg-[#ccff00] block"
              style={{ animation: "blink 1s step-start infinite" }}
            />
            <span
              className="text-[8px] font-black tracking-[0.25em] uppercase text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              SYSTEM_ALERT · FILE_ERROR
            </span>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors text-sm leading-none ml-4"
            aria-label="Dismiss error"
          >
            <span className="material-symbols-outlined text-sm block leading-none">
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 relative">
          <p
            className="text-white font-black text-xs uppercase tracking-[0.15em] mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            FILE_SIZE_LIMIT_EXCEEDED
          </p>
          <p
            className="text-white/80 text-[10px] font-bold uppercase tracking-wider"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Max allowed:{" "}
            <span className="text-[#ccff00]">{MAX_FILE_SIZE_MB} MB</span> per
            image. Reduce file size and retry.
          </p>

          {/* Progress bar that counts down to auto-dismiss */}
          <div className="mt-3 h-0.5 bg-white/20 w-full relative overflow-hidden">
            <div
              className="h-full bg-[#ccff00] w-full origin-left"
              style={{ animation: "shrink 5s linear forwards" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
/* ─────────────────────────────────────────
   Section Header
───────────────────────────────────────── */
const SectionHeader = ({ num, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-2">
    <span
      className="bg-black text-white px-2 py-0.5 text-[10px] font-black"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {num}
    </span>
    <h2
      className="text-sm font-black tracking-tighter uppercase"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {title}
      {subtitle && (
        <span className="ml-2 text-[10px] text-[#5e5e5e] opacity-70 font-bold">
          {subtitle}
        </span>
      )}
    </h2>
  </div>
);

/* ─────────────────────────────────────────
 Image Slot
───────────────────────────────────────── */
const ImageSlot = ({ image, isPrimary, onUpload, onRemove, slotIndex, setIsFileSizeExceeded }) => {
  const fileRef = useRef(null); // each slot gets its own ref

  const handleClick = () => fileRef.current?.click();

  const handleFile = (e) => {

    const file = e.target.files?.[0];

    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setIsFileSizeExceeded(true);
      console.log("file size exceeded")
      return;
    }
    const url = URL.createObjectURL(file);
    onUpload(slotIndex, { file, url });

  };

  if (image) {
    return (
      <div className="aspect-square bg-white border-2 border-black flex items-center justify-center p-2 relative overflow-hidden">
        <img
          src={image.url}
          alt={`Product image ${slotIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={() => onRemove(slotIndex)}
          className="absolute top-2 right-2 bg-black text-white p-1 hover:bg-[#ba1a1a] transition-colors"
          aria-label="Remove image"
        >
          <span className="material-symbols-outlined text-sm block leading-none">
            close
          </span>
        </button>
        {isPrimary && (
          <span
            className="absolute bottom-2 left-2 bg-[#ccff00] text-black text-[8px] font-black uppercase px-1.5 py-0.5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            PRIMARY
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="aspect-square bg-[#f3f3f3] border-2 border-dashed border-black/20 flex flex-col items-center justify-center cursor-pointer hover:bg-[#eeeeee] transition-colors group"
      aria-label={isPrimary ? "Upload primary image" : "Add image slot"}
    >
      <span className="material-symbols-outlined text-3xl mb-2 text-[#5e5e5e] group-hover:text-[#506600] transition-colors">
        {isPrimary ? "add_a_photo" : "add_box"}
      </span>
      <span
        className="text-[10px] font-black uppercase text-[#5e5e5e]"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {isPrimary ? "UPLOAD_PRIMARY" : "ADD_SLOT"}
      </span>
      <input
        ref={fileRef}
        type="file"
        className="hidden"

        onChange={(e) => {
          handleFile(e);        // ← your actual file logic
          e.target.value = "";  // ← reset so re-uploading same file works
        }}
      />
    </button>
  );
};
/* ─────────────────────────────────────────
   Keyframe styles injected once
───────────────────────────────────────── */
const StyleInjector = () => (
  <style>{`
    @keyframes errorSlide {
      from { opacity: 0; transform: translateX(-6px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes bannerIn {
      from { opacity: 0; transform: translateY(-12px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes bannerOut {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to   { opacity: 0; transform: translateY(-12px) scale(0.97); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes shrink {
      from { transform: scaleX(1); }
      to   { transform: scaleX(0); }
    }
  `}</style>
);

/* ─────────────────────────────────────────
   Main Form Component
   ───────────────────────────────────────── */
const CreateProductForm = ({ onSubmit, onDiscard }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      images: [],
    },
  });


  const [images, setImages] = useState(Array(4).fill(null)); // show 4 slots (grows up to MAX_IMAGES)

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFileSizeExceeded, setIsFileSizeExceeded] = useState(false);



  /* ── Handlers ── */


  const handleUpload = (index, imageData) => {

    setImages((prev) => {
      const next = [...prev];
      next[index] = imageData;
      setValue("images", next);
      // Auto-add a new empty slot if we filled the last one and haven't reached max
      if (index === next.length - 1 && next.length < MAX_IMAGES) {
        next.push(null);
      }
      return next;
    });
  };

  const handleRemove = (index) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = null;
      // Revoke object URL to avoid memory leak
      if (prev[index]?.url) URL.revokeObjectURL(prev[index].url);
      return next;
    });
  };

  const filledCount = images.filter(Boolean).length;

  const handleFormSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {


      onSubmit(data);
      setImages(Array(4).fill(null));
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Timestamp for metadata display ── */
  const now = new Date();
  const ts = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(
    now.getDate(),
  ).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;

  /* ── Determine if the form has any errors for a top-level summary ── */
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <StyleInjector />

      {/* File size error banner — fixed overlay */}
      <FileSizeErrorBanner
        visible={isFileSizeExceeded}
        onDismiss={() => setIsFileSizeExceeded(false)}
      />

      <form
        className="space-y-10"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        {/* ── Top-level validation summary ── */}
        {hasErrors && (
          <div
            role="alert"
            aria-live="polite"
            className="border-2 border-[#ba1a1a] bg-[#fff5f5] p-4 flex items-start gap-3"
            style={{ animation: "errorSlide 0.25s ease-out" }}
          >
            <div className="w-1 self-stretch bg-[#ba1a1a] shrink-0" />
            <div className="flex-1 min-w-0">
              <p
                className="text-[9px] font-black uppercase tracking-[0.25em] text-[#ba1a1a] mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                VALIDATION_FAILURE · RESOLVE ERRORS TO CONTINUE
              </p>
              <ul className="space-y-1">
                {Object.entries(errors).map(([field, err]) => {
                  const messages = err?.message
                    ? [{ key: field, msg: err.message }]
                    : Object.entries(err || {}).map(([sub, e]) => ({
                      key: `${field}.${sub}`,
                      msg: e?.message,
                    }));
                  return messages.map(({ key, msg }) =>
                    msg ? (
                      <li key={key} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-[#ba1a1a] block shrink-0" />
                        <span
                          className="text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {key.replace(".", " › ")}
                        </span>
                        <span className="text-[#5e5e5e] text-[10px]">—</span>
                        <span
                          className="text-[10px] text-[#ba1a1a] font-medium"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {msg}
                        </span>
                      </li>
                    ) : null,
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* ── 01 / Basic Info ── */}
        <section className="space-y-6">
          <SectionHeader num="01" title="Basic Info" />
          <div className="space-y-4">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="product-title"
                  className="text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Product Title
                </label>
                {errors.title && (
                  <span
                    className="text-[8px] font-black tracking-[0.15em] uppercase bg-[#ba1a1a] text-white px-1.5 py-0.5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    REQUIRED
                  </span>
                )}
              </div>
              <input
                id="product-title"
                name="title"
                type="text"
                {...register("title", {
                  required: {
                    value: true,
                    message: "title of product is required",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9]*$/,
                    message: "Only alphanumeric characters are allowed",
                  },
                })}
                placeholder="Enter product name"
                className={errors.title ? inputError : inputBase}
                aria-invalid={!!errors.title}
              />
              <FieldError message={errors.title?.message} />
            </div>
            {/* IN STOCK */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="product-stock"
                  className="text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  IN STOCK
                </label>
                {errors.stock && (
                  <span
                    className="text-[8px] font-black tracking-[0.15em] uppercase bg-[#ba1a1a] text-white px-1.5 py-0.5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    REQUIRED
                  </span>
                )}
              </div>
              <input
                id="product-stock"
                name="stock"
                type="text"
                {...register("stock", {
                  required: {
                    value: true,
                    message: "stock of product is required",
                  },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Only numbers are allowed",
                  },
                })}
                placeholder="Enter Stock Quantity"
                className={errors.stock ? inputError : inputBase}
                aria-invalid={!!errors.stock}
              />
              <FieldError message={errors.stock?.message} />
            </div>
            {/* SKU */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="product-sku"
                  className="text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  SKU
                </label>
                {errors.sku && (
                  <span
                    className="text-[8px] font-black tracking-[0.15em] uppercase bg-[#ba1a1a] text-white px-1.5 py-0.5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    REQUIRED
                  </span>
                )}
              </div>
              <input
                id="product-sku"
                name="sku"
                type="text"
                {...register("sku", {
                  required: {
                    value: true,
                    message: "sku of product is required",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9]*$/,
                    message: "Only alphanumeric characters are allowed",
                  },
                })}
                placeholder="Enter SKU"
                className={errors.sku ? inputError : inputBase}
                aria-invalid={!!errors.sku}
              />
              <FieldError message={errors.sku?.message} />
            </div>
            
                {/* STATUS */}
            <div className="w-1/3 space-y-1">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="product-status"
                  className="block text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Status
                </label>
                {errors.status && (
                  <span
                    className="text-[8px] font-black tracking-[0.15em] uppercase bg-[#ba1a1a] text-white px-1.5 py-0.5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    REQ
                  </span>
                )}
              </div>
              <div className="relative">
                <select
                  id="product-status"
                  name="status"
                  {...register("status", {
                    required: { value: true, message: "select the status" },
                  })}
                  className={`${errors.status ? inputError : inputBase} text-sm font-bold uppercase appearance-none cursor-pointer`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  aria-invalid={!!errors.status}
                >
                  <option value="active">ACTIVE</option>
                  <option value="draft">DRAFT</option>
                  <option value="low_stock">LOW STOCK</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1b1b1b]">
                  unfold_more
                </span>
              </div>
              <FieldError message={errors.price?.price_Currency?.message} />
            </div>
            {/* Description */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="product-description"
                  className="text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Description
                </label>
                {errors.description && (
                  <span
                    className="text-[8px] font-black tracking-[0.15em] uppercase bg-[#ba1a1a] text-white px-1.5 py-0.5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    REQUIRED
                  </span>
                )}
              </div>
              <textarea
                id="product-description"
                name="description"
                rows={4}
                {...register("description", {
                  required: { value: true, message: "description is required" },
                  minLength: {
                    value: 20,
                    message:
                      "the length of the description must be 20 characters",
                  },
                })}
                placeholder="Enter product details..."
                className={`${errors.description ? inputError : inputBase} resize-none`}
                aria-invalid={!!errors.description}
              />
              <FieldError message={errors.description?.message} />
            </div>
            
         
          </div>
        </section>

        {/* ── 02 / Media ── */}
        <section className="space-y-6">
          <SectionHeader
            num="02"
            title="Media Section"
            subtitle={`[ MAX ${MAX_IMAGES} PHOTOS ]`}
          />
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, i) => (
              <ImageSlot
                key={i}
                slotIndex={i}
                image={img}
                setIsFileSizeExceeded={setIsFileSizeExceeded}
                isPrimary={i === 0}
                onUpload={handleUpload}
                onRemove={handleRemove}
              />
            ))}
          </div>
          <p
            className="mt-4 text-[10px] font-bold tracking-widest text-[#5e5e5e] uppercase flex items-center gap-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="w-1 h-1 bg-[#506600] rounded-full" />
            Current Usage: {String(filledCount).padStart(2, "0")} /{" "}
            {String(MAX_IMAGES).padStart(2, "0")} Slots Occupied
          </p>
          {/* File size hint */}
          <p
            className="text-[9px] font-bold tracking-widest text-[#5e5e5e]/60 uppercase flex items-center gap-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="material-symbols-outlined text-[12px]">info</span>
            Max {MAX_FILE_SIZE_MB} MB per image · JPG, PNG, WEBP accepted
          </p>
        </section>

        {/* ── 03 / Pricing ── */}
        <section className="space-y-6">
          <SectionHeader num="03" title="Pricing Section" />
          <div className="flex gap-4">
            {/* Price */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="product-price"
                  className="block text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Price
                </label>
                {errors.price?.price_Amount && (
                  <span
                    className="text-[8px] font-black tracking-[0.15em] uppercase bg-[#ba1a1a] text-white px-1.5 py-0.5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    REQUIRED
                  </span>
                )}
              </div>
              <input
                id="product-price"
                name="price"
                type="number"
                step="0.01"
                {...register("price.price_Amount", {
                  required: {
                    value: true,
                    message: "enter a price for the product",
                  },
                  min: {
                    value: 0.01,
                    message: "minimun price must be 0.01",
                  },
                })}
                placeholder="0.00"
                className={`${errors.price?.price_Amount ? inputError : inputBase} font-headline text-lg font-bold`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                aria-invalid={!!errors.price?.price_Amount}
              />
              <FieldError message={errors.price?.price_Amount?.message} />
            </div>

            {/* Currency */}
            <div className="w-1/3 space-y-1">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="product-currency"
                  className="block text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Currency
                </label>
                {errors.price?.price_Currency && (
                  <span
                    className="text-[8px] font-black tracking-[0.15em] uppercase bg-[#ba1a1a] text-white px-1.5 py-0.5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    REQ
                  </span>
                )}
              </div>
              <div className="relative">
                <select
                  id="product-currency"
                  name="currency"
                  {...register("price.price_Currency", {
                    required: { value: true, message: "select the currency" },
                  })}
                  className={`${errors.price?.price_Currency ? inputError : inputBase} text-sm font-bold uppercase appearance-none cursor-pointer`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  aria-invalid={!!errors.price?.price_Currency}
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="JPY">JPY</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1b1b1b]">
                  unfold_more
                </span>
              </div>
              <FieldError message={errors.price?.price_Currency?.message} />
            </div>
          </div>
        </section>

        {/* ── Metadata / System Info ── */}
        <section className="pt-8 border-t-2 border-black/10">
          <div className="grid grid-cols-2 gap-y-4">
            {[
              { key: "Created_By", value: "SELLER_01", color: "" },
              { key: "Timestamp", value: ts, color: "" },
              {
                key: "Permissions",
                value: "LEVEL_A_CLEARANCE",
                color: "#506600",
              },
              {
                key: "Protocol",
                value: "BADDIE_V1_CORE",
                color: "",
                underline: true,
              },
            ].map(({ key, value, color, underline }) => (
              <div key={key} className="space-y-1">
                <p
                  className="text-[10px] font-black text-[#5e5e5e] uppercase"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {key}
                </p>
                <p
                  className={`text-xs font-bold uppercase ${underline ? "underline" : ""}`}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: color || "#1b1b1b",
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Actions ── */}
        <div className="flex flex-col gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#ccff00] text-black font-black text-xl py-5 px-6 uppercase tracking-tighter hover:bg-[#506600] hover:text-white transition-colors flex justify-between items-center group disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span>{isSubmitting ? "Creating..." : "Create Product"}</span>
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </button>

          <button
            type="button"
            onClick={onDiscard}
            className="w-full bg-transparent text-black border-2 border-black font-bold text-sm py-4 px-6 uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Discard
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateProductForm;
