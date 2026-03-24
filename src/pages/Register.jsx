import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Sprout, Mail, Lock, User, ArrowRight,
  Wheat, ShoppingCart, Store, Eye, EyeOff, CheckCircle
} from "lucide-react";

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
      0%,100% { transform: translateY(0px) rotate(0deg); }
      50%      { transform: translateY(-14px) rotate(3deg); }
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
    @keyframes popIn {
      0%   { transform: scale(0.85); opacity: 0; }
      100% { transform: scale(1);    opacity: 1; }
    }

    .reg-input {
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
    .reg-input::placeholder { color: #6b8f76; }
    .reg-input:focus {
      border-color: rgba(0,255,136,0.5);
      background: rgba(0,255,136,0.05);
      box-shadow: 0 0 0 3px rgba(0,255,136,0.08);
    }

    .btn-glow {
      width: 100%; padding: 15px;
      border-radius: 12px; border: none; cursor: pointer;
      font-family: 'Manrope', sans-serif;
      font-size: 16px; font-weight: 700;
      background: linear-gradient(135deg, #00ff88, #00c96a);
      color: #030a06;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-glow:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,255,136,0.35);
    }
    .btn-glow:disabled { opacity: 0.6; cursor: not-allowed; }

    .role-btn {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 10px; padding: 20px 12px;
      border-radius: 14px; cursor: pointer;
      border: 1px solid rgba(0,255,136,0.15);
      background: rgba(0,255,136,0.03);
      transition: all 0.2s; flex: 1;
    }
    .role-btn:hover {
      border-color: rgba(0,255,136,0.4);
      background: rgba(0,255,136,0.06);
    }
    .role-btn.active {
      border-color: rgba(0,255,136,0.6);
      background: rgba(0,255,136,0.1);
      box-shadow: 0 0 0 3px rgba(0,255,136,0.08), 0 0 20px rgba(0,255,136,0.08);
    }

    .strength-bar {
      height: 3px; border-radius: 2px;
      flex: 1; transition: background 0.3s;
    }
  `}</style>
);

/* ─── ROLES ──────────────────────────────────────────────────── */
const roles = [
  { value: "farmer", label: "Farmer",  icon: Wheat,        desc: "Sell your harvest"    },
  { value: "buyer",  label: "Buyer",   icon: ShoppingCart, desc: "Buy fresh produce"    },
  { value: "dealer", label: "Dealer",  icon: Store,        desc: "Trade & distribute"   },
];

/* ─── PASSWORD STRENGTH ──────────────────────────────────────── */
const getStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8)              s++;
  if (/[A-Z]/.test(pw))           s++;
  if (/[0-9]/.test(pw))           s++;
  if (/[^A-Za-z0-9]/.test(pw))   s++;
  return s;
};
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ff5555", "#d4a843", "#00c96a", "#00ff88"];

/* ─── LEFT PANEL STEPS ───────────────────────────────────────── */
const steps = [
  { n: "01", title: "Create your account",    desc: "Fill in your name, email & password"   },
  { n: "02", title: "Choose your role",       desc: "Farmer, buyer or dealer"                },
  { n: "03", title: "Verify your email",      desc: "Enter the OTP we send you"              },
  { n: "04", title: "Start trading",          desc: "Access live prices & AI tools instantly" },
];

/* ─── COMPONENT ──────────────────────────────────────────────── */
const Register = () => {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState("farmer");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const navigate = useNavigate();

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5001/api/auth/register", { name, email, password, role });
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
        display: "none", width: "44%",
        background: "var(--bg-card)",
        borderRight: "1px solid rgba(0,255,136,0.1)",
        flexDirection: "column", justifyContent: "space-between",
        padding: "48px", position: "relative", overflow: "hidden"
      }} className="left-panel">
        <style>{`@media(min-width:1024px){ .left-panel{ display:flex !important; } }`}</style>

        {/* Animated grid */}
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
        {/* Glow orb */}
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: 400, height: 400,
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

        {/* Center */}
        <div style={{ position: "relative", zIndex: 2 }}>
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
            fontSize: 34, fontWeight: 800, letterSpacing: "-0.04em",
            lineHeight: 1.15, marginBottom: 14, color: "#e8f5ee"
          }}>
            Join the future<br/>
            <span style={{
              background: "linear-gradient(90deg, #00ff88, #00c96a, #d4a843, #00ff88)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              animation: "shimmer 4s linear infinite"
            }}>of farming.</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 44, maxWidth: 300 }}>
            Get started in minutes. No hidden fees, no paperwork.
          </p>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 11,
                  color: "var(--green-glow)", letterSpacing: "0.05em"
                }}>{s.n}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#e8f5ee", marginBottom: 3 }}>{s.title}</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Already trusted by <span style={{ color: "var(--green-glow)", fontWeight: 700 }}>2.4 lakh+</span> farmers across India.
          </p>
        </div>
      </div>

      {/* ══ RIGHT PANEL — FORM ══ */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", position: "relative", overflowY: "auto"
      }}>
        <div style={{
          position: "absolute", bottom: -80, left: -80,
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 65%)",
          borderRadius: "50%", pointerEvents: "none"
        }}/>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 2, padding: "20px 0" }}
        >
          {/* Mobile logo */}
          <div style={{ marginBottom: 36 }} className="mobile-logo">
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

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: "#e8f5ee", marginBottom: 6 }}>
              Create your account
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Free forever. No credit card required.</p>
          </div>

          {/* Card */}
          <div style={{
            background: "rgba(11,26,16,0.7)",
            border: "1px solid rgba(0,255,136,0.12)",
            borderRadius: 20, padding: "32px 28px",
            backdropFilter: "blur(20px)"
          }}>
            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div style={{ position: "relative", marginBottom: 14 }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                  <User size={17}/>
                </div>
                <input
                  type="text" placeholder="Full name"
                  value={name} onChange={e => setName(e.target.value)}
                  className="reg-input" required autoComplete="name"
                />
              </div>

              {/* Email */}
              <div style={{ position: "relative", marginBottom: 14 }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                  <Mail size={17}/>
                </div>
                <input
                  type="email" placeholder="Email address"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="reg-input" required autoComplete="email"
                />
              </div>

              {/* Password */}
              <div style={{ position: "relative", marginBottom: 8 }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                  <Lock size={17}/>
                </div>
                <input
                  type={showPass ? "text" : "password"} placeholder="Create password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="reg-input" style={{ paddingRight: 46 }}
                  required autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", padding: 0, display: "flex"
                }}>
                  {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>

              {/* Strength bar */}
              {password && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
                    {[1,2,3,4].map(n => (
                      <div key={n} className="strength-bar" style={{
                        background: n <= strength ? strengthColor[strength] : "rgba(255,255,255,0.07)"
                      }}/>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: strengthColor[strength] }}>{strengthLabel[strength]}</p>
                </motion.div>
              )}
              {!password && <div style={{ marginBottom: 20 }}/>}

              {/* Role selector */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>I am a</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {roles.map(r => {
                    const Icon = r.icon;
                    const active = role === r.value;
                    return (
                      <button
                        key={r.value} type="button"
                        onClick={() => setRole(r.value)}
                        className={`role-btn ${active ? "active" : ""}`}
                      >
                        <div style={{
                          width: 38, height: 38, borderRadius: 10,
                          background: active ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${active ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.08)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: active ? "var(--green-glow)" : "var(--text-muted)",
                          transition: "all 0.2s"
                        }}>
                          <Icon size={18}/>
                        </div>
                        <span style={{
                          fontSize: 13, fontWeight: 700,
                          color: active ? "var(--green-glow)" : "var(--text-muted)"
                        }}>{r.label}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.4 }}>{r.desc}</span>
                        {active && (
                          <motion.div
                            layoutId="role-check"
                            style={{ position: "absolute", top: 8, right: 8, color: "var(--green-glow)" }}
                          >
                            <CheckCircle size={14}/>
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
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
                      borderRadius: 10, padding: "12px 14px", marginBottom: 16,
                      color: "#ff8c8c", fontSize: 14
                    }}
                  >{error}</motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn-glow">
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span style={{
                      width: 18, height: 18,
                      border: "2px solid rgba(3,10,6,0.3)", borderTop: "2px solid #030a06",
                      borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block"
                    }}/>
                    Creating account…
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    Create Account <ArrowRight size={17}/>
                  </span>
                )}
              </button>

            </form>
          </div>

          {/* Sign in link */}
          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{
              color: "var(--green-glow)", fontWeight: 700, textDecoration: "none",
              borderBottom: "1px solid rgba(0,255,136,0.3)", paddingBottom: 1
            }}>Sign in</Link>
          </p>

          {/* Terms note */}
          <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
            By registering, you agree to our{" "}
            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "underline" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "underline" }}>Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;