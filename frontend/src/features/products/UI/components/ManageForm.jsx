import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
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
   Variant Image Slot (single file)
───────────────────────────────────────── */
const MAX_VARIANT_IMAGES = 4;

const VariantImageSlot = ({ image, slotIndex, onUpload, onRemove, setIsFileSizeExceeded, isDragging }) => {
    const fileRef = useRef(null);

    const handleFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) return;
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setIsFileSizeExceeded(true);
            return;
        }
        const url = URL.createObjectURL(file);
        onUpload(slotIndex, { file, url });
    };

    const handleInputChange = (e) => {
        handleFile(e.target.files?.[0]);
        e.target.value = "";
    };

    if (image) {
        return (
            <div className="aspect-square bg-white border-2 border-black flex items-center justify-center relative overflow-hidden group">
                <img
                    src={image.url}
                    alt={`Variant image ${slotIndex + 1}`}
                    className="w-full h-full object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => onRemove(slotIndex)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#ba1a1a] text-white p-1.5 hover:scale-110 transform transition-transform"
                        aria-label="Remove variant image"
                    >
                        <span className="material-symbols-outlined text-sm block leading-none">close</span>
                    </button>
                </div>
                {/* Slot badge */}
                <span
                    className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[7px] font-black px-1 py-0.5 uppercase tracking-wider"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    IMG_{String(slotIndex + 1).padStart(2, "0")}
                </span>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`aspect-square border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group ${isDragging
                    ? "border-[#ccff00] bg-[#ccff00]/10 scale-[0.98]"
                    : "border-black/25 bg-[#f3f3f3] hover:border-[#506600] hover:bg-[#f0f5e8]"
                }`}
            aria-label={`Upload variant image ${slotIndex + 1}`}
        >
            <span
                className={`material-symbols-outlined text-2xl mb-1 transition-colors ${isDragging ? "text-[#506600]" : "text-[#5e5e5e] group-hover:text-[#506600]"
                    }`}
            >
                {isDragging ? "file_download" : "add_photo_alternate"}
            </span>
            <span
                className="text-[8px] font-black uppercase tracking-[0.15em] text-[#5e5e5e] group-hover:text-[#506600] transition-colors"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                {isDragging ? "DROP" : "ADD"}
            </span>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
            />
        </button>
    );
};

/* ─────────────────────────────────────────
   Variant Image Grid (drag-and-drop aware)
───────────────────────────────────────── */
const VariantImageGrid = ({ variantIndex, images, onUpdate, setIsFileSizeExceeded }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    const handleUpload = useCallback((slotIndex, imageData) => {
        onUpdate((prev) => {
            const next = { ...prev };
            const slots = [...(next[variantIndex] ?? Array(MAX_VARIANT_IMAGES).fill(null))];
            slots[slotIndex] = imageData;
            next[variantIndex] = slots;
            return next;
        });
    }, [variantIndex, onUpdate]);

    const handleRemove = useCallback((slotIndex) => {
        onUpdate((prev) => {
            const next = { ...prev };
            const slots = [...(next[variantIndex] ?? Array(MAX_VARIANT_IMAGES).fill(null))];
            if (slots[slotIndex]?.url) URL.revokeObjectURL(slots[slotIndex].url);
            slots[slotIndex] = null;
            next[variantIndex] = slots;
            return next;
        });
    }, [variantIndex, onUpdate]);

    // Drag events on the whole grid
    const onDragEnter = (e) => {
        e.preventDefault();
        dragCounter.current += 1;
        setIsDragging(true);
    };
    const onDragLeave = (e) => {
        e.preventDefault();
        dragCounter.current -= 1;
        if (dragCounter.current === 0) setIsDragging(false);
    };
    const onDragOver = (e) => e.preventDefault();
    const onDrop = (e) => {
        e.preventDefault();
        dragCounter.current = 0;
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
        const slots = images ?? Array(MAX_VARIANT_IMAGES).fill(null);
        // Fill first empty slots
        let fileIdx = 0;
        for (let i = 0; i < MAX_VARIANT_IMAGES && fileIdx < files.length; i++) {
            if (!slots[i]) {
                const file = files[fileIdx++];
                if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                    setIsFileSizeExceeded(true);
                    continue;
                }
                const url = URL.createObjectURL(file);
                handleUpload(i, { file, url });
            }
        }
    };

    const slots = images ?? Array(MAX_VARIANT_IMAGES).fill(null);
    const filled = slots.filter(Boolean).length;

    return (
        <div
            className={`mt-3 p-3 border-2 transition-all duration-200 ${isDragging
                    ? "border-[#ccff00] bg-[#ccff00]/5 shadow-[0_0_0_3px_#ccff0033]"
                    : "border-dashed border-black/20 bg-transparent"
                }`}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {/* Header row */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span
                        className="material-symbols-outlined text-[14px] text-[#5e5e5e]"
                        style={{ fontSize: "14px" }}
                    >
                        photo_library
                    </span>
                    <span
                        className="text-[10px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        VARIANT IMAGES
                    </span>
                    <span
                        className="bg-black text-[#ccff00] text-[7px] font-black px-1.5 py-0.5 uppercase tracking-wider"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        {filled}/{MAX_VARIANT_IMAGES}
                    </span>
                </div>
                {isDragging && (
                    <span
                        className="text-[9px] font-black uppercase tracking-[0.2em] text-[#506600] animate-pulse"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        ⬇ DROP TO ADD
                    </span>
                )}
            </div>

            {/* 4-slot grid */}
            <div className="grid grid-cols-4 gap-2">
                {slots.map((img, i) => (
                    <VariantImageSlot
                        key={i}
                        slotIndex={i}
                        image={img}
                        onUpload={handleUpload}
                        onRemove={handleRemove}
                        setIsFileSizeExceeded={setIsFileSizeExceeded}
                        isDragging={isDragging && !img}
                    />
                ))}
            </div>

            {/* Hint */}
            <p
                className="mt-2 text-[8px] font-bold tracking-widest text-[#5e5e5e]/50 uppercase flex items-center gap-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: "10px" }}>info</span>
                Click slots or drag &amp; drop · Max {MAX_FILE_SIZE_MB} MB each · JPG PNG WEBP
            </p>
        </div>
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
   VariantCard — one card per variant entry
   ───────────────────────────────────────── */
const VariantCard = ({
    field,
    index,
    register,
    errors,
    control,
    variantImages,
    setVariantImages,
    setIsFileSizeExceeded,
    removeVariant,
    appendVariant,
    variantFieldsLength,
}) => {
    // Nested field array for attribute key-value pairs
    const {
        fields: attrFields,
        append: appendAttr,
        remove: removeAttr,
    } = useFieldArray({ control, name: `variants.${index}.attribute` });

    return (
        <div className="p-4 border-2 border-black/10 bg-[#f8f8f8] relative">
            {/* VAR badge */}
            <span
                className="absolute top-3 right-3 bg-black text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-[0.2em]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                VAR_{String(index + 1).padStart(2, "0")}
            </span>

            {/* ── Attributes ── */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span
                            className="text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            Attributes
                        </span>
                        <span
                            className="bg-black text-[#ccff00] text-[7px] font-black px-1.5 py-0.5 uppercase tracking-wider"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            MAP
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => appendAttr({ key: "", value: "" })}
                        className="flex items-center gap-1 border border-black px-2 py-1 text-[9px] font-black uppercase tracking-widest hover:bg-[#ccff00] transition-colors"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        <span className="material-symbols-outlined text-xs leading-none">add</span>
                        Add Pair
                    </button>
                </div>

                <div className="space-y-2">
                    {attrFields.map((attrField, attrIdx) => {

                        return (<div key={attrField.id} className="flex items-start gap-2">
                            {/* Key */}
                            <div className="flex-1 flex flex-col gap-0.5">
                                {attrIdx === 0 && (
                                    <span
                                        className="text-[9px] font-black uppercase tracking-widest text-[#5e5e5e]/60 mb-0.5"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        KEY
                                    </span>
                                )}
                                <input
                                    type="text"
                                    {...register(`variants.${index}.attribute.${attrIdx}.key`, {
                                        required: { value: true, message: "key required" },
                                    })}
                                    placeholder="e.g. color"
                                    className={
                                        errors.variants?.[index]?.attribute?.[attrIdx]?.key
                                            ? inputError
                                            : inputBase
                                    }
                                    aria-label={`Attribute key ${attrIdx + 1}`}
                                />
                                <FieldError
                                    message={errors.variants?.[index]?.attribute?.[attrIdx]?.key?.message}
                                />
                            </div>

                            {/* Arrow separator */}
                            <span
                                className="mt-3 text-[#5e5e5e]/40 font-black text-sm select-none shrink-0"
                                style={{ lineHeight: "2.75rem" }}
                            >
                                →
                            </span>

                            {/* Value */}
                            <div className="flex-1 flex flex-col gap-0.5">
                                {attrIdx === 0 && (
                                    <span
                                        className="text-[9px] font-black uppercase tracking-widest text-[#5e5e5e]/60 mb-0.5"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        VALUE
                                    </span>
                                )}
                                <input
                                    type="text"
                                    {...register(`variants.${index}.attribute.${attrIdx}.value`, {
                                        required: { value: true, message: "value required" },
                                    })}
                                    placeholder="e.g. red"
                                    className={
                                        errors.variants?.[index]?.attribute?.[attrIdx]?.value
                                            ? inputError
                                            : inputBase
                                    }
                                    aria-label={`Attribute value ${attrIdx + 1}`}
                                />
                                <FieldError
                                    message={errors.variants?.[index]?.attribute?.[attrIdx]?.value?.message}
                                />
                            </div>

                            {/* Remove pair button */}
                            {attrFields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeAttr(attrIdx)}
                                    className="mt-3 p-2 border border-black/20 text-[#5e5e5e] hover:bg-[#ba1a1a] hover:border-[#ba1a1a] hover:text-white transition-colors shrink-0"
                                    style={{ lineHeight: "1.75rem" }}
                                    aria-label="Remove attribute pair"
                                >
                                    <span className="material-symbols-outlined text-sm leading-none block">
                                        close
                                    </span>
                                </button>
                            )}
                        </div>)
                    })}
                </div>
            </div>

            {/* ── Stock + Price row ── */}
            <div className="grid grid-cols-[1fr_1.6fr_auto] gap-3 mb-1">
                {/* Stock */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                        <label
                            htmlFor={`variant-stock-${field.id}`}
                            className="text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            Stock
                        </label>
                        {errors.variants?.[index]?.stock && (
                            <span
                                className="text-[8px] font-black tracking-[0.15em] uppercase bg-[#ba1a1a] text-white px-1.5 py-0.5"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                REQ
                            </span>
                        )}
                    </div>
                    <input
                        id={`variant-stock-${field.id}`}
                        type="number"
                        min={0}
                        {...register(`variants.${index}.stock`, {
                            required: { value: true, message: "stock is required" },
                            min: { value: 0, message: "cannot be negative" },
                            valueAsNumber: true,
                        })}
                        placeholder="0"
                        className={`${errors.variants?.[index]?.stock ? inputError : inputBase
                            } font-bold`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        aria-invalid={!!errors.variants?.[index]?.stock}
                    />
                    <FieldError message={errors.variants?.[index]?.stock?.message} />
                </div>

                {/* Price Amount */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between mb-1">
                        <label
                            htmlFor={`variant-price-${field.id}`}
                            className="text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e]"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            Price
                        </label>
                        {errors.variants?.[index]?.price?.priceAmount && (
                            <span
                                className="text-[8px] font-black tracking-[0.15em] uppercase bg-[#ba1a1a] text-white px-1.5 py-0.5"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                REQ
                            </span>
                        )}
                    </div>
                    <input
                        id={`variant-price-${field.id}`}
                        type="number"
                        step="0.01"
                        min={0}
                        {...register(`variants.${index}.price.priceAmount`, {
                            required: { value: true, message: "price is required" },
                            min: { value: 0.01, message: "must be > 0" },
                            valueAsNumber: true,
                        })}
                        placeholder="0.00"
                        className={`${errors.variants?.[index]?.price?.priceAmount ? inputError : inputBase
                            } font-bold`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        aria-invalid={!!errors.variants?.[index]?.price?.priceAmount}
                    />
                    <FieldError message={errors.variants?.[index]?.price?.priceAmount?.message} />
                </div>

                {/* Currency */}
                <div className="flex flex-col gap-1 min-w-[80px]">
                    <label
                        htmlFor={`variant-currency-${field.id}`}
                        className="text-[11px] font-black tracking-[0.2em] uppercase text-[#5e5e5e] mb-1"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Currency
                    </label>
                    <div className="relative">
                        <select
                            id={`variant-currency-${field.id}`}
                            {...register(`variants.${index}.price.priceCurrency`)}
                            className={`${inputBase} text-sm font-bold uppercase appearance-none cursor-pointer pr-8`}
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="JPY">JPY</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#1b1b1b] text-sm">
                            unfold_more
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Variant Image Grid ── */}
            <VariantImageGrid
                variantIndex={index}
                images={variantImages[index]}
                onUpdate={setVariantImages}
                setIsFileSizeExceeded={setIsFileSizeExceeded}
            />

            {/* ── Row Actions ── */}
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-black/10">
                {variantFieldsLength > 1 && (
                    <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="flex items-center gap-1 border-2 border-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#ba1a1a] hover:border-[#ba1a1a] hover:text-white transition-colors"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        <span className="material-symbols-outlined text-sm leading-none">delete</span>
                        Remove
                    </button>
                )}
                <button
                    type="button"
                    onClick={() =>
                        appendVariant({
                            attribute: [{ key: "", value: "" }],
                            stock: 0,
                            price: { priceAmount: "", priceCurrency: "INR" },
                            images: [],
                        })
                    }
                    className="flex items-center gap-1 bg-[#ccff00] text-black font-black text-[10px] uppercase tracking-[0.2em] px-3 py-2 hover:bg-[#506600] hover:text-white transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <span className="material-symbols-outlined text-sm leading-none">add</span>
                    Add Variant
                </button>
            </div>
        </div>
    );
};

const ManageForm = ({ onSubmit, onDiscard, onDelete }) => {


    
    // Replace this entire block at the top of ManageForm:
    const { selectedProduct } = useSelector((state) => state.product);
    useEffect(() => {
  if (!selectedProduct) return;
  reset(buildDefaultValues(selectedProduct));

        const existing = (selectedProduct.images ?? []).map((url) => ({ url, file: null }));
        const slots = [...existing];
        while (slots.length < 4) slots.push(null);
        setImages(slots);
        setVariantImages({});
    }, [selectedProduct]);

    // ADD THIS before useForm:
    const buildDefaultValues = (product) => {
        if (!product) return {
            images: [],
            variants: [{ attribute: [{ key: "", value: "" }], stock: 0, price: { priceAmount: "", priceCurrency: "INR" }, images: [] }],
        };
        return {
            title: product.title ?? "",
            description: product.description ?? "",
            stock: product.stock ?? "",
            sku: product.sku ?? "",
            status: product.status ?? "active",
            price: {
                price_Amount: product.price?.amount ?? "",
                price_Currency: product.price?.currency ?? "INR",
            },
            variants: (product.variants ?? []).map((v) => ({
                // Convert { size: "38" } → [{ key: "size", value: "38" }]
                attribute: Object.entries(v.attribute ?? {}).map(([key, value]) => ({ key, value })),
                stock: v.stock ?? 0,
                price: {
                    priceAmount: v.price?.priceAmount ?? "",
                    priceCurrency: v.price?.priceCurrency ?? "INR",
                },
                images: [],
            })),
        };
    };

    const { register, handleSubmit, reset, formState: { errors }, setValue, control } = useForm({
        defaultValues: buildDefaultValues(selectedProduct),
    });


    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({ control, name: "variants" });


    // Replace:
  

    // With:
    const [images, setImages] = useState(() => {
        const existing = (selectedProduct?.images ?? []).map((url) => ({ url, file: null }));
        // Pad to at least 4 slots, max MAX_IMAGES
        const slots = [...existing];
        while (slots.length < 4) slots.push(null);
        return slots;
    });// show 4 slots (grows up to MAX_IMAGES)

    // variantImages: { [variantIndex]: [null | { file, url }, ...4 slots] }
    const [variantImages, setVariantImages] = useState({});

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
            const preparedData = {
                ...data,
                variants: (data.variants ?? []).map((variant, idx) => {
                    // Convert [{key,value}] pairs to a Map-like object
                    const attributeMap = {};
                    (variant.attribute ?? []).forEach(({ key, value }) => {
                        if (key?.trim()) attributeMap[key.trim()] = value?.trim() ?? "";
                    });
                    return {
                        attribute: attributeMap,
                        stock: Number(variant.stock ?? 0),
                        price: {
                            priceAmount: Number(variant.price?.priceAmount ?? 0),
                            priceCurrency: variant.price?.priceCurrency ?? "INR",
                        },
                        images: (variantImages[idx] ?? []).filter(Boolean).map((img) => img.file),
                    };
                }),
            };

            onSubmit(preparedData);
            // Clean up object URLs
            Object.values(variantImages).flat().forEach((img) => {
                if (img?.url) URL.revokeObjectURL(img.url);
            });
            setImages(Array(4).fill(null));
            setVariantImages({});
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

                {/* ── 04 / Variant Config ── */}
                <section className="space-y-6">
                    <SectionHeader
                        num="04"
                        title="Variant Config"
                        subtitle="[ ATTRIBUTES · STOCK · PRICE · IMAGES ]"
                    />
                    <div className="space-y-4">
                        {variantFields.map((field, index) => (
                            <VariantCard
                                key={field.id}
                                field={field}
                                index={index}
                                register={register}
                                errors={errors}
                                control={control}
                                variantImages={variantImages}
                                setVariantImages={setVariantImages}
                                setIsFileSizeExceeded={setIsFileSizeExceeded}
                                removeVariant={removeVariant}
                                appendVariant={appendVariant}
                                variantFieldsLength={variantFields.length}
                            />
                        ))}
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
                        <span>{isSubmitting ? "Updating..." : "Update Product"}</span>
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
                    <button
                        type="button"
                        onClick={onDelete}
                        className="w-full bg-transparent text-black border-2 border-red font-bold text-sm py-4 px-6 uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Delete
                    </button>
                </div>
            </form>
        </>
    );
}

export default ManageForm