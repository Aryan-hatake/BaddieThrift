import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥" };
const sym = (c) => CURRENCY_SYMBOLS[c] ?? c ?? "₹";

const formatAmount = (amount, currency) => {
  if (!amount) return "—";
  // Razorpay amounts are in paise (smallest unit); convert to main unit
  const divisor = currency === "JPY" ? 1 : 100;
  return Number(amount / divisor).toLocaleString("en-IN");
};

const formatDate = (isoString) => {
  if (!isoString) return new Date().toISOString().replace("T", " // ").slice(0, 22) + " UTC";
  return new Date(isoString).toISOString().replace("T", " // ").slice(0, 22) + " UTC";
};

/* ─────────────────────────────────────────
   Scanline overlay (CSS-in-JS free)
───────────────────────────────────────── */
const scanlineStyle = {
  background:
    "linear-gradient(to bottom, rgba(204,255,0,0.05) 50%, rgba(0,0,0,0) 50%)",
  backgroundSize: "100% 4px",
};

/* ─────────────────────────────────────────
   Log line component
───────────────────────────────────────── */
const LogLine = ({ text }) => (
  <div className="flex gap-4">
    <span
      className="font-bold"
      style={{ color: "#506600", fontFamily: "monospace" }}
    >
      [SYS]
    </span>
    <span style={{ fontFamily: "monospace" }}>{text}</span>
  </div>
);

/* ─────────────────────────────────────────
   Main OrderSuccess Page
───────────────────────────────────────── */
const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pulseRef = useRef(null);

  // Payment data passed from Cart.jsx via navigate state
  const paymentData = location.state?.paymentData ?? {};
  const {
    orderId,
    paymentId,
    amount,
    currency = "INR",
    createdAt,
  } = paymentData;

  // Redirect to home if page accessed directly without payment data
  useEffect(() => {
    if (!orderId && !paymentId) {
      // Allow dev preview — don't hard-redirect in development
      console.warn(
        "[OrderSuccess] No payment data found in router state. Arrived directly?"
      );
    }
  }, [orderId, paymentId]);

  const displayOrderId = orderId ?? "order_XXXXXXXXXX";
  const displayPaymentId = paymentId ?? "pay_XXXXXXXXXX";
  const displayAmount = amount
    ? `${sym(currency)}${formatAmount(amount, currency)}`
    : "—";
  const displayDate = formatDate(createdAt);
  const refId = displayOrderId.slice(-10).toUpperCase();

  return (
    <div
      className="bg-[#f9f9f9] min-h-screen text-[#1b1b1b]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;900&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
        }
        @keyframes baddieGlow {
          0%, 100% { box-shadow: 8px 8px 0px 0px #1b1b1b; }
          50%       { box-shadow: 8px 8px 0px 0px #506600; }
        }
        .receipt-card { animation: baddieGlow 3s ease-in-out infinite; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        .pulse-dot { animation: pulse-dot 1.4s ease-in-out infinite; }
      `}</style>

      <main className="min-h-screen flex flex-col">
        <div
          className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden w-full py-12 md:py-20"
        >
          {/* Background watermark */}
          <div
            className="absolute top-0 right-0 p-8 leading-none select-none pointer-events-none"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(60px, 10vw, 120px)",
              fontWeight: 900,
              opacity: 0.03,
            }}
          >
            PROTOCOL<br />SECURED
          </div>

          {/* Receipt Card */}
          <div
            className="receipt-card w-full bg-white relative z-10"
            style={{
              maxWidth: "672px",
              border: "2px solid #1b1b1b",
            }}
          >
            {/* ── Header Status Bar ── */}
            <div
              className="p-4 flex justify-between items-center"
              style={{ backgroundColor: "#1b1b1b", color: "#f9f9f9" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="pulse-dot w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#ccff00" }}
                />
                <span
                  className="text-sm font-bold uppercase tracking-widest"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  STATUS // PROTOCOL_OK
                </span>
              </div>
              <div
                className="text-xs opacity-60"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                REF_ID: #{refId}
              </div>
            </div>

            {/* ── Hero Headline ── */}
            <div
              className="p-6 md:p-10"
              style={{ borderBottom: "2px solid #1b1b1b" }}
            >
              <h1
                className="uppercase leading-none tracking-tighter mb-2"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(2.5rem, 7vw, 4rem)",
                }}
              >
                VAULT_ENTRY<br />_SECURED
              </h1>
              <p
                className="text-sm uppercase font-medium"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "#5e5e5e",
                  letterSpacing: "0.3em",
                }}
              >
                Transaction validation finalized successfully.
              </p>
            </div>

            {/* ── ID Data Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div
                className="p-6 flex flex-col gap-1"
                style={{ borderBottom: "2px solid #1b1b1b" }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "10px",
                    color: "#5e5e5e",
                    letterSpacing: "0.15em",
                  }}
                >
                  Order ID
                </span>
                <span
                  className="font-bold text-lg break-all"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {displayOrderId}
                </span>
              </div>
              <div
                className="p-6 flex flex-col gap-1"
                style={{ borderBottom: "2px solid #1b1b1b" }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "10px",
                    color: "#5e5e5e",
                    letterSpacing: "0.15em",
                  }}
                >
                  Payment ID
                </span>
                <span
                  className="font-bold text-lg break-all"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {displayPaymentId}
                </span>
              </div>
            </div>

            {/* ── Technical Log ── */}
            <div
              className="p-6 text-xs flex flex-col gap-2"
              style={{
                backgroundColor: "#f3f3f3",
                borderTop: "2px solid #1b1b1b",
                borderBottom: "2px solid #1b1b1b",
                color: "#444933",
              }}
            >
              <LogLine text="Initializing secure handshake... SUCCESS" />
              <LogLine text="Payment authorization level 7 granted." />
              <LogLine text={`Date Stamp: ${displayDate}`} />
            </div>

            {/* ── Price Section ── */}
            <div
              className="p-6 md:p-10 flex flex-col md:flex-row items-baseline justify-between gap-4"
            >
              <div className="flex flex-col">
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "10px",
                    color: "#5e5e5e",
                    letterSpacing: "0.15em",
                  }}
                >
                  Total Investment
                </span>
                <div
                  className="font-black tracking-tighter"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(2.5rem, 8vw, 4rem)",
                  }}
                >
                  {displayAmount}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["Tax_Paid", "Digital_Auth", "Verified"].map((tag) => (
                  <div
                    key={tag}
                    className="px-2 py-1 font-bold uppercase"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "10px",
                      backgroundColor: "#1b1b1b",
                      color: "#ccff00",
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Visual Confirmation Banner ── */}
            <div
              className="relative h-48 w-full overflow-hidden group"
              style={{ borderTop: "2px solid #1b1b1b" }}
            >
              {/* Gradient background (no external image dependency) */}
              <div
                className="w-full h-full transition-all duration-700"
                style={{
                  background:
                    "linear-gradient(135deg, #0a0a0a 0%, #1b1b1b 40%, #2a3500 70%, #1b1b1b 100%)",
                  filter: "grayscale(1) brightness(0.5)",
                }}
              />
              {/* Pattern overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={scanlineStyle}
              />
              {/* Neon grid lines */}
              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                preserveAspectRatio="none"
              >
                {[0, 25, 50, 75, 100].map((x) => (
                  <line
                    key={`v${x}`}
                    x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%"
                    stroke="#ccff00" strokeWidth="0.5"
                  />
                ))}
                {[0, 33, 66, 100].map((y) => (
                  <line
                    key={`h${y}`}
                    x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
                    stroke="#ccff00" strokeWidth="0.5"
                  />
                ))}
              </svg>
              {/* ACCESS_GRANTED badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="p-4 font-black text-xl uppercase italic"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    backgroundColor: "#ccff00",
                    color: "#1b1b1b",
                    border: "2px solid #1b1b1b",
                    boxShadow: "4px 4px 0px 0px #1b1b1b",
                  }}
                >
                  ACCESS_GRANTED
                </div>
              </div>
            </div>

            {/* ── CTA Footer ── */}
            <div
              className="p-6 md:p-10"
              style={{ backgroundColor: "#f9f9f9" }}
            >
              <button
                id="order-success-continue-btn"
                onClick={() => navigate("/")}
                className="w-full group relative flex items-center justify-center gap-4 font-black text-2xl uppercase tracking-tighter transition-colors active:translate-y-px active:translate-x-px"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  backgroundColor: "#ccff00",
                  color: "#1b1b1b",
                  border: "2px solid #1b1b1b",
                  padding: "24px",
                  boxShadow: "6px 6px 0px 0px #1b1b1b",
                  transition: "background-color 0.15s, box-shadow 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1b1b1b";
                  e.currentTarget.style.color = "#ccff00";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ccff00";
                  e.currentTarget.style.color = "#1b1b1b";
                }}
              >
                <span>CONTINUE_TO_VAULT</span>
                <span className="material-symbols-outlined text-3xl">
                  arrow_forward
                </span>
              </button>

              {/* Sub-actions */}
              <div
                className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                style={{ opacity: 0.4 }}
              >
                <div
                  className="uppercase tracking-widest"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "10px",
                  }}
                >
                  BADDIE THRIFT © 2026 // ALL RIGHTS RESERVED
                </div>
                <div className="flex gap-4">
                  <button
                    title="Print receipt"
                    onClick={() => window.print()}
                    className="material-symbols-outlined text-sm"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    print
                  </button>
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span className="material-symbols-outlined text-sm">share</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Utility Links ── */}
          <div className="mt-12 flex flex-wrap gap-8 justify-center">
            {[
              { label: "Support_Center", href: "#" },
              { label: "Download_Invoice", href: "#" },
              { label: "View_Collection", onClick: () => navigate("/") },
            ].map(({ label, href, onClick }) => (
              <a
                key={label}
                href={href ?? "#"}
                onClick={onClick}
                className="uppercase font-bold transition-all"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  borderBottom: "2px solid transparent",
                  textDecoration: "none",
                  color: "#1b1b1b",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderBottomColor = "#1b1b1b")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderBottomColor = "transparent")
                }
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Floating decorative watermark */}
      <div
        className="fixed bottom-10 left-10 pointer-events-none hidden xl:block"
        style={{ opacity: 0.2 }}
      >
        <div
          className="uppercase tracking-tighter"
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            transform: "rotate(90deg)",
            transformOrigin: "left",
          }}
        >
          TRANS_LOG_B882_X_A1
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;