import React from "react";
import { useNavigate } from "react-router-dom";

import SellerBottomNav from "../components/SellerBottomNav";
import CreateProductForm from "../components/CreateProductForm";
import { useProduct } from "../../hooks/useProduct";



const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();
  /* ── Submit handler: wire up to your API later ── */
  const handleSubmit = async (data) => {

    handleCreateProduct(data);
    // navigate("/seller/inventory");
  };

  const handleDiscard = () => {
    navigate(-1);
  };

  

  /* ── Live uptime clock (cosmetic, matches design) ── */
  const [uptime, setUptime] = React.useState("000:00:00");
  React.useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(3, "0");
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const s = String(elapsed % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ── Grain overlay (matches global App.css) ── */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Main Canvas ── */}
      <main
        className="max-w-2xl mx-auto px-6 pt-8 pb-32 relative"
        style={{ minHeight: "max(884px, 100dvh)" }}
      >
        {/* ── Header & Status Metadata ── */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1
              className="text-5xl font-black tracking-tighter leading-none mb-2 uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              CREATE
              <br />
              NEW_ITEM
            </h1>
            <p
              className="text-[10px] text-[#5e5e5e] font-bold tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ID_REF: BT-ENTRY-001 // LOC: SELLER_DASHBOARD
            </p>
          </div>

          <div className="text-right">
            <p
              className="text-[10px] font-bold tracking-widest text-[#506600]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              SYSTEM_STATUS: NOMINAL
            </p>
            <p
              className="text-[10px] text-[#5e5e5e] font-bold tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              UPTIME: {uptime}
            </p>
          </div>
        </header>

        {/* ── Form ── */}
        <CreateProductForm onSubmit={handleSubmit} onDiscard={handleDiscard} />
      </main>

      {/* ── Mobile Bottom Nav ── */}
  
    </>
  );
};

export default CreateProduct;
