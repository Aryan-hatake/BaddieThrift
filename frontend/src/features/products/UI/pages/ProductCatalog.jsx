import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../../hooks/useProduct";
import CatalogNavbar from "../components/CatalogNavbar";
import CatalogBottomNav from "../components/CatalogBottomNav";
import CatalogProductCard from "../components/CatalogProductCard";

/* ──────────────────────────────────────────
   Filter / Sort config
────────────────────────────────────────── */
const SORT_OPTIONS = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "price_asc", label: "Price: Low → High" },
  { key: "price_desc", label: "Price: High → Low" },
];

/* ──────────────────────────────────────────
   Editorial callout tile (static, no product)
────────────────────────────────────────── */
const EditorialTile = () => (
  <article className="relative border-r-2 border-b-2 border-black bg-[#ccff00] p-6 flex flex-col justify-end min-h-[300px]">
    <div className="absolute top-6 right-6">
      <span
        className="font-['Space_Grotesk'] text-4xl font-black opacity-20 uppercase tracking-tighter"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        EDITORIAL_VOL_01
      </span>
    </div>
    <h2 className="font-['Space_Grotesk'] text-4xl font-black uppercase leading-none tracking-tighter mb-4">
      Style the Streets.
      <br />
      Own the Edit.
    </h2>
    <button
      id="editorial-read-story-btn"
      className="self-start px-6 py-2 border-2 border-black bg-black text-white font-['Space_Grotesk'] text-xs font-black uppercase tracking-widest hover:bg-transparent hover:text-black transition-colors"
    >
      Read Story
    </button>
  </article>
);

/* ──────────────────────────────────────────
   Skeleton grid card
────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="border-r-2 border-b-2 border-black bg-white animate-pulse">
    <div className="aspect-[3/4] bg-[#e2e2e2]" />
    <div className="p-4 flex flex-col gap-2">
      <div className="h-5 bg-[#e2e2e2] w-3/4" />
      <div className="h-3 bg-[#e2e2e2] w-1/2" />
    </div>
  </div>
);

/* ──────────────────────────────────────────
   Main Page
────────────────────────────────────────── */
const ProductCatalog = () => {
  const { handleGetAllProducts } = useProduct();
  const {
    catalogProducts,
    catalogPage,
    catalogTotalPages,
    catalogTotal,
    loading,
  } = useSelector((s) => s.product);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);

  /* Debounce search input */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  /* Fetch whenever filters change */
  const fetchProducts = useCallback(() => {
    handleGetAllProducts({ search: debouncedSearch, sort, page, limit: 12 });
    
  }, [debouncedSearch, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* Pagination helpers */
  const goTo = (p) => {
    if (p < 1 || p > catalogTotalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = (() => {
    const total = catalogTotalPages;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, catalogPage]);
    if (catalogPage > 1) pages.add(catalogPage - 1);
    if (catalogPage < total) pages.add(catalogPage + 1);
    return [...pages].sort((a, b) => a - b);
  })();

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "Newest";

  /* Interleave editorial tile at index 6 if enough products */
  const gridItems = (() => {
    const items = [...(catalogProducts ?? [])];
    if (items.length >= 6) items.splice(6, 0, { __editorial: true });
    return items;
  })();

  return (
    <div className="bg-[#f9f9f9] min-h-screen text-[#1b1b1b]">
      {/* ── Navbar ── */}
      <CatalogNavbar />

      <main className="min-h-screen">
        {/* ── Hero ── */}
        <section className="relative border-b-2 border-black p-6 md:p-12 overflow-hidden bg-[#f9f9f9]">
          <div className="flex flex-col md:flex-row justify-between items-baseline gap-4">
            <h1
              className="font-['Space_Grotesk'] text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-4"
            >
              Spring<br />Drop_25
            </h1>
            <div className="max-w-xs">
              <p className="font-['Inter'] text-sm uppercase tracking-wider font-semibold mb-2">
                Secondhand wear for the concrete landscape.
              </p>
              <p className="font-['Inter'] text-xs text-[#5e5e5e] leading-relaxed">
                Pre-loved garments meet brutalist silhouettes. Engineered for
                durability, styled for the edit.
              </p>
              {catalogTotal > 0 && (
                <p
                  className="mt-3 font-['Space_Grotesk'] text-[10px] font-black text-[#506600] uppercase tracking-[0.2em]"
                >
                  {catalogTotal} items available
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── Filters & Sort Bar ── */}
        <section className="sticky top-[73px] z-50 bg-[#f3f3f3] border-b-2 border-black px-4 md:px-6 py-3 flex flex-wrap justify-between items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <input
              id="catalog-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white border-2 border-black px-4 py-2 pr-10 font-['Inter'] text-xs focus:outline-none focus:border-[#506600] placeholder:text-[#5e5e5e] transition-colors"
            />
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#1b1b1b] text-lg">
              search
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-['Space_Grotesk'] text-[10px] font-black uppercase tracking-widest text-[#5e5e5e] hidden sm:block">
              Sort by:
            </span>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                id="catalog-sort-btn"
                onClick={() => setSortOpen((p) => !p)}
                className="px-4 py-2 border-2 border-black font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest hover:bg-[#ccff00] transition-colors flex items-center gap-2 bg-white"
              >
                {currentSortLabel}
                <span className="material-symbols-outlined text-sm">
                  {sortOpen ? "expand_less" : "expand_more"}
                </span>
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border-2 border-black z-50 min-w-[180px] shadow-[4px_4px_0px_#1b1b1b]">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      id={`sort-${opt.key}`}
                      onClick={() => {
                        setSort(opt.key);
                        setPage(1);
                        setSortOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest transition-colors border-b border-black/10 last:border-0 ${
                        sort === opt.key
                          ? "bg-[#ccff00] text-black"
                          : "hover:bg-[#f3f3f3]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Product Grid ── */}
        <section
          className="grid grid-cols-2 md:grid-cols-4"
          onClick={() => sortOpen && setSortOpen(false)}
        >
          {/* Loading skeleton */}
          {loading &&
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

          {/* Loaded items */}
          {!loading &&
            gridItems.map((item, idx) =>
              item.__editorial ? (
                <EditorialTile key="editorial" />
              ) : (
                <CatalogProductCard key={item._id ?? idx} product={item} />
              )
            )}

          {/* Empty state */}
          {!loading && catalogProducts?.length === 0 && (
            <div className="col-span-2 md:col-span-4 border-b-2 border-black bg-white p-16 flex flex-col items-center justify-center gap-4 text-center">
              <span className="material-symbols-outlined text-5xl text-[#5e5e5e]">
                inventory_2
              </span>
              <p
                className="font-['Space_Grotesk'] text-sm font-black uppercase tracking-widest text-[#5e5e5e]"
              >
                {debouncedSearch ? "NO_RESULTS_FOUND" : "CATALOG_EMPTY"}
              </p>
              <p className="font-['Inter'] text-xs text-[#5e5e5e]">
                {debouncedSearch
                  ? "Try a different search term"
                  : "Check back soon — new arrivals on the way."}
              </p>
              {debouncedSearch && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearch("")}
                  className="mt-2 px-6 py-3 border-2 border-black font-['Space_Grotesk'] text-xs font-black uppercase tracking-widest hover:bg-[#ccff00] transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </section>

        {/* ── Pagination ── */}
        {!loading && catalogTotalPages > 1 && (
          <div className="flex border-b-2 border-black h-20 items-stretch bg-[#f9f9f9]">
            <button
              id="catalog-prev-btn"
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="flex-1 border-r-2 border-black flex items-center justify-center font-['Space_Grotesk'] font-black text-sm uppercase tracking-widest hover:bg-[#e8e8e8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <div className="hidden md:flex flex-[3] items-center justify-center gap-6 font-['Space_Grotesk'] font-black text-sm">
              {pageNumbers.map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && p - arr[idx - 1] > 1 && (
                    <span className="text-[#5e5e5e]">...</span>
                  )}
                  <button
                    id={`page-${p}-btn`}
                    onClick={() => goTo(p)}
                    className={`transition-colors px-1 ${
                      p === catalogPage
                        ? "text-[#506600] underline decoration-4 underline-offset-8"
                        : "hover:text-[#506600] cursor-pointer"
                    }`}
                  >
                    {String(p).padStart(2, "0")}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <button
              id="catalog-next-btn"
              onClick={() => goTo(page + 1)}
              disabled={page === catalogTotalPages}
              className="flex-1 flex items-center justify-center font-['Space_Grotesk'] font-black text-sm uppercase tracking-widest bg-[#ccff00] text-black hover:bg-[#506600] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-black text-white p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="font-['Space_Grotesk'] text-xl font-black uppercase tracking-tighter mb-6">
              BADDIE THRIFT
            </h4>
            <p className="font-['Inter'] text-xs text-[#5e5e5e] leading-relaxed max-w-xs">
              A digital catalog of pre-loved structural garments. Curating the
              edge of modern streetwear for the metropolitan citizen.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-['Space_Grotesk'] text-xs font-black uppercase tracking-widest text-[#506600]">
                Catalog
              </span>
              {["New Arrivals", "Top Sellers", "Collaborations"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="font-['Inter'] text-xs hover:underline decoration-[#506600] underline-offset-4"
                >
                  {l}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-['Space_Grotesk'] text-xs font-black uppercase tracking-widest text-[#506600]">
                Support
              </span>
              {["Shipping", "Returns", "Contact"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="font-['Inter'] text-xs hover:underline decoration-[#506600] underline-offset-4"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="font-['Space_Grotesk'] text-xs font-black uppercase tracking-widest text-[#506600]">
              Newsletter
            </span>
            <div className="flex gap-2">
              <input
                id="footer-email-input"
                className="flex-1 bg-transparent border-b-2 border-white text-white font-['Space_Grotesk'] text-xs focus:outline-none focus:border-[#ccff00] p-2 placeholder:text-[#5e5e5e]"
                placeholder="EMAIL ADDRESS"
                type="email"
              />
              <button
                id="footer-join-btn"
                className="bg-[#ccff00] text-black px-6 py-2 font-['Space_Grotesk'] text-xs font-black uppercase hover:bg-[#506600] hover:text-white transition-colors"
              >
                Join
              </button>
            </div>
            <div className="flex gap-4">
              <span className="material-symbols-outlined cursor-pointer hover:text-[#ccff00] transition-colors">
                share
              </span>
              <span className="material-symbols-outlined cursor-pointer hover:text-[#ccff00] transition-colors">
                language
              </span>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-[#5e5e5e]/30 flex justify-between items-center">
          <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.3em] text-[#5e5e5e]">
            © 2025 BADDIE THRIFT ARCHIVE
          </span>
          <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.3em] text-[#5e5e5e]">
            BRUTALIST_V1.0
          </span>
        </div>
      </footer>

      {/* ── Mobile spacing + Bottom Nav ── */}
      <div className="h-20 md:hidden" />
      <CatalogBottomNav activePath="/catalog" />
    </div>
  );
};

export default ProductCatalog;
