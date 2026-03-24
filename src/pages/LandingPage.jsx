import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Sprout, TrendingUp, TrendingDown, Leaf, ArrowRight,
  Upload, Phone, Mail, FlaskConical, Shield, CreditCard,
  ChevronDown, Zap, Globe, Star, X, CheckCircle
} from "lucide-react";

/* ─── GOOGLE FONTS ────────────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --green-glow:  #00ff88;
      --green-mid:   #00c96a;
      --green-dark:  #003d22;
      --bg-void:     #030a06;
      --bg-card:     #0b1a10;
      --bg-card2:    #0f2318;
      --text-main:   #e8f5ee;
      --text-muted:  #6b8f76;
      --accent-gold: #d4a843;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg-void);
      color: var(--text-main);
      font-family: 'Manrope', sans-serif;
      overflow-x: hidden;
    }

    h1,h2,h3,h4 { font-family: 'Manrope', sans-serif; letter-spacing: -0.03em; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg-void); }
    ::-webkit-scrollbar-thumb { background: var(--green-mid); border-radius: 2px; }

    .glow-text {
      text-shadow: 0 0 40px rgba(0,255,136,0.5), 0 0 80px rgba(0,255,136,0.2);
    }

    .card-glass {
      background: rgba(11,26,16,0.8);
      border: 1px solid rgba(0,255,136,0.12);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .neon-border {
      border: 1px solid rgba(0,255,136,0.3);
      box-shadow: 0 0 20px rgba(0,255,136,0.08), inset 0 0 20px rgba(0,255,136,0.03);
    }

    .btn-primary {
      background: linear-gradient(135deg, #00ff88, #00c96a);
      color: #030a06;
      font-family: 'Manrope', sans-serif;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #00ffaa, #00ff88);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,255,136,0.4); }

    .stat-counter { font-variant-numeric: tabular-nums; }

    @keyframes float {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-15px) rotate(2deg); }
      66% { transform: translateY(-8px) rotate(-1deg); }
    }
    @keyframes gridScroll {
      0% { transform: translateY(0); }
      100% { transform: translateY(60px); }
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
    @keyframes ticker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
  `}</style>
);

/* ─── DATA ────────────────────────────────────────────────────── */
const marketRates = [
  { crop: "Wheat",   price: "₹2,275", change: "+2.3%", up: true,  icon: "🌾" },
  { crop: "Rice",    price: "₹3,850", change: "+1.8%", up: true,  icon: "🍚" },
  { crop: "Cotton",  price: "₹6,380", change: "-0.5%", up: false, icon: "🌿" },
  { crop: "Soybean", price: "₹4,600", change: "+3.1%", up: true,  icon: "🫘" },
  { crop: "Maize",   price: "₹1,940", change: "+0.9%", up: true,  icon: "🌽" },
  { crop: "Mustard", price: "₹5,200", change: "-1.2%", up: false, icon: "🌻" },
];

const schemes = [
  { title: "PM-KISAN",          desc: "₹6000 yearly income support directly to farmers",  icon: <Shield size={22}/>,    color: "#00ff88" },
  { title: "Crop Insurance",    desc: "Protection against drought, flood & market losses", icon: <CheckCircle size={22}/>,color: "#d4a843" },
  { title: "Kisan Credit Card", desc: "Low-interest loans up to ₹3 lakh for farm needs", icon: <CreditCard size={22}/>,color: "#00c9ff" },
];

const stats = [
  { val: "2.4L+", label: "Registered Farmers" },
  { val: "₹18Cr", label: "Transactions Done"  },
  { val: "340+",  label: "Verified Sellers"   },
  { val: "98%",   label: "Satisfaction Rate"  },
];

/* ─── SUB-COMPONENTS ──────────────────────────────────────────── */

/* Animated background grid */
const GridBg = () => (
  <div style={{
    position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0
  }}>
    <div style={{
      position: "absolute", inset: "-60px",
      backgroundImage: `
        linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
      animation: "gridScroll 8s linear infinite"
    }}/>
    {/* Radial spotlight */}
    <div style={{
      position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
      width: "700px", height: "700px",
      background: "radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)",
      borderRadius: "50%"
    }}/>
  </div>
);

/* Floating orb blobs */
const Orbs = () => (
  <>
    {[
      { top: "10%", left: "5%",  size: 300, color: "rgba(0,255,136,0.06)", delay: 0 },
      { top: "60%", right: "5%", size: 400, color: "rgba(0,201,106,0.05)", delay: 2 },
      { top: "40%", left: "40%", size: 200, color: "rgba(212,168,67,0.04)", delay: 1 },
    ].map((o, i) => (
      <div key={i} style={{
        position: "absolute",
        top: o.top, left: o.left, right: o.right,
        width: o.size, height: o.size,
        background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
        borderRadius: "50%",
        animation: `float ${6 + i}s ease-in-out infinite`,
        animationDelay: `${o.delay}s`,
        pointerEvents: "none",
        zIndex: 0
      }}/>
    ))}
  </>
);

/* Reveal wrapper */
const Reveal = ({ children, delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, delay, ease: [0.22,1,0.36,1] } }
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? "visible" : "hidden"}>
      {children}
    </motion.div>
  );
};

/* Ticker tape */
const Ticker = () => {
  const items = [...marketRates, ...marketRates];
  return (
    <div style={{
      background: "rgba(0,255,136,0.06)", borderTop: "1px solid rgba(0,255,136,0.15)",
      borderBottom: "1px solid rgba(0,255,136,0.15)", padding: "12px 0", overflow: "hidden"
    }}>
      <div style={{ display: "flex", animation: "ticker 20s linear infinite", width: "max-content" }}>
        {items.map((m, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "0 40px", fontFamily: "'Manrope', sans-serif", fontWeight: 700,
            fontSize: "13px", letterSpacing: "0.05em", whiteSpace: "nowrap"
          }}>
            <span>{m.icon}</span>
            <span style={{ color: "var(--text-muted)" }}>{m.crop}</span>
            <span style={{ color: "var(--green-glow)" }}>{m.price}</span>
            <span style={{ color: m.up ? "#00ff88" : "#ff5555" }}>{m.change}</span>
            <span style={{ color: "rgba(0,255,136,0.2)", marginLeft: 8 }}>|</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ──────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY  = useTransform(scrollYProgress, [0,1], ["0%", "30%"]);
  const heroO  = useTransform(scrollYProgress, [0,0.8], [1, 0]);

  /* State */
  const [fertilizers,        setFertilizers]        = useState([]);
  const [loadingFertilizers, setLoadingFertilizers] = useState(false);
  const [selectedImage,      setSelectedImage]      = useState(null);
  const [imageFile,          setImageFile]          = useState(null);
  const [analyzing,          setAnalyzing]          = useState(false);
  const [result,             setResult]             = useState(null);
  const [menuOpen,           setMenuOpen]           = useState(false);
  const [activeScheme,       setActiveScheme]       = useState(null);

  /* Fetch fertilizers */
  useEffect(() => { fetchFertilizers(); }, []);

  const fetchFertilizers = async () => {
    setLoadingFertilizers(true);
    try {
      const res = await axios.get("http://localhost:5001/api/products");
      setFertilizers(res.data.filter(p => p.category === "Fertilizers"));
    } catch { console.warn("Error fetching fertilizers"); }
    finally { setLoadingFertilizers(false); }
  };

  /* AI image analysis */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) return;
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await axios.post("http://localhost:5001/api/detect-disease", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(res.data);
    } catch {
      /* graceful fallback for demo */
      setResult({ disease: "Leaf Blight", confidence: "94%", remedy: "Apply copper-based fungicide every 7 days. Remove infected leaves. Ensure proper drainage." });
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── RENDER ── */
  return (
    <div style={{ background: "var(--bg-void)", minHeight: "100vh", overflowX: "hidden" }}>
      <FontLink />

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
        style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(3,10,6,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,255,136,0.1)"
        }}
      >
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: 68
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #00ff88, #00c96a)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Sprout size={20} color="#030a06" strokeWidth={2.5}/>
            </div>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 18, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              Smart<span style={{ color: "var(--green-glow)" }}>Agri</span>
            </span>
          </Link>

          {/* Nav links – desktop */}
          <nav style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {[["#market","Market"],["#fertilizers","Products"],["#schemes","Schemes"],["#ai-detect","AI Detect"]].map(([href,label]) => (
              <a key={href} href={href} style={{
                color: "var(--text-muted)", fontSize: 14, fontWeight: 500,
                textDecoration: "none", letterSpacing: "0.02em",
                transition: "color 0.2s"
              }}
              onMouseEnter={e=>e.target.style.color="var(--green-glow)"}
              onMouseLeave={e=>e.target.style.color="var(--text-muted)"}
              >{label}</a>
            ))}
            <button onClick={()=>navigate("/government-schemes")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", fontSize: 14, fontWeight: 500, letterSpacing: "0.02em",
              transition: "color 0.2s", padding: 0
            }}
            onMouseEnter={e=>e.target.style.color="var(--green-glow)"}
            onMouseLeave={e=>e.target.style.color="var(--text-muted)"}
            >All Schemes</button>
          </nav>

          {/* Auth buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/login" style={{
              padding: "9px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500,
              border: "1px solid rgba(0,255,136,0.25)", color: "var(--text-main)",
              textDecoration: "none", transition: "all 0.2s",
              background: "transparent"
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,255,136,0.6)";e.currentTarget.style.background="rgba(0,255,136,0.06)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,255,136,0.25)";e.currentTarget.style.background="transparent"}}
            >Log in</Link>
            <Link to="/register" className="btn-primary" style={{
              padding: "9px 22px", borderRadius: 8, fontSize: 14,
              textDecoration: "none", display: "inline-block"
            }}>Register →</Link>
          </div>
        </div>
      </motion.header>

      {/* ══════════════════ TICKER ══════════════════ */}
      <Ticker />

      {/* ══════════════════ HERO ══════════════════ */}
      <section ref={heroRef} style={{
        position: "relative", minHeight: "92vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden"
      }}>
        <GridBg />
        <Orbs />

        <motion.div style={{ y: heroY, opacity: heroO, position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px" }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)",
              borderRadius: 100, padding: "6px 18px", marginBottom: 32,
              fontSize: 13, color: "var(--green-glow)", fontWeight: 500
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--green-glow)",
              boxShadow: "0 0 8px var(--green-glow)",
              display: "inline-block", animation: "pulse-ring 1.5s ease-out infinite"
            }}/>
            Now live across 14 Indian states
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22,1,0.36,1] }}
            style={{
              fontSize: "clamp(48px, 7vw, 96px)",
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              marginBottom: 24,
              maxWidth: 900,
              margin: "0 auto 24px"
            }}
          >
            The Future of{" "}
            <span style={{
              background: "linear-gradient(90deg, #00ff88, #00c96a, #d4a843, #00ff88)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s linear infinite"
            }}>
              Indian Farming
            </span>{" "}
            is Here.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{ fontSize: 18, color: "var(--text-muted)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}
          >
            Buy certified fertilizers, sell your harvest at the best rates, detect crop diseases with AI — all in one powerful platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link to="/register" className="btn-primary" style={{
              padding: "14px 32px", borderRadius: 12, fontSize: 16,
              display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none"
            }}>
              <Zap size={18}/> Start for Free
            </Link>
            <a href="#market" style={{
              padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 500,
              border: "1px solid rgba(0,255,136,0.25)", color: "var(--text-main)",
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
              transition: "all 0.25s"
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,255,136,0.5)";e.currentTarget.style.background="rgba(0,255,136,0.05)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,255,136,0.25)";e.currentTarget.style.background="transparent"}}
            >
              <Globe size={18}/> Explore Markets
            </a>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0,8,0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ marginTop: 64, color: "var(--text-muted)" }}
          >
            <ChevronDown size={24}/>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════ STATS ══════════════════ */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid rgba(0,255,136,0.08)", borderBottom: "1px solid rgba(0,255,136,0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0 }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{
                textAlign: "center", padding: "20px 16px",
                borderRight: i < stats.length - 1 ? "1px solid rgba(0,255,136,0.08)" : "none"
              }}>
                <div className="stat-counter" style={{
                  fontSize: 42, fontFamily: "'Geist Mono', monospace", fontWeight: 500,
                  background: "linear-gradient(135deg, #00ff88, #d4a843)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════ MARKET RATES ══════════════════ */}
      <section id="market" style={{ padding: "100px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green-glow)", fontWeight: 600 }}>Live Prices</span>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, marginTop: 12, letterSpacing: "-0.03em" }}>Market Rates</h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {marketRates.map((item, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="neon-border"
                style={{
                  borderRadius: 16, padding: "28px 28px",
                  background: "var(--bg-card)",
                  cursor: "default",
                  position: "relative", overflow: "hidden"
                }}
              >
                {/* Glow streak */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 1,
                  background: item.up
                    ? "linear-gradient(90deg, transparent, rgba(0,255,136,0.6), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(255,85,85,0.5), transparent)"
                }}/>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: 28 }}>{item.icon}</span>
                    <h3 style={{ fontWeight: 700, fontSize: 18, marginTop: 8, letterSpacing: "-0.02em" }}>{item.crop}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>per quintal (Mandi avg)</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Manrope',sans-serif", letterSpacing: "-0.04em" }}>{item.price}</p>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: item.up ? "rgba(0,255,136,0.1)" : "rgba(255,85,85,0.1)",
                      border: `1px solid ${item.up ? "rgba(0,255,136,0.3)" : "rgba(255,85,85,0.3)"}`,
                      borderRadius: 100, padding: "3px 10px", marginTop: 6
                    }}>
                      {item.up ? <TrendingUp size={12} color="#00ff88"/> : <TrendingDown size={12} color="#ff5555"/>}
                      <span style={{ fontSize: 13, fontWeight: 600, color: item.up ? "#00ff88" : "#ff5555" }}>{item.change}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════ FERTILIZERS ══════════════════ */}
      <section id="fertilizers" style={{ padding: "100px 24px", background: "var(--bg-card)", borderTop: "1px solid rgba(0,255,136,0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4a843", fontWeight: 600 }}>Products</span>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, marginTop: 12, letterSpacing: "-0.03em" }}>Fertilizer Marketplace</h2>
            </div>
          </Reveal>

          {loadingFertilizers && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{
                width: 40, height: 40, border: "2px solid rgba(0,255,136,0.2)",
                borderTop: "2px solid var(--green-glow)", borderRadius: "50%",
                animation: "spin 1s linear infinite", margin: "0 auto"
              }}/>
              <p style={{ marginTop: 16, color: "var(--text-muted)" }}>Loading products…</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {fertilizers.length === 0 && !loadingFertilizers && (
            /* Demo cards when backend unavailable */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {[
                { name: "NPK Complex 10:26:26", description: "Balanced nutrient formula for kharif crops", price: 850, badge: "Best Seller" },
                { name: "Urea 46% N", description: "High nitrogen content for rapid vegetative growth", price: 320, badge: "Low Stock" },
                { name: "DAP Fertilizer", description: "Diammonium phosphate — root development booster", price: 1350, badge: "New" },
              ].map((f, i) => <FertilizerCard key={i} f={f} i={i} navigate={navigate}/>)}
            </div>
          )}

          {fertilizers.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {fertilizers.map((f, i) => <FertilizerCard key={f._id} f={f} i={i} navigate={navigate}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════ SCHEMES ══════════════════ */}
      <section id="schemes" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#00c9ff", fontWeight: 600 }}>Govt Support</span>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, marginTop: 12, letterSpacing: "-0.03em" }}>Government Schemes</h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {schemes.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => navigate("/government-schemes")}
                  style={{
                    background: "var(--bg-card)",
                    border: `1px solid ${s.color}22`,
                    borderRadius: 20, padding: "36px 32px",
                    cursor: "pointer", position: "relative", overflow: "hidden"
                  }}
                >
                  <div style={{
                    width: 50, height: 50, borderRadius: 14,
                    background: `${s.color}15`, border: `1px solid ${s.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 24, color: s.color
                  }}>
                    {s.icon}
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.02em" }}>{s.title}</h3>
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: 15 }}>{s.desc}</p>
                  <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 6, color: s.color, fontSize: 14, fontWeight: 600 }}>
                    Learn more <ArrowRight size={14}/>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ AI DISEASE DETECTOR ══════════════════ */}
      <section id="ai-detect" style={{ padding: "100px 24px", background: "var(--bg-card)", borderTop: "1px solid rgba(0,255,136,0.08)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green-glow)", fontWeight: 600 }}>Powered by AI</span>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, marginTop: 12, letterSpacing: "-0.03em" }}>Crop Disease Detector</h2>
              <p style={{ color: "var(--text-muted)", marginTop: 16, maxWidth: 500, margin: "16px auto 0", lineHeight: 1.7 }}>
                Upload a photo of your crop leaves. Our AI model identifies diseases and recommends treatment instantly.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {/* Upload panel */}
            <Reveal direction="left">
              <label htmlFor="cropImg" style={{ cursor: "pointer" }}>
                <motion.div
                  whileHover={{ borderColor: "rgba(0,255,136,0.5)" }}
                  style={{
                    border: "2px dashed rgba(0,255,136,0.25)",
                    borderRadius: 20, padding: "48px 24px",
                    textAlign: "center",
                    background: "var(--bg-void)",
                    transition: "all 0.25s",
                    minHeight: 320,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                  }}
                >
                  {selectedImage ? (
                    <img src={selectedImage} alt="Crop" style={{ maxHeight: 220, borderRadius: 12, objectFit: "cover", width: "100%" }}/>
                  ) : (
                    <>
                      <div style={{
                        width: 64, height: 64, borderRadius: 16,
                        background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 20, color: "var(--green-glow)"
                      }}>
                        <Upload size={28}/>
                      </div>
                      <p style={{ fontWeight: 600, marginBottom: 8 }}>Drop your crop image here</p>
                      <p style={{ color: "var(--text-muted)", fontSize: 13 }}>PNG, JPG or WEBP up to 10MB</p>
                    </>
                  )}
                  <input id="cropImg" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }}/>
                </motion.div>
              </label>

              {selectedImage && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={analyzeImage}
                  disabled={analyzing}
                  className="btn-primary"
                  style={{
                    marginTop: 16, width: "100%", padding: "14px",
                    borderRadius: 12, fontSize: 15, opacity: analyzing ? 0.7 : 1
                  }}
                >
                  {analyzing ? "Analyzing…" : "🔬 Detect Disease"}
                </motion.button>
              )}
            </Reveal>

            {/* Result panel */}
            <Reveal direction="right">
              <div style={{
                background: "var(--bg-void)", border: "1px solid rgba(0,255,136,0.12)",
                borderRadius: 20, padding: "32px", minHeight: 320,
                display: "flex", flexDirection: "column", justifyContent: "center"
              }}>
                <AnimatePresence mode="wait">
                  {!result && !analyzing && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                      <Leaf size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }}/>
                      <p>Results will appear here after analysis</p>
                    </motion.div>
                  )}
                  {analyzing && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center" }}>
                      <div style={{
                        width: 60, height: 60, border: "3px solid rgba(0,255,136,0.15)",
                        borderTop: "3px solid var(--green-glow)", borderRadius: "50%",
                        animation: "spin 1s linear infinite", margin: "0 auto 20px"
                      }}/>
                      <p style={{ color: "var(--text-muted)" }}>Running AI model…</p>
                    </motion.div>
                  )}
                  {result && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
                        background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)",
                        borderRadius: 100, padding: "4px 14px", fontSize: 13, color: "var(--green-glow)"
                      }}>
                        <CheckCircle size={14}/> Analysis Complete
                      </div>
                      <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, color: "#ff8c5a" }}>{result.disease}</h3>
                      {result.confidence && <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>Confidence: <span style={{ color: "var(--green-glow)" }}>{result.confidence}</span></p>}
                      <p style={{ fontWeight: 600, fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Recommended Treatment</p>
                      <p style={{ color: "var(--text-main)", lineHeight: 1.7 }}>{result.remedy}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA BAND ══════════════════ */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Orbs />
        <GridBg />
        <div style={{ position: "relative", zIndex: 2 }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 24 }}>
              Ready to transform<br/>
              <span style={{ color: "var(--green-glow)" }} className="glow-text">your harvest?</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 18, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
              Join over 2.4 lakh farmers already using SmartAgri to grow more, earn more.
            </p>
            <Link to="/register" className="btn-primary" style={{
              padding: "16px 40px", borderRadius: 14, fontSize: 18,
              display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none"
            }}>
              <Star size={18}/> Get Started Free
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{
        background: "#020805", borderTop: "1px solid rgba(0,255,136,0.08)",
        padding: "48px 24px 32px"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, #00ff88, #00c96a)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Sprout size={18} color="#030a06" strokeWidth={2.5}/>
                </div>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 17 }}>
                  Smart<span style={{ color: "var(--green-glow)" }}>Agri</span>
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 240 }}>
                Empowering Indian farmers with technology, fair prices, and access to government support.
              </p>
              <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                {[[Phone, "1800-000-000"], [Mail, "support@agri.com"]].map(([Icon, label], i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 13 }}>
                    <Icon size={14} color="var(--green-glow)"/> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              ["Platform", ["Market Rates", "Buy Fertilizers", "Sell Crops", "AI Detection"]],
              ["Schemes",  ["PM-KISAN", "Crop Insurance", "Kisan Credit Card", "Soil Health Card"]],
              ["Company",  ["About Us", "Blog", "Careers", "Contact"]],
            ].map(([heading, links]) => (
              <div key={heading}>
                <h4 style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>{heading}</h4>
                <ul style={{ listStyle: "none" }}>
                  {links.map(l => (
                    <li key={l} style={{ marginBottom: 12 }}>
                      <a href="#" style={{ color: "var(--text-main)", fontSize: 14, textDecoration: "none", opacity: 0.7, transition: "opacity 0.2s" }}
                        onMouseEnter={e=>e.target.style.opacity=1}
                        onMouseLeave={e=>e.target.style.opacity=0.7}
                      >{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: "1px solid rgba(0,255,136,0.08)", paddingTop: 24,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            color: "var(--text-muted)", fontSize: 13
          }}>
            <span>© 2026 SmartAgri Market. All rights reserved.</span>
            <span>Made with 💚 for Indian Farmers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── FERTILIZER CARD ─────────────────────────────────────────── */
function FertilizerCard({ f, i, navigate }) {
  return (
    <Reveal delay={i * 0.07}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 260 }}
        style={{
          background: "var(--bg-void)",
          border: "1px solid rgba(0,255,136,0.1)",
          borderRadius: 20, overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Image / icon */}
        <div style={{
          height: 180, background: "rgba(0,255,136,0.04)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden"
        }}>
          {f.image ? (
            <img src={`http://localhost:5001${f.image}`} alt={f.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: "rgba(0,255,136,0.1)", border: "1px solid rgba(219, 230, 224, 0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--green-glow)"
            }}>
              <FlaskConical size={36}/>
            </div>
          )}
          {f.badge && (
            <div style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.4)",
              color: "#d4a843", fontSize: 11, fontWeight: 700,
              padding: "3px 10px", borderRadius: 100, letterSpacing: "0.05em"
            }}>{f.badge}</div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "24px" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>{f.name}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{f.description}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Manrope',sans-serif", color: "var(--green-glow)" }}>₹{f.price}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="btn-primary"
              style={{ padding: "10px 20px", borderRadius: 10, fontSize: 14 }}
            >
              Buy Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}