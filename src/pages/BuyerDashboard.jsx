import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wheat, Gavel, ShoppingCart, TrendingUp, Sprout,
  Bell, Search, ChevronRight, Package, Zap,
  RefreshCw, ArrowUpRight, Clock, Filter
} from "lucide-react";

/* ─── STYLES ─────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --green-glow: #00ff88;
      --green-mid:  #00c96a;
      --bg-void:    #030a06;
      --bg-card:    #0b1a10;
      --bg-card2:   #0f2318;
      --text-main:  #e8f5ee;
      --text-muted: #6b8f76;
      --gold:       #d4a843;
      --blue:       #00c9ff;
      --red:        #ff5555;
    }

    body { font-family: 'Manrope', sans-serif; background: var(--bg-void); color: var(--text-main); }

    .mono { font-family: 'Geist Mono', monospace; }

    @keyframes gridScroll { 0%{transform:translateY(0)} 100%{transform:translateY(60px)} }
    @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:0.35} }
    @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes spin       { to{transform:rotate(360deg)} }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg-void); }
    ::-webkit-scrollbar-thumb { background: var(--green-mid); border-radius: 2px; }

    .card {
      background: var(--bg-card);
      border: 1px solid rgba(0,255,136,0.1);
      border-radius: 18px;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid rgba(0,255,136,0.08);
      border-radius: 16px;
      padding: 24px;
      position: relative; overflow: hidden;
      transition: all 0.25s;
      cursor: default;
    }
    .stat-card:hover {
      border-color: rgba(0,255,136,0.25);
      transform: translateY(-3px);
      box-shadow: 0 12px 36px rgba(0,0,0,0.4);
    }

    .crop-card {
      background: var(--bg-card);
      border: 1px solid rgba(0,255,136,0.08);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.25s;
      position: relative;
    }
    .crop-card:hover {
      border-color: rgba(0,255,136,0.28);
      transform: translateY(-5px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.5);
    }

    .auction-card {
      background: var(--bg-card);
      border: 1px solid rgba(0,255,136,0.1);
      border-radius: 16px;
      padding: 22px;
      position: relative; overflow: hidden;
      transition: all 0.25s;
    }
    .auction-card:hover {
      border-color: rgba(0,255,136,0.3);
      transform: translateY(-4px);
      box-shadow: 0 12px 36px rgba(0,0,0,0.4);
    }

    .btn-primary {
      width: 100%; padding: 13px;
      border-radius: 10px; border: none; cursor: pointer;
      font-family: 'Manrope', sans-serif;
      font-size: 14px; font-weight: 700;
      background: linear-gradient(135deg, #00ff88, #00c96a);
      color: #030a06;
      display: flex; align-items: center; justify-content: center; gap-7px;
      transition: transform 0.2s, box-shadow 0.2s;
      gap: 7px;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0,255,136,0.3);
    }

    .btn-outline {
      width: 100%; padding: 12px;
      border-radius: 10px; cursor: pointer;
      font-family: 'Manrope', sans-serif;
      font-size: 14px; font-weight: 700;
      background: rgba(0,255,136,0.06);
      border: 1px solid rgba(0,255,136,0.2);
      color: var(--green-glow);
      display: flex; align-items: center; justify-content: center;
      gap: 7px; transition: all 0.2s;
    }
    .btn-outline:hover {
      background: rgba(0,255,136,0.12);
      border-color: rgba(0,255,136,0.4);
    }

    .search-input {
      background: rgba(0,255,136,0.04);
      border: 1px solid rgba(0,255,136,0.15);
      border-radius: 10px;
      padding: 10px 14px 10px 40px;
      font-family: 'Manrope', sans-serif;
      font-size: 14px; color: var(--text-main);
      outline: none; width: 260px;
      transition: all 0.25s;
    }
    .search-input::placeholder { color: var(--text-muted); }
    .search-input:focus {
      border-color: rgba(0,255,136,0.4);
      background: rgba(0,255,136,0.07);
      box-shadow: 0 0 0 3px rgba(0,255,136,0.07);
    }

    .tag-live {
      display: inline-flex; align-items: center; gap: 5px;
      background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.25);
      color: var(--green-glow); font-size: 10px; font-weight: 700;
      padding: 3px 9px; border-radius: 100px; letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .section-label {
      font-size: 11px; letter-spacing: 0.2em;
      text-transform: uppercase; font-weight: 700;
      color: var(--text-muted); margin-bottom: 6px;
    }
  `}</style>
);

/* ─── GRID BG ────────────────────────────────────────────────── */
const GridBg = () => (
  <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
    <div style={{
      position:"absolute", inset:"-60px",
      backgroundImage:`linear-gradient(rgba(0,255,136,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.025) 1px,transparent 1px)`,
      backgroundSize:"60px 60px", animation:"gridScroll 14s linear infinite"
    }}/>
    <div style={{
      position:"absolute", top:"-10%", right:"-10%",
      width:600, height:600,
      background:"radial-gradient(circle,rgba(0,255,136,0.05) 0%,transparent 65%)",
      borderRadius:"50%"
    }}/>
  </div>
);

/* ─── SIDEBAR ────────────────────────────────────────────────── */
const Sidebar = ({ navigate }) => {
  const links = [
    { icon: <TrendingUp size={18}/>, label: "Dashboard",  active: true  },
    { icon: <Gavel      size={18}/>, label: "Auctions",   path:"/auction" },
    { icon: <Wheat      size={18}/>, label: "Crops",      path:"/crops"   },
    { icon: <ShoppingCart size={18}/>, label:"My Orders", path:"/orders"  },
  ];
  return (
    <div style={{
      width: 230, flexShrink: 0, background: "var(--bg-card)",
      borderRight: "1px solid rgba(0,255,136,0.1)",
      display: "flex", flexDirection: "column",
      padding: "28px 16px", gap: 6,
      minHeight: "100vh", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 10px", marginBottom:32 }}>
        <div style={{
          width:36, height:36, borderRadius:10,
          background:"linear-gradient(135deg,#00ff88,#00c96a)",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <Sprout size={18} color="#030a06" strokeWidth={2.5}/>
        </div>
        <span style={{ fontWeight:800, fontSize:16, letterSpacing:"-0.02em" }}>
          Smart<span style={{ color:"var(--green-glow)" }}>Agri</span>
        </span>
      </div>

      <p style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--text-muted)", fontWeight:700, padding:"0 10px", marginBottom:6 }}>Navigation</p>

      {links.map((l, i) => (
        <button key={i} onClick={() => l.path && navigate(l.path)} style={{
          display:"flex", alignItems:"center", gap:12,
          padding:"11px 14px", borderRadius:10, border:"none", cursor:"pointer",
          background: l.active ? "rgba(0,255,136,0.1)" : "transparent",
          color: l.active ? "var(--green-glow)" : "var(--text-muted)",
          fontFamily:"'Manrope',sans-serif", fontSize:14, fontWeight: l.active ? 700 : 500,
          transition:"all 0.2s", textAlign:"left",
          borderLeft: l.active ? "2px solid var(--green-glow)" : "2px solid transparent",
        }}
        onMouseEnter={e=>{ if(!l.active) { e.currentTarget.style.background="rgba(0,255,136,0.05)"; e.currentTarget.style.color="var(--text-main)"; }}}
        onMouseLeave={e=>{ if(!l.active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text-muted)"; }}}
        >{l.icon} {l.label}</button>
      ))}

      {/* Bottom user pill */}
      <div style={{ marginTop:"auto", padding:"14px", background:"rgba(0,255,136,0.05)", border:"1px solid rgba(0,255,136,0.12)", borderRadius:12 }}>
        <p style={{ fontSize:13, fontWeight:700 }}>Buyer Account</p>
        <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>buyer@agri.com</p>
      </div>
    </div>
  );
};

/* ─── REVEAL ─────────────────────────────────────────────────── */
const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:0.5, ease:[0.22,1,0.36,1] }}>
    {children}
  </motion.div>
);

/* ─── MAIN ───────────────────────────────────────────────────── */
const BuyerDashboard = () => {
  const [crops,    setCrops]    = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cropsRes, auctionRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5001/api/crops"),
        axios.get("http://localhost:5001/api/auction"),
        axios.get("http://localhost:5001/api/orders"),
      ]);
      setCrops(cropsRes.data);
      setAuctions(auctionRes.data);
      setOrders(ordersRes.data);
    } catch { console.warn("Error fetching dashboard data"); }
    finally { setLoading(false); }
  };

  const filteredCrops    = crops.filter(c    => c.cropName?.toLowerCase().includes(search.toLowerCase()));
  const filteredAuctions = auctions.filter(a => a.cropName?.toLowerCase().includes(search.toLowerCase()));
  const liveAuctions     = filteredAuctions.filter(a => a.endTime ? new Date(a.endTime) > new Date() : true);

  const stats = [
    { label:"Available Crops",  value: crops.length,    icon:<Wheat size={20}/>,       color:"var(--green-glow)", bg:"rgba(0,255,136,0.08)",  border:"rgba(0,255,136,0.2)"  },
    { label:"Live Auctions",    value: liveAuctions.length, icon:<Gavel size={20}/>,   color:"var(--gold)",       bg:"rgba(212,168,67,0.08)", border:"rgba(212,168,67,0.2)" },
    { label:"My Orders",        value: orders.length,   icon:<ShoppingCart size={20}/>,color:"var(--blue)",       bg:"rgba(0,201,255,0.08)",  border:"rgba(0,201,255,0.2)"  },
    { label:"Total Bids",       value: auctions.length, icon:<TrendingUp size={20}/>,  color:"#c084fc",           bg:"rgba(192,132,252,0.08)", border:"rgba(192,132,252,0.2)"},
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg-void)" }}>
      <Styles />
      <GridBg />
      <Sidebar navigate={navigate} />

      {/* MAIN CONTENT */}
      <div style={{ flex:1, padding:"36px 32px", position:"relative", zIndex:2, overflowY:"auto" }}>

        {/* ── TOP BAR ── */}
        <Reveal>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:36, flexWrap:"wrap", gap:16 }}>
            <div>
              <p className="section-label">Buyer Portal</p>
              <h1 style={{ fontSize:"clamp(24px,3vw,36px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1.1 }}>
                Good morning 👋
              </h1>
              <p style={{ color:"var(--text-muted)", fontSize:14, marginTop:4 }}>Browse crops & place bids on live auctions</p>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {/* Search */}
              <div style={{ position:"relative" }}>
                <Search size={15} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)" }}/>
                <input
                  className="search-input"
                  placeholder="Search crops…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <button onClick={fetchData} style={{
                display:"flex", alignItems:"center", gap:7, padding:"10px 16px",
                background:"rgba(0,255,136,0.07)", border:"1px solid rgba(0,255,136,0.18)",
                borderRadius:10, color:"var(--green-glow)", fontFamily:"'Manrope',sans-serif",
                fontSize:13, fontWeight:700, cursor:"pointer"
              }}>
                <RefreshCw size={14}/> Refresh
              </button>

              <button style={{
                width:40, height:40, borderRadius:10,
                background:"rgba(0,255,136,0.06)", border:"1px solid rgba(0,255,136,0.15)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"var(--text-muted)", cursor:"pointer"
              }}>
                <Bell size={17}/>
              </button>
            </div>
          </div>
        </Reveal>

        {/* ── STATS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:16, marginBottom:40 }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="stat-card">
                {/* Top glow streak */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${s.color},transparent)` }}/>
                <div style={{
                  width:44, height:44, borderRadius:12,
                  background:s.bg, border:`1px solid ${s.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:s.color, marginBottom:16
                }}>{s.icon}</div>
                <p className="mono" style={{ fontSize:34, fontWeight:600, color:s.color, letterSpacing:"-0.02em", lineHeight:1 }}>
                  {loading ? "—" : s.value}
                </p>
                <p style={{ fontSize:13, color:"var(--text-muted)", marginTop:6, fontWeight:500 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── LIVE AUCTIONS ── */}
        <Reveal delay={0.1}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <h2 style={{ fontSize:20, fontWeight:800, letterSpacing:"-0.03em" }}>Live Auctions</h2>
              <span className="tag-live">
                <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--green-glow)", display:"inline-block", animation:"pulse 1.5s ease-in-out infinite"}}/>
                {liveAuctions.length} Active
              </span>
            </div>
            <button onClick={() => navigate("/auction")} style={{
              display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700,
              color:"var(--green-glow)", background:"none", border:"none", cursor:"pointer"
            }}>
              View All <ChevronRight size={14}/>
            </button>
          </div>
        </Reveal>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16, marginBottom:48 }}>
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} style={{ height:160, background:"var(--bg-card)", borderRadius:16, opacity:0.5, animation:"pulse 1.5s ease-in-out infinite" }}/>
            ))
          ) : liveAuctions.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{
              gridColumn:"1/-1", padding:"48px", textAlign:"center",
              background:"var(--bg-card)", border:"1px dashed rgba(0,255,136,0.15)", borderRadius:16
            }}>
              <Gavel size={40} style={{ margin:"0 auto 12px", color:"var(--text-muted)", opacity:0.4 }}/>
              <p style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>No active auctions</p>
              <p style={{ color:"var(--text-muted)", fontSize:14 }}>Check back soon — new listings drop daily</p>
            </motion.div>
          ) : (
            filteredAuctions.map((auction, i) => (
              <Reveal key={auction._id} delay={i * 0.06}>
                <div className="auction-card">
                  {/* top streak */}
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(0,255,136,0.6),transparent)" }}/>

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{
                        width:38, height:38, borderRadius:10,
                        background:"rgba(0,255,136,0.08)", border:"1px solid rgba(0,255,136,0.15)",
                        display:"flex", alignItems:"center", justifyContent:"center", color:"var(--green-glow)"
                      }}>
                        <Gavel size={18}/>
                      </div>
                      <h3 style={{ fontSize:16, fontWeight:800, letterSpacing:"-0.02em" }}>{auction.cropName}</h3>
                    </div>
                    <span className="tag-live">
                      <span style={{ width:5,height:5,borderRadius:"50%",background:"var(--green-glow)",display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}/>
                      Live
                    </span>
                  </div>

                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
                    <div>
                      <p style={{ fontSize:11, color:"var(--text-muted)", letterSpacing:"0.05em", textTransform:"uppercase", fontWeight:600, marginBottom:3 }}>Qty</p>
                      <p style={{ fontWeight:700 }}>{auction.quantity || "—"}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:11, color:"var(--text-muted)", letterSpacing:"0.05em", textTransform:"uppercase", fontWeight:600, marginBottom:3 }}>Highest Bid</p>
                      <p className="mono" style={{ fontSize:20, fontWeight:600, color:"var(--green-glow)" }}>
                        ₹{auction.highestBid || auction.basePrice || "—"}
                      </p>
                    </div>
                  </div>

                  <button onClick={() => navigate("/auction")} className="btn-primary">
                    <Zap size={15}/> Join Auction
                  </button>
                </div>
              </Reveal>
            ))
          )}
        </div>

        {/* ── AVAILABLE CROPS ── */}
        <Reveal delay={0.15}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <div>
              <h2 style={{ fontSize:20, fontWeight:800, letterSpacing:"-0.03em" }}>Available Crops</h2>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button style={{
                display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                background:"rgba(0,255,136,0.06)", border:"1px solid rgba(0,255,136,0.15)",
                borderRadius:8, color:"var(--text-muted)", fontSize:13, fontWeight:600,
                cursor:"pointer", fontFamily:"'Manrope',sans-serif"
              }}>
                <Filter size={13}/> Filter
              </button>
            </div>
          </div>
        </Reveal>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16, paddingBottom:40 }}>
          {loading ? (
            [1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height:200, background:"var(--bg-card)", borderRadius:16, opacity:0.5, animation:"pulse 1.5s ease-in-out infinite" }}/>
            ))
          ) : filteredCrops.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{
              gridColumn:"1/-1", padding:"60px", textAlign:"center",
              background:"var(--bg-card)", border:"1px dashed rgba(0,255,136,0.15)", borderRadius:16
            }}>
              <Wheat size={44} style={{ margin:"0 auto 14px", color:"var(--text-muted)", opacity:0.35 }}/>
              <p style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>No crops found</p>
              <p style={{ color:"var(--text-muted)", fontSize:14 }}>
                {search ? `No results for "${search}"` : "No crops listed at the moment"}
              </p>
            </motion.div>
          ) : (
            filteredCrops.map((crop, i) => (
              <Reveal key={crop._id} delay={i * 0.05}>
                <div className="crop-card">
                  {/* Image / icon area */}
                  <div style={{
                    height:110, background:"rgba(0,255,136,0.04)",
                    borderBottom:"1px solid rgba(0,255,136,0.08)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    position:"relative", overflow:"hidden"
                  }}>
                    {crop.image ? (
                      <img src={`http://localhost:5001${crop.image}`} alt={crop.cropName}
                        style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    ) : (
                      <div style={{
                        width:56, height:56, borderRadius:14,
                        background:"rgba(0,255,136,0.09)", border:"1px solid rgba(0,255,136,0.2)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"var(--green-glow)", animation:"float 4s ease-in-out infinite"
                      }}>
                        <Wheat size={26}/>
                      </div>
                    )}
                    {/* Freshness tag */}
                    <div style={{
                      position:"absolute", top:10, right:10,
                      background:"rgba(0,255,136,0.12)", border:"1px solid rgba(0,255,136,0.25)",
                      borderRadius:100, padding:"2px 9px",
                      fontSize:10, fontWeight:700, color:"var(--green-glow)", letterSpacing:"0.06em"
                    }}>FRESH</div>
                  </div>

                  {/* Info */}
                  <div style={{ padding:"20px" }}>
                    <h3 style={{ fontSize:16, fontWeight:800, letterSpacing:"-0.02em", marginBottom:12 }}>{crop.cropName}</h3>

                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                      <div>
                        <p style={{ fontSize:11, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600, marginBottom:3 }}>Quantity</p>
                        <p style={{ fontWeight:700, fontSize:14 }}>{crop.quantity}</p>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <p style={{ fontSize:11, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600, marginBottom:3 }}>Min Price</p>
                        <p className="mono" style={{ fontSize:20, fontWeight:600, color:"var(--green-glow)" }}>₹{crop.minPrice}</p>
                      </div>
                    </div>

                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => navigate(`/auction/${crop._id}`)} className="btn-primary" style={{ flex:1 }}>
                        <Gavel size={14}/> Bid Now
                      </button>
                      <button style={{
                        width:42, height:42, borderRadius:10, flexShrink:0,
                        background:"rgba(0,255,136,0.06)", border:"1px solid rgba(0,255,136,0.18)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"var(--green-glow)", cursor:"pointer"
                      }}>
                        <ArrowUpRight size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;