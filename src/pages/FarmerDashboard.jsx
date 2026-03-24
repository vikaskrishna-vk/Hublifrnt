import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import {
  LayoutDashboard, PlusCircle, List, Sprout,
  FlaskConical, Leaf, MessageCircle, Gavel,
  TrendingUp, CheckCircle, Clock, X, Phone,
  MapPin, CreditCard, Wallet, User, Wheat,
  ChevronRight, RefreshCw, ArrowUpRight, Bell,
  Package, AlertCircle
} from "lucide-react"

/* ─── STYLES ─────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --green-glow: #00ff88; --green-mid: #00c96a;
      --bg-void: #030a06; --bg-card: #0b1a10; --bg-card2: #0f2318;
      --text-main: #e8f5ee; --text-muted: #6b8f76;
      --gold: #d4a843; --blue: #00c9ff; --red: #ff5555; --purple: #c084fc;
    }
    body { font-family: 'Manrope', sans-serif; background: var(--bg-void); color: var(--text-main); }
    .mono { font-family: 'Geist Mono', monospace; }
    @keyframes gridScroll { 0%{transform:translateY(0)} 100%{transform:translateY(60px)} }
    @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:0.35} }
    @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes spin       { to{transform:rotate(360deg)} }
    @keyframes fadeIn     { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg-void); }
    ::-webkit-scrollbar-thumb { background: var(--green-mid); border-radius: 2px; }

    .form-input {
      width: 100%; background: rgba(0,255,136,0.03);
      border: 1px solid rgba(0,255,136,0.15); border-radius: 11px;
      padding: 13px 16px; font-family: 'Manrope', sans-serif;
      font-size: 14px; color: var(--text-main); outline: none;
      transition: all 0.25s; margin-bottom: 12px;
    }
    .form-input::placeholder { color: var(--text-muted); }
    .form-input:focus {
      border-color: rgba(0,255,136,0.5); background: rgba(0,255,136,0.05);
      box-shadow: 0 0 0 3px rgba(0,255,136,0.07);
    }
    .form-label {
      font-size: 11px; color: var(--text-muted);
      letter-spacing: 0.1em; text-transform: uppercase;
      font-weight: 700; display: block; margin-bottom: 6px;
    }
    .btn-primary {
      width: 100%; padding: 14px; border-radius: 12px; border: none; cursor: pointer;
      font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 800;
      background: linear-gradient(135deg, #00ff88, #00c96a); color: #030a06;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,255,136,0.3); }
    .card { background: var(--bg-card); border: 1px solid rgba(0,255,136,0.1); border-radius: 18px; }
    .stat-card {
      background: var(--bg-card); border-radius: 16px;
      padding: 24px; position: relative; overflow: hidden;
      transition: all 0.25s; border: 1px solid rgba(0,255,136,0.08);
    }
    .stat-card:hover { border-color: rgba(0,255,136,0.22); transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
    .fertilizer-card {
      background: var(--bg-card); border: 1px solid rgba(0,255,136,0.08);
      border-radius: 16px; overflow: hidden; transition: all 0.25s; position: relative;
    }
    .fertilizer-card:hover { border-color: rgba(0,255,136,0.28); transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); }
    .auction-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-radius: 12px;
      background: rgba(0,255,136,0.02); border: 1px solid rgba(0,255,136,0.07);
      transition: all 0.2s;
    }
    .auction-row:hover { background: rgba(0,255,136,0.05); border-color: rgba(0,255,136,0.18); }
    .tag-live {
      display: inline-flex; align-items: center; gap: 5px;
      background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.25);
      color: var(--green-glow); font-size: 10px; font-weight: 700;
      padding: 3px 9px; border-radius: 100px; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .tag-closed {
      display: inline-flex; align-items: center; gap: 5px;
      background: rgba(255,85,85,0.1); border: 1px solid rgba(255,85,85,0.25);
      color: var(--red); font-size: 10px; font-weight: 700;
      padding: 3px 9px; border-radius: 100px; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .payment-option {
      flex: 1; padding: 14px; border-radius: 12px; cursor: pointer;
      border: 1px solid rgba(0,255,136,0.12); background: rgba(0,255,136,0.02);
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      transition: all 0.2s; font-family: 'Manrope', sans-serif;
    }
    .payment-option.active {
      border-color: rgba(0,255,136,0.5); background: rgba(0,255,136,0.1);
      box-shadow: 0 0 0 3px rgba(0,255,136,0.07);
    }
  `}</style>
)

/* ─── GRID BG ────────────────────────────────────────────────── */
const GridBg = () => (
  <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
    <div style={{
      position:"absolute", inset:"-60px",
      backgroundImage:`linear-gradient(rgba(0,255,136,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.025) 1px,transparent 1px)`,
      backgroundSize:"60px 60px", animation:"gridScroll 14s linear infinite"
    }}/>
    <div style={{ position:"absolute", bottom:"-10%", left:"-5%", width:500, height:500, background:"radial-gradient(circle,rgba(0,255,136,0.04) 0%,transparent 65%)", borderRadius:"50%" }}/>
  </div>
)

/* ─── NAV ITEMS ──────────────────────────────────────────────── */
const navItems = [
  { id:"dashboard",     label:"Dashboard",        icon:<LayoutDashboard size={17}/> },
  { id:"createAuction", label:"Create Auction",   icon:<PlusCircle      size={17}/> },
  { id:"listItems",     label:"My Listings",      icon:<List            size={17}/> },
  { id:"fertilizers",  label:"Buy Fertilizers",  icon:<FlaskConical    size={17}/> },
  { id:"schemes",       label:"Govt Schemes",     icon:<Leaf            size={17}/> },
  { id:"soil",          label:"Soil Analyzer",    icon:<Sprout          size={17}/> },
  { id:"chat",          label:"Farmer Chat",      icon:<MessageCircle   size={17}/> },
]

/* ─── REVEAL ─────────────────────────────────────────────────── */
const Reveal = ({ children, delay=0 }) => (
  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay, duration:0.5, ease:[0.22,1,0.36,1]}}>
    {children}
  </motion.div>
)

/* ─── FORM INPUT helper ──────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div style={{ marginBottom: 4 }}>
    {label && <label className="form-label">{label}</label>}
    {children}
  </div>
)

/* ═══════════════════════════════════════════════════════════════ */
export default function FarmerDashboard() {
  const [page, setPage] = useState("dashboard")

  /* Auction form */
  const [cropName,    setCropName]    = useState("")
  const [quantity,    setQuantity]    = useState("")
  const [basePrice,   setBasePrice]   = useState("")
  const [farmerName,  setFarmerName]  = useState("")
  const [farmerPhone, setFarmerPhone] = useState("")
  const [startTime,   setStartTime]   = useState("")
  const [endTime,     setEndTime]     = useState("")
  const [creating,    setCreating]    = useState(false)
  const [createMsg,   setCreateMsg]   = useState(null)

  /* Data */
  const [auctions,     setAuctions]     = useState([])
  const [fertilizers,  setFertilizers]  = useState([])
  const [loadingAuctions, setLoadingAuctions] = useState(true)
  const [loadingFerts,    setLoadingFerts]    = useState(false)

  /* Order modal */
  const [showOrder,       setShowOrder]       = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [phone,           setPhone]           = useState("")
  const [location,        setLocation]        = useState("")
  const [paymentMethod,   setPaymentMethod]   = useState("COD")
  const [ordering,        setOrdering]        = useState(false)
  const [orderSuccess,    setOrderSuccess]    = useState(false)

  useEffect(() => { fetchAuctions() }, [])
  useEffect(() => { if (page === "fertilizers") fetchFertilizers() }, [page])

  const fetchAuctions = async () => {
    setLoadingAuctions(true)
    try { const r = await axios.get("http://localhost:5001/api/auction"); setAuctions(r.data) }
    catch { console.warn("Error fetching auctions") }
    finally { setLoadingAuctions(false) }
  }

  const fetchFertilizers = async () => {
    setLoadingFerts(true)
    try { const r = await axios.get("http://localhost:5001/api/products"); setFertilizers(r.data) }
    catch { console.warn("Error fetching fertilizers") }
    finally { setLoadingFerts(false) }
  }

  const createAuction = async () => {
    setCreating(true); setCreateMsg(null)
    try {
      await axios.post("http://localhost:5001/api/auction/create", { cropName, quantity, basePrice, farmerName, farmerPhone, startTime, endTime })
      setCreateMsg({ type:"success", text:"Auction created successfully!" })
      fetchAuctions()
    } catch { setCreateMsg({ type:"error", text:"Failed to create auction. Please try again." }) }
    finally { setCreating(false) }
  }

  const placeOrder = async () => {
    setOrdering(true)
    try {
      if (paymentMethod === "UPI") {
        const payment = await axios.post("http://localhost:5001/api/orders/create-payment", { amount: selectedProduct.price })
        const options = {
          key: "YOUR_RAZORPAY_KEY", amount: payment.data.amount, order_id: payment.data.id,
          handler: async () => {
            await axios.post("http://localhost:5001/api/orders/create", { productId: selectedProduct._id, phone, location, paymentMethod: "UPI" })
            setOrderSuccess(true)
          }
        }
        new window.Razorpay(options).open()
      } else {
        await axios.post("http://localhost:5001/api/orders/create", { productId: selectedProduct._id, phone, location, paymentMethod: "COD" })
        setOrderSuccess(true)
      }
    } catch { console.warn("Order failed") }
    finally { setOrdering(false) }
  }

  const liveCount   = auctions.filter(a => new Date(a.endTime) > new Date()).length
  const closedCount = auctions.filter(a => new Date(a.endTime) < new Date()).length

  /* ── SIDEBAR ── */
  const Sidebar = () => (
    <div style={{
      width:230, flexShrink:0, background:"var(--bg-card)",
      borderRight:"1px solid rgba(0,255,136,0.1)",
      display:"flex", flexDirection:"column", padding:"28px 14px",
      minHeight:"100vh", position:"sticky", top:0, gap:4
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 10px", marginBottom:32 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#00ff88,#00c96a)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Sprout size={18} color="#030a06" strokeWidth={2.5}/>
        </div>
        <span style={{ fontWeight:800, fontSize:16, letterSpacing:"-0.02em" }}>
          Smart<span style={{ color:"var(--green-glow)" }}>Agri</span>
        </span>
      </div>

      <p style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--text-muted)", fontWeight:700, padding:"0 10px", marginBottom:6 }}>Farmer Portal</p>

      {navItems.map(n => (
        <button key={n.id} onClick={() => setPage(n.id)} style={{
          display:"flex", alignItems:"center", gap:11,
          padding:"11px 13px", borderRadius:10, border:"none", cursor:"pointer",
          background: page===n.id ? "rgba(0,255,136,0.1)" : "transparent",
          color: page===n.id ? "var(--green-glow)" : "var(--text-muted)",
          fontFamily:"'Manrope',sans-serif", fontSize:13.5, fontWeight: page===n.id ? 700 : 500,
          transition:"all 0.2s", textAlign:"left", width:"100%",
          borderLeft: page===n.id ? "2px solid var(--green-glow)" : "2px solid transparent",
        }}
        onMouseEnter={e=>{ if(page!==n.id){ e.currentTarget.style.background="rgba(0,255,136,0.04)"; e.currentTarget.style.color="var(--text-main)" }}}
        onMouseLeave={e=>{ if(page!==n.id){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text-muted)" }}}
        >{n.icon} {n.label}</button>
      ))}

      {/* User pill */}
      <div style={{ marginTop:"auto", padding:"14px", background:"rgba(0,255,136,0.05)", border:"1px solid rgba(0,255,136,0.12)", borderRadius:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"rgba(0,255,136,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--green-glow)" }}>
            <User size={14}/>
          </div>
          <div>
            <p style={{ fontSize:12, fontWeight:700 }}>Farmer Account</p>
            <p style={{ fontSize:11, color:"var(--text-muted)" }}>farmer@agri.com</p>
          </div>
        </div>
      </div>
    </div>
  )

  /* ── PAGE: DASHBOARD ── */
  const DashboardPage = () => (
    <div>
      <Reveal>
        <div style={{ marginBottom:36 }}>
          <p style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--green-glow)", fontWeight:600, marginBottom:6 }}>Farmer Portal</p>
          <h1 style={{ fontSize:"clamp(24px,3vw,38px)", fontWeight:800, letterSpacing:"-0.04em" }}>Farmer Dashboard</h1>
          <p style={{ color:"var(--text-muted)", fontSize:14, marginTop:4 }}>Manage your crops, auctions, and orders</p>
        </div>
      </Reveal>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:40 }}>
        {[
          { label:"Total Auctions", value: auctions.length,  icon:<Gavel      size={20}/>, color:"var(--green-glow)", bg:"rgba(0,255,136,0.08)",  border:"rgba(0,255,136,0.2)"  },
          { label:"Live Auctions",  value: liveCount,         icon:<TrendingUp size={20}/>, color:"var(--gold)",       bg:"rgba(212,168,67,0.08)", border:"rgba(212,168,67,0.2)" },
          { label:"Closed",         value: closedCount,       icon:<CheckCircle size={20}/>,color:"var(--blue)",       bg:"rgba(0,201,255,0.08)",  border:"rgba(0,201,255,0.2)"  },
          { label:"Products",       value: fertilizers.length,icon:<Package    size={20}/>, color:"var(--purple)",     bg:"rgba(192,132,252,0.08)",border:"rgba(192,132,252,0.2)"},
        ].map((s,i) => (
          <Reveal key={i} delay={i*0.07}>
            <div className="stat-card">
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${s.color},transparent)` }}/>
              <div style={{ width:44, height:44, borderRadius:12, background:s.bg, border:`1px solid ${s.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, marginBottom:16 }}>{s.icon}</div>
              <p className="mono" style={{ fontSize:36, fontWeight:600, color:s.color, letterSpacing:"-0.02em", lineHeight:1 }}>
                {loadingAuctions ? "—" : s.value}
              </p>
              <p style={{ fontSize:13, color:"var(--text-muted)", marginTop:6, fontWeight:500 }}>{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Recent auctions */}
      <Reveal delay={0.2}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h2 style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.03em" }}>Recent Auctions</h2>
          <button onClick={fetchAuctions} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:"rgba(0,255,136,0.07)", border:"1px solid rgba(0,255,136,0.18)", borderRadius:9, color:"var(--green-glow)", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>
            <RefreshCw size={13}/> Refresh
          </button>
        </div>

        <div className="card" style={{ padding:8 }}>
          {loadingAuctions ? (
            [1,2,3].map(i => <div key={i} style={{ height:60, borderRadius:10, background:"rgba(0,255,136,0.04)", margin:"6px 0", animation:"pulse 1.5s ease-in-out infinite" }}/>)
          ) : auctions.length === 0 ? (
            <div style={{ padding:"48px", textAlign:"center", color:"var(--text-muted)" }}>
              <Gavel size={36} style={{ margin:"0 auto 12px", opacity:0.3 }}/> <p>No auctions yet</p>
            </div>
          ) : auctions.slice(0,6).map((a, i) => {
            const live = new Date(a.endTime) > new Date()
            return (
              <motion.div key={a._id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}} className="auction-row" style={{ marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:"rgba(0,255,136,0.07)", border:"1px solid rgba(0,255,136,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--green-glow)" }}>
                    <Wheat size={16}/>
                  </div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:14 }}>{a.cropName}</p>
                    <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:1 }}>Qty: {a.quantity}</p>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <p className="mono" style={{ fontSize:16, fontWeight:600, color:"var(--green-glow)" }}>₹{a.highestBid || a.basePrice}</p>
                  {live ? <span className="tag-live"><span style={{ width:5,height:5,borderRadius:"50%",background:"var(--green-glow)",display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}/>Live</span>
                        : <span className="tag-closed">Closed</span>}
                </div>
              </motion.div>
            )
          })}
        </div>
      </Reveal>
    </div>
  )

  /* ── PAGE: CREATE AUCTION ── */
  const CreateAuctionPage = () => (
    <div style={{ maxWidth:580 }}>
      <Reveal>
        <div style={{ marginBottom:32 }}>
          <p style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", fontWeight:600, marginBottom:6 }}>New Listing</p>
          <h1 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:800, letterSpacing:"-0.04em" }}>Create Auction</h1>
          <p style={{ color:"var(--text-muted)", fontSize:14, marginTop:4 }}>List your crop for live bidding</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="card" style={{ padding:32 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            <Field label="Farmer Name">
              <input placeholder="Your full name" onChange={e=>setFarmerName(e.target.value)} className="form-input"/>
            </Field>
            <Field label="Phone Number">
              <input placeholder="+91 00000 00000" onChange={e=>setFarmerPhone(e.target.value)} className="form-input"/>
            </Field>
            <Field label="Crop Name">
              <input placeholder="e.g. Wheat, Rice, Cotton" onChange={e=>setCropName(e.target.value)} className="form-input"/>
            </Field>
            <Field label="Quantity">
              <input placeholder="e.g. 500 kg" onChange={e=>setQuantity(e.target.value)} className="form-input"/>
            </Field>
          </div>

          <Field label="Base Price (₹)">
            <input placeholder="Minimum bid amount" onChange={e=>setBasePrice(e.target.value)} className="form-input" style={{ fontFamily:"'Geist Mono',monospace", fontSize:16 }}/>
          </Field>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            <Field label="Start Time">
              <input type="datetime-local" onChange={e=>setStartTime(e.target.value)} className="form-input"/>
            </Field>
            <Field label="End Time">
              <input type="datetime-local" onChange={e=>setEndTime(e.target.value)} className="form-input"/>
            </Field>
          </div>

          <AnimatePresence>
            {createMsg && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                style={{
                  padding:"12px 16px", borderRadius:10, marginBottom:16, fontSize:14,
                  display:"flex", alignItems:"center", gap:8,
                  background: createMsg.type==="success" ? "rgba(0,255,136,0.08)" : "rgba(255,85,85,0.08)",
                  border: `1px solid ${createMsg.type==="success" ? "rgba(0,255,136,0.25)" : "rgba(255,85,85,0.25)"}`,
                  color: createMsg.type==="success" ? "var(--green-glow)" : "#ff8c8c"
                }}>
                {createMsg.type==="success" ? <CheckCircle size={15}/> : <AlertCircle size={15}/>} {createMsg.text}
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={createAuction} disabled={creating} className="btn-primary">
            {creating
              ? <><span style={{ width:16,height:16,border:"2px solid rgba(3,10,6,0.3)",borderTop:"2px solid #030a06",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block"}}/> Creating…</>
              : <><Gavel size={16}/> Launch Auction</>
            }
          </button>
        </div>
      </Reveal>
    </div>
  )

  /* ── PAGE: LISTINGS ── */
  const ListingsPage = () => (
    <div>
      <Reveal>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
          <div>
            <p style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--blue)", fontWeight:600, marginBottom:6 }}>Overview</p>
            <h1 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:800, letterSpacing:"-0.04em" }}>My Listings</h1>
          </div>
          <button onClick={() => setPage("createAuction")} style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 18px", background:"linear-gradient(135deg,#00ff88,#00c96a)", borderRadius:10, border:"none", cursor:"pointer", fontFamily:"'Manrope',sans-serif", fontSize:14, fontWeight:800, color:"#030a06" }}>
            <PlusCircle size={15}/> New Auction
          </button>
        </div>
      </Reveal>

      <div className="card" style={{ padding:10 }}>
        {/* Table header */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", padding:"10px 16px", marginBottom:4 }}>
          {["Crop","Quantity","Base Price","Highest Bid","Status"].map(h => (
            <p key={h} style={{ fontSize:11, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:700 }}>{h}</p>
          ))}
        </div>

        {loadingAuctions ? (
          [1,2,3,4].map(i => <div key={i} style={{ height:56, borderRadius:10, background:"rgba(0,255,136,0.03)", margin:"6px 0", animation:"pulse 1.5s ease-in-out infinite" }}/>)
        ) : auctions.length === 0 ? (
          <div style={{ padding:"60px", textAlign:"center", color:"var(--text-muted)" }}>
            <List size={36} style={{ margin:"0 auto 12px", opacity:0.3 }}/><p>No listings yet — create your first auction</p>
          </div>
        ) : auctions.map((a,i) => {
          const live = new Date(a.endTime) > new Date()
          return (
            <motion.div key={a._id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}}
              style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", padding:"14px 16px", borderRadius:10, marginBottom:4, background:"rgba(0,255,136,0.02)", border:"1px solid rgba(0,255,136,0.06)", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:"rgba(0,255,136,0.07)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--green-glow)" }}>
                  <Wheat size={14}/>
                </div>
                <span style={{ fontWeight:700, fontSize:14 }}>{a.cropName}</span>
              </div>
              <span style={{ fontSize:14, color:"var(--text-muted)" }}>{a.quantity}</span>
              <span className="mono" style={{ fontSize:14, color:"var(--text-muted)" }}>₹{a.basePrice}</span>
              <span className="mono" style={{ fontSize:14, fontWeight:600, color:"var(--green-glow)" }}>₹{a.highestBid || a.basePrice}</span>
              {live ? <span className="tag-live" style={{ justifySelf:"start" }}><span style={{ width:5,height:5,borderRadius:"50%",background:"var(--green-glow)",display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}/>Live</span>
                    : <span className="tag-closed" style={{ justifySelf:"start" }}>Closed</span>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  /* ── PAGE: FERTILIZERS ── */
  const FertilizersPage = () => (
    <div>
      <Reveal>
        <div style={{ marginBottom:32 }}>
          <p style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", fontWeight:600, marginBottom:6 }}>Marketplace</p>
          <h1 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:800, letterSpacing:"-0.04em" }}>Buy Fertilizers</h1>
          <p style={{ color:"var(--text-muted)", fontSize:14, marginTop:4 }}>Certified products delivered to your farm</p>
        </div>
      </Reveal>

      {loadingFerts ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
          {[1,2,3].map(i => <div key={i} style={{ height:240, background:"var(--bg-card)", borderRadius:16, opacity:0.5, animation:"pulse 1.5s ease-in-out infinite" }}/>)}
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
          {fertilizers.map((f, i) => (
            <Reveal key={f._id} delay={i*0.07}>
              <div className="fertilizer-card">
                <div style={{ height:130, background:"rgba(0,255,136,0.04)", borderBottom:"1px solid rgba(0,255,136,0.08)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                  {f.image
                    ? <img src={`http://localhost:5001${f.image}`} alt={f.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    : <div style={{ width:52, height:52, borderRadius:13, background:"rgba(212,168,67,0.1)", border:"1px solid rgba(212,168,67,0.25)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--gold)", animation:"float 4s ease-in-out infinite" }}><FlaskConical size={26}/></div>
                  }
                </div>
                <div style={{ padding:"18px" }}>
                  <h3 style={{ fontSize:16, fontWeight:800, letterSpacing:"-0.02em", marginBottom:6 }}>{f.name}</h3>
                  <p style={{ fontSize:13, color:"var(--text-muted)", lineHeight:1.6, marginBottom:12 }}>{f.description}</p>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <p className="mono" style={{ fontSize:22, fontWeight:600, color:"var(--green-glow)" }}>₹{f.price}</p>
                    <p style={{ fontSize:12, color:"var(--text-muted)" }}>Stock: {f.quantity}</p>
                  </div>
                  <button onClick={() => { setSelectedProduct(f); setShowOrder(true); setOrderSuccess(false) }} className="btn-primary" style={{ fontSize:14, padding:"12px" }}>
                    <Package size={14}/> Buy Now
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )

  /* ── PAGE: PLACEHOLDER ── */
  const PlaceholderPage = ({ title, icon, color="#00ff88" }) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:20, background:`rgba(0,255,136,0.08)`, border:`1px solid rgba(0,255,136,0.2)`, display:"flex", alignItems:"center", justifyContent:"center", color, marginBottom:24, animation:"float 4s ease-in-out infinite" }}>
        {icon}
      </div>
      <h2 style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>{title}</h2>
      <p style={{ color:"var(--text-muted)", fontSize:15 }}>Coming soon — this feature is under development</p>
    </div>
  )

  /* ── RENDER ── */
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg-void)" }}>
      <Styles />
      <GridBg />
      <Sidebar />

      {/* MAIN */}
      <div style={{ flex:1, padding:"36px 32px", position:"relative", zIndex:2, overflowY:"auto" }}>
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.35, ease:[0.22,1,0.36,1]}}>
            {page==="dashboard"     && <DashboardPage />}
            {page==="createAuction" && <CreateAuctionPage />}
            {page==="listItems"     && <ListingsPage />}
            {page==="fertilizers"   && <FertilizersPage />}
            {page==="schemes"       && <PlaceholderPage title="Government Schemes" icon={<Leaf size={32}/>} color="var(--blue)"/>}
            {page==="soil"          && <PlaceholderPage title="Soil Analyzer"      icon={<Sprout size={32}/>}/>}
            {page==="chat"          && <PlaceholderPage title="Farmer Chat"        icon={<MessageCircle size={32}/>} color="var(--purple)"/>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── ORDER MODAL ── */}
      <AnimatePresence>
        {showOrder && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:24, backdropFilter:"blur(6px)" }}
            onClick={e => { if(e.target===e.currentTarget){ setShowOrder(false); setOrderSuccess(false) }}}>
            <motion.div initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}}
              style={{ background:"var(--bg-card)", border:"1px solid rgba(0,255,136,0.15)", borderRadius:22, padding:32, width:"100%", maxWidth:440, position:"relative" }}>

              {/* Close */}
              <button onClick={() => { setShowOrder(false); setOrderSuccess(false) }} style={{ position:"absolute", top:18, right:18, background:"rgba(0,255,136,0.07)", border:"1px solid rgba(0,255,136,0.15)", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--text-muted)" }}>
                <X size={15}/>
              </button>

              <AnimatePresence mode="wait">
                {orderSuccess ? (
                  <motion.div key="success" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} style={{ textAlign:"center", padding:"20px 0" }}>
                    <div style={{ width:64, height:64, borderRadius:18, background:"rgba(0,255,136,0.1)", border:"1px solid rgba(0,255,136,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--green-glow)", margin:"0 auto 20px" }}>
                      <CheckCircle size={32}/>
                    </div>
                    <h3 style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Order Placed!</h3>
                    <p style={{ color:"var(--text-muted)", marginBottom:24 }}>Your order for <strong style={{ color:"var(--text-main)" }}>{selectedProduct?.name}</strong> has been confirmed.</p>
                    <button onClick={() => { setShowOrder(false); setOrderSuccess(false) }} className="btn-primary">Done</button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}}>
                    {/* Product pill */}
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"rgba(0,255,136,0.05)", border:"1px solid rgba(0,255,136,0.15)", borderRadius:12, marginBottom:24 }}>
                      <div style={{ width:36, height:36, borderRadius:9, background:"rgba(212,168,67,0.1)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--gold)" }}>
                        <FlaskConical size={18}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontWeight:700, fontSize:14 }}>{selectedProduct?.name}</p>
                        <p style={{ fontSize:12, color:"var(--text-muted)" }}>Ready to order</p>
                      </div>
                      <p className="mono" style={{ fontSize:18, fontWeight:600, color:"var(--green-glow)" }}>₹{selectedProduct?.price}</p>
                    </div>

                    <p style={{ fontWeight:800, fontSize:18, letterSpacing:"-0.03em", marginBottom:20 }}>Complete Order</p>

                    <Field label="Phone Number">
                      <div style={{ position:"relative" }}>
                        <Phone size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)" }}/>
                        <input placeholder="+91 00000 00000" onChange={e=>setPhone(e.target.value)} className="form-input" style={{ paddingLeft:40 }}/>
                      </div>
                    </Field>

                    <Field label="Delivery Location">
                      <div style={{ position:"relative" }}>
                        <MapPin size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)" }}/>
                        <input placeholder="Village, District, State" onChange={e=>setLocation(e.target.value)} className="form-input" style={{ paddingLeft:40 }}/>
                      </div>
                    </Field>

                    <Field label="Payment Method">
                      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                        {[
                          { val:"COD", label:"Cash on Delivery", icon:<Wallet size={18}/> },
                          { val:"UPI", label:"UPI Payment",      icon:<CreditCard size={18}/> },
                        ].map(p => (
                          <button key={p.val} type="button" onClick={()=>setPaymentMethod(p.val)}
                            className={`payment-option ${paymentMethod===p.val?"active":""}`}>
                            <span style={{ color: paymentMethod===p.val ? "var(--green-glow)" : "var(--text-muted)" }}>{p.icon}</span>
                            <span style={{ fontSize:12, fontWeight:700, color: paymentMethod===p.val ? "var(--green-glow)" : "var(--text-muted)" }}>{p.label}</span>
                          </button>
                        ))}
                      </div>
                    </Field>

                    <button onClick={placeOrder} disabled={ordering} className="btn-primary">
                      {ordering
                        ? <><span style={{ width:16,height:16,border:"2px solid rgba(3,10,6,0.3)",borderTop:"2px solid #030a06",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block"}}/> Processing…</>
                        : <><CheckCircle size={16}/> Place Order — ₹{selectedProduct?.price}</>
                      }
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}