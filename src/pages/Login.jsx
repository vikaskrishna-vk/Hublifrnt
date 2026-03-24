import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Sprout, Mail, Lock, ArrowRight, Eye, EyeOff, Leaf, TrendingUp, Shield } from "lucide-react";

/* ─── STYLES ─────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --green-glow:  #00ff88;
      --green-mid:   #00c96a;
      --bg-void:     #030a06;
      --bg-card:     #0b1a10;
      --text-main:   #e8f5ee;
      --text-muted:  #6b8f76;
    }

    body { font-family: 'Manrope', sans-serif; }

    @keyframes float {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-12px); }
    }
    @keyframes gridScroll {
      0%   { transform: translateY(0); }
      100% { transform: translateY(60px); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .login-input {
      width: 100%;
      background: rgba(0,255,136,0.03);
      border: 1px solid rgba(0,255,136,0.15);
      border-radius: 12px;
      padding: 14px 16px 14px 46px;
      font-family: 'Manrope', sans-serif;
      font-size: 15px;
      color: #e8f5ee;
      outline: none;
      transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    }
    .login-input::placeholder { color: #6b8f76; }
    .login-input:focus {
      border-color: rgba(0,255,136,0.5);
      background: rgba(0,255,136,0.05);
      box-shadow: 0 0 0 3px rgba(0,255,136,0.08);
    }

    .btn-glow {
      width: 100%;
      padding: 15px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      font-family: 'Manrope', sans-serif;
      font-size: 16px;
      font-weight: 700;
      background: linear-gradient(135deg, #00ff88, #00c96a);
      color: #030a06;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-glow:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,255,136,0.35);
    }
    .btn-glow:active:not(:disabled) { transform: translateY(0); }
    .btn-glow:disabled { opacity: 0.6; cursor: not-allowed; }
  `}</style>
);

/* ─── LEFT PANEL FEATURES ────────────────────────────────────── */
const features = [
  { icon: <TrendingUp size={16}/>, text: "Live mandi prices across India"   },
  { icon: <Leaf       size={16}/>, text: "AI-powered crop disease detection" },
  { icon: <Shield     size={16}/>, text: "Govt scheme eligibility checker"   },
];

/* ─── COMPONENT ──────────────────────────────────────────────── */
const Login = () => {
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await axios.post("http://localhost:5001/api/auth/login", { email, password });
      const data = res.data;
      localStorage.setItem("token", data.token);
      const roleRoutes = { farmer: "/farmer", buyer: "/buyer", dealer: "/dealer", admin: "/admin" };
      navigate(roleRoutes[data.user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "var(--bg-void)", fontFamily: "'Manrope', sans-serif"
    }}>
      <Styles />

      {/* ══ LEFT PANEL ══ */}
      <div style={{
        display: "none",
        width: "45%",
        background: "var(--bg-card)",
        borderRight: "1px solid rgba(0,255,136,0.1)",
        position: "relative", overflow: "hidden",
        flexDirection: "column", justifyContent: "space-between",
        padding: "48px"
      }}
      className="left-panel"
      >
        <style>{`@media(min-width:1024px){ .left-panel{ display:flex !important; } }`}</style>

        {/* Grid bg */}
        <div style={{
          position: "absolute", inset: "-60px",
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "gridScroll 10s linear infinite",
          pointerEvents: "none"
        }}/>
        {/* Radial glow */}
        <div style={{
          position: "absolute", bottom: "-100px", left: "-100px",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 65%)",
          borderRadius: "50%", pointerEvents: "none"
        }}/>

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: "linear-gradient(135deg, #00ff88, #00c96a)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Sprout size={20} color="#030a06" strokeWidth={2.5}/>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#e8f5ee", letterSpacing: "-0.02em" }}>
              Smart<span style={{ color: "var(--green-glow)" }}>Agri</span>
            </span>
          </Link>
        </div>

        {/* Center content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Floating icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 32, animation: "float 5s ease-in-out infinite",
            color: "var(--green-glow)"
          }}>
            <Sprout size={32}/>
          </div>

          <h2 style={{
            fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em",
            lineHeight: 1.15, marginBottom: 16, color: "#e8f5ee"
          }}>
            Grow smarter.<br/>
            <span style={{
              background: "linear-gradient(90deg, #00ff88, #00c96a, #d4a843, #00ff88)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              animation: "shimmer 4s linear infinite"
            }}>Earn better.</span>
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 40, maxWidth: 320 }}>
            India's most trusted platform connecting farmers, dealers, and buyers through technology.
          </p>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--green-glow)", flexShrink: 0
                }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom stat */}
        <div style={{
          position: "relative", zIndex: 2,
          display: "flex", gap: 32
        }}>
          {[["2.4L+","Farmers"],["340+","Dealers"],["98%","Satisfaction"]].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--green-glow)" }}>{val}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT PANEL — FORM ══ */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", position: "relative"
      }}>
        {/* Subtle top-right glow */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 65%)",
          borderRadius: "50%", pointerEvents: "none"
        }}/>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 2 }}
        >
          {/* Mobile logo */}
          <div style={{ marginBottom: 40 }} className="mobile-logo">
            <style>{`@media(min-width:1024px){ .mobile-logo{ display:none; } }`}</style>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #00ff88, #00c96a)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Sprout size={18} color="#030a06" strokeWidth={2.5}/>
              </div>
              <span style={{ fontWeight: 800, fontSize: 17, color: "#e8f5ee" }}>
                Smart<span style={{ color: "var(--green-glow)" }}>Agri</span>
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.04em", color: "#e8f5ee", marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Sign in to your SmartAgri account</p>
          </div>

          {/* Form card */}
          <div style={{
            background: "rgba(11,26,16,0.7)",
            border: "1px solid rgba(0,255,136,0.12)",
            borderRadius: 20, padding: "36px 32px",
            backdropFilter: "blur(20px)"
          }}>
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ position: "relative", marginBottom: 16 }}>
                <div style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-muted)", pointerEvents: "none"
                }}>
                  <Mail size={17}/>
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="login-input"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div style={{ position: "relative", marginBottom: 24 }}>
                <div style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-muted)", pointerEvents: "none"
                }}>
                  <Lock size={17}/>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="login-input"
                  style={{ paddingRight: 46 }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", padding: 0, display: "flex"
                  }}
                >
                  {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      background: "rgba(255,85,85,0.08)", border: "1px solid rgba(255,85,85,0.25)",
                      borderRadius: 10, padding: "12px 14px", marginBottom: 20,
                      color: "#ff8c8c", fontSize: 14
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn-glow">
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span style={{
                      width: 18, height: 18,
                      border: "2px solid rgba(3,10,6,0.3)", borderTop: "2px solid #030a06",
                      borderRadius: "50%", animation: "spin 0.8s linear infinite",
                      display: "inline-block"
                    }}/>
                    Signing in…
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    Sign In <ArrowRight size={17}/>
                  </span>
                )}
              </button>

            </form>
          </div>

          {/* Divider + register link */}
          <p style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{
              color: "var(--green-glow)", fontWeight: 700, textDecoration: "none",
              borderBottom: "1px solid rgba(0,255,136,0.3)", paddingBottom: 1
            }}>
              Create account
            </Link>
          </p>

          {/* Role hint */}
          <div style={{
            marginTop: 32, padding: "16px 20px",
            background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.1)",
            borderRadius: 12
          }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Login as</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Farmer","Buyer","Dealer","Admin"].map(role => (
                <span key={role} style={{
                  fontSize: 12, padding: "4px 12px", borderRadius: 100,
                  background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.18)",
                  color: "var(--green-glow)", fontWeight: 600
                }}>{role}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;