import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   CONFIG  —  change BASE_URL to your backend
═══════════════════════════════════════════════════════════════ */
const BASE_URL = "http://localhost:5001/api";

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const CATS = ["Seeds", "Fertilizers", "Pesticides"];
const CAT_EMOJI = { Seeds: "🌱", Fertilizers: "🧪", Pesticides: "🧴"};
const ORDER_STATUSES = ["Pending", "Accepted", "Shipped", "Delivered", "Cancelled"];

const STATUS_META = {
  Pending:   { color: "#f0b429", bg: "rgba(240,180,41,0.10)",  border: "rgba(240,180,41,0.25)",  icon: "⏳" },
  Accepted:  { color: "#60aef0", bg: "rgba(96,174,240,0.10)",  border: "rgba(96,174,240,0.25)",  icon: "✅" },
  Shipped:   { color: "#a888f5", bg: "rgba(168,136,245,0.10)", border: "rgba(168,136,245,0.25)", icon: "🚚" },
  Delivered: { color: "#6bcb8b", bg: "rgba(107,203,139,0.10)", border: "rgba(107,203,139,0.25)", icon: "📦" },
  Cancelled: { color: "#f07060", bg: "rgba(240,112,96,0.10)",  border: "rgba(240,112,96,0.25)",  icon: "✕" },
};

/* ═══════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07090d;
  --s1:#0c1018;
  --s2:#111722;
  --s3:#161f2e;
  --s4:#1c2740;
  --line:#1e2d44;
  --line2:#253550;
  --green:#6bcb8b; --green-g:rgba(107,203,139,.11);
  --amber:#f0b429; --amber-g:rgba(240,180,41,.10);
  --blue:#60aef0;  --blue-g:rgba(96,174,240,.10);
  --purple:#a888f5;--purple-g:rgba(168,136,245,.10);
  --red:#f07060;   --red-g:rgba(240,112,96,.10);
  --text:#ccd9ec;
  --text2:#5a7a9e;
  --text3:#2d4060;
  --r:11px;
  --t:.18s cubic-bezier(.4,0,.2,1);
  --font:'Plus Jakarta Sans',sans-serif;
  --display:'Clash Display',sans-serif;
  --mono:'JetBrains Mono',monospace;
}
body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--s4);border-radius:2px}

/* ── LAYOUT ── */
.app{display:flex;min-height:100vh}

/* ── SIDEBAR ── */
.sb{
  width:220px;flex-shrink:0;
  background:var(--s1);
  border-right:1px solid var(--line);
  display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh;overflow-y:auto;
}
.sb-brand{
  padding:24px 18px 20px;
  border-bottom:1px solid var(--line);
  margin-bottom:12px;
}
.sb-eyebrow{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--green);margin-bottom:4px}
.sb-name{font-family:var(--display);font-size:21px;font-weight:700;color:var(--text);line-height:1.1}
.sb-name span{color:var(--amber)}
.sb-nav{padding:0 10px;flex:1}
.sb-section{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);padding:4px 10px 8px;margin-top:6px}
.sb-btn{
  display:flex;align-items:center;gap:10px;
  width:100%;padding:9px 12px;border-radius:8px;
  border:none;background:none;color:var(--text2);
  font-family:var(--font);font-size:13px;cursor:pointer;
  transition:all var(--t);text-align:left;margin-bottom:2px;
}
.sb-btn:hover{background:var(--s2);color:var(--text)}
.sb-btn.on{background:var(--green-g);color:var(--green);border:1px solid rgba(107,203,139,.18);font-weight:500}
.sb-cnt{
  margin-left:auto;background:var(--red);color:#fff;
  font-size:10px;font-weight:600;padding:1px 6px;
  border-radius:10px;font-family:var(--mono);
}
.sb-foot{margin-top:auto;padding:14px 18px 0;border-top:1px solid var(--line)}
.sb-status{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--text3)}
.cdot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.cdot.on{background:var(--green);box-shadow:0 0 6px var(--green);animation:blink 2s infinite}
.cdot.off{background:var(--red);box-shadow:0 0 6px var(--red)}
.cdot.spin{background:var(--amber);animation:blink .7s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}

/* ── MAIN ── */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

/* ── TOPBAR ── */
.topbar{
  display:flex;align-items:center;gap:12px;
  padding:16px 26px;border-bottom:1px solid var(--line);
  background:rgba(7,9,13,.85);backdrop-filter:blur(14px);
  position:sticky;top:0;z-index:20;
}
.topbar-title{font-family:var(--display);font-size:18px;font-weight:600;flex:1;letter-spacing:.3px}
.searchbox{
  display:flex;align-items:center;gap:8px;
  background:var(--s2);border:1px solid var(--line);
  border-radius:9px;padding:8px 13px;width:230px;
  transition:all var(--t);
}
.searchbox:focus-within{border-color:var(--green);box-shadow:0 0 0 3px rgba(107,203,139,.1)}
.searchbox input{background:none;border:none;outline:none;color:var(--text);font-size:13px;font-family:var(--font);width:100%}
.searchbox input::placeholder{color:var(--text3)}

/* ── BUTTONS ── */
.btn{
  display:inline-flex;align-items:center;gap:7px;
  padding:9px 18px;border-radius:9px;font-size:13px;
  font-weight:600;font-family:var(--font);cursor:pointer;
  transition:all var(--t);border:none;outline:none;white-space:nowrap;
}
.btn-green{background:var(--green);color:#000}
.btn-green:hover:not(:disabled){background:#7dd99a;box-shadow:0 4px 18px rgba(107,203,139,.3);transform:translateY(-1px)}
.btn-ghost{background:transparent;border:1px solid var(--line2);color:var(--text2)}
.btn-ghost:hover:not(:disabled){border-color:var(--green);color:var(--green);background:var(--green-g)}
.btn-red{background:var(--red-g);border:1px solid rgba(240,112,96,.25);color:var(--red)}
.btn-red:hover:not(:disabled){background:rgba(240,112,96,.2);box-shadow:0 4px 14px rgba(240,112,96,.2)}
.btn-sm{padding:6px 13px;font-size:12px;border-radius:7px}
.btn:disabled{opacity:.45;cursor:not-allowed}

/* ── CONTENT ── */
.content{flex:1;padding:26px;overflow-y:auto}

/* ── API BANNER ── */
.api-banner{
  background:rgba(5, 5, 5, 0.06);
  border-radius:var(--r);padding:13px 16px;
  display:flex;align-items:center;gap:12px;margin-bottom:22px;
  font-size:13px;color:var(--amber);flex-wrap:wrap;
}
.api-banner input{
  background:var(--s2);border:1px solid rgba(240,180,41,.3);
  border-radius:8px;padding:7px 12px;color:var(--text);
  font-size:12.5px;font-family:var(--font);outline:none;width:250px;
  transition:border-color var(--t);
}
.api-banner input:focus{border-color:var(--amber)}

/* ── STAT CARDS ── */
.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:26px}
.stat{
  background:var(--s1);border:1px solid var(--line);
  border-radius:var(--r);padding:16px 18px;
  position:relative;overflow:hidden;
  transition:border-color var(--t),transform var(--t);cursor:default;
}
.stat:hover{border-color:var(--line2);transform:translateY(-2px)}
.stat::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--c,var(--green));opacity:.55}
.stat:nth-child(1){--c:#f0b429}.stat:nth-child(2){--c:#60aef0}.stat:nth-child(3){--c:#a888f5}
.stat:nth-child(4){--c:#6bcb8b}.stat:nth-child(5){--c:#f07060}
.stat-lbl{font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--text3);margin-bottom:8px}
.stat-val{font-family:var(--display);font-size:30px;font-weight:700;line-height:1;color:var(--text)}
.stat-sub{font-size:11px;color:var(--text3);margin-top:5px}
.stat-icon{position:absolute;right:14px;top:14px;font-size:20px;opacity:.2}

/* ── SECTION ── */
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.sec-title{font-family:var(--display);font-size:17px;font-weight:600;letter-spacing:.3px}

/* ── TABLE ── */
.tbl-wrap{background:var(--s1);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;margin-bottom:28px}
.tbl-toolbar{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.chip{
  padding:4px 12px;border-radius:20px;font-size:11.5px;font-weight:500;
  cursor:pointer;border:1px solid var(--line2);color:var(--text2);
  background:none;font-family:var(--font);transition:all var(--t);
}
.chip:hover,.chip.on{border-color:var(--green);color:var(--green);background:var(--green-g)}
table{width:100%;border-collapse:collapse}
thead th{
  text-align:left;padding:10px 14px;font-size:10px;font-weight:600;
  letter-spacing:1.2px;text-transform:uppercase;color:var(--text3);
  border-bottom:1px solid var(--line);background:var(--s2);white-space:nowrap;
}
tbody tr{border-bottom:1px solid rgba(30,45,68,.5);transition:background var(--t)}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:var(--s2)}
td{padding:13px 14px;font-size:13px;vertical-align:middle}
.prod-cell{display:flex;align-items:center;gap:11px}
.prod-thumb{
  width:42px;height:42px;border-radius:8px;
  background:var(--s3);border:1px solid var(--line2);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;flex-shrink:0;overflow:hidden;
}
.prod-thumb img{width:100%;height:100%;object-fit:cover;border-radius:8px}
.prod-name{font-weight:600;font-size:13.5px}
.prod-id{font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:1px}
.price{font-family:var(--mono);font-weight:500;font-size:13.5px}
.qty-low{color:var(--red);font-weight:700}
.qty-ok{color:var(--text)}
.desc{max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text2);font-size:12px}
.acts{display:flex;gap:7px;align-items:center}

/* ── ORDER CELLS ── */
.order-id{font-family:var(--mono);font-size:11.5px;color:var(--text2)}
.farmer-cell .name{font-weight:500}
.farmer-cell .sub{font-size:11px;color:var(--text3)}
.status-badge{
  display:inline-flex;align-items:center;gap:5px;
  padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:500;border:1px solid;white-space:nowrap;
}
.status-select{
  background:var(--s3);border:1px solid var(--line2);border-radius:7px;
  padding:5px 9px;color:var(--text);font-size:12px;font-family:var(--font);
  outline:none;cursor:pointer;transition:border-color var(--t);
}
.status-select:focus{border-color:var(--green)}

/* ── EMPTY / LOADING STATE ── */
.empty{text-align:center;padding:55px 20px;color:var(--text3)}
.empty-icon{font-size:38px;opacity:.25;margin-bottom:10px}
.empty-title{font-family:var(--display);font-size:18px;letter-spacing:.5px;color:var(--text2);margin-bottom:6px}
.empty-sub{font-size:13px;margin-bottom:18px}

/* ── MODAL ── */
.overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.78);
  backdrop-filter:blur(8px);z-index:100;
  display:flex;align-items:center;justify-content:center;
  opacity:0;pointer-events:none;transition:opacity var(--t);
}
.overlay.open{opacity:1;pointer-events:all}
.modal{
  background:var(--s1);border:1px solid var(--line2);
  border-radius:16px;width:510px;max-width:95vw;
  max-height:88vh;overflow-y:auto;
  transform:translateY(14px) scale(.97);transition:transform var(--t);
}
.overlay.open .modal{transform:translateY(0) scale(1)}
.modal-hdr{display:flex;align-items:center;justify-content:space-between;padding:22px 24px 0}
.modal-title{font-family:var(--display);font-size:20px;font-weight:600;color:var(--green)}
.modal-close{
  width:28px;height:28px;border-radius:7px;
  border:1px solid var(--line2);background:none;color:var(--text2);
  cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;
  transition:all var(--t);
}
.modal-close:hover{background:var(--s3);color:var(--text)}
.modal-body{padding:20px 24px 26px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.full{grid-column:1/-1}
.fg{display:flex;flex-direction:column;gap:6px}
.fl{font-size:10.5px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:var(--text2)}
.fi,.fsel,.fta{
  background:var(--s2);border:1px solid var(--line2);
  border-radius:9px;padding:10px 13px;color:var(--text);
  font-size:13.5px;font-family:var(--font);outline:none;width:100%;
  transition:all var(--t);
}
.fi:focus,.fsel:focus,.fta:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(107,203,139,.1)}
.fi::placeholder,.fta::placeholder{color:var(--text3)}
.fsel{appearance:none;cursor:pointer}
.fsel option{background:var(--s2)}
.fta{resize:vertical;min-height:72px}
.fi.err,.fsel.err{border-color:var(--red)!important;box-shadow:0 0 0 3px rgba(240,112,96,.12)!important}
.errmsg{font-size:11px;color:var(--red)}
.modal-ftr{
  display:flex;gap:9px;justify-content:flex-end;
  padding-top:16px;border-top:1px solid var(--line);margin-top:16px;
}

/* ── UPLOAD ── */
.upload-zone{
  border:2px dashed var(--line2);border-radius:9px;
  padding:20px;text-align:center;cursor:pointer;
  transition:all var(--t);position:relative;
}
.upload-zone:hover,.upload-zone.drag{border-color:var(--green);background:var(--green-g)}
.upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.upload-ico{font-size:26px;opacity:.35;margin-bottom:5px}
.upload-txt{font-size:13px;color:var(--text2)}
.upload-sub{font-size:11px;color:var(--text3);margin-top:3px}
.img-prev{position:relative}
.img-prev img{width:100%;max-height:120px;object-fit:cover;border-radius:9px;display:block}
.img-rm{
  position:absolute;top:6px;right:6px;width:22px;height:22px;
  background:rgba(0, 0, 0, 0.75);border:none;border-radius:50%;
  color:#fff;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;
}
.img-rm:hover{background:var(--red)}

/* ── CONFIRM MODAL ── */
.confirm-box{
  background:var(--s1);border:1px solid var(--line2);
  border-radius:16px;width:330px;padding:28px;text-align:center;
  transform:scale(.95);transition:transform var(--t);
}
.overlay.open .confirm-box{transform:scale(1)}
.confirm-ico{font-size:36px;margin-bottom:10px}
.confirm-title{font-family:var(--display);font-size:18px;font-weight:600;color:var(--red);margin-bottom:6px}
.confirm-text{font-size:13px;color:var(--text2);line-height:1.5}
.confirm-acts{display:flex;gap:10px;justify-content:center;margin-top:18px}

/* ── TOAST ── */
.toasts{position:fixed;bottom:22px;right:22px;z-index:200;display:flex;flex-direction:column;gap:8px}
.toast{
  display:flex;align-items:center;gap:9px;
  padding:10px 15px;border-radius:10px;font-size:13px;font-weight:500;
  min-width:230px;border:1px solid;
  animation:tIn .22s ease both;
}
@keyframes tIn{from{transform:translateX(28px);opacity:0}to{transform:translateX(0);opacity:1}}
.toast.success{background:rgba(107,203,139,.08);border-color:rgba(107,203,139,.25);color:var(--green)}
.toast.error  {background:rgba(240,112,96,.08); border-color:rgba(240,112,96,.25); color:var(--red)}
.toast.info   {background:rgba(96,174,240,.08); border-color:rgba(96,174,240,.25); color:var(--blue)}

/* ── SPINNER ── */
.spin{width:15px;height:15px;border:2px solid rgba(0,0,0,.15);border-top-color:currentColor;border-radius:50%;animation:rot .6s linear infinite}
@keyframes rot{to{transform:rotate(360deg)}}

/* ── RESPONSIVE ── */
@media(max-width:1100px){.stats{grid-template-columns:repeat(3,1fr)}}
@media(max-width:900px){.sb{display:none}.stats{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.content{padding:16px}.topbar{padding:14px 16px}.searchbox{display:none}.stats{grid-template-columns:1fr 1fr}}
`;

/* ═══════════════════════════════════════════════════════════════
   TOAST HOOK
═══════════════════════════════════════════════════════════════ */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return { toasts, toast: add };
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
const shortId = (id) => id ? "#" + String(id).slice(-6).toUpperCase() : "—";
const timeAgo = (d) => {
  if (!d) return "—";
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

/* ═══════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════ */
export default function DealerDashboard() {
  const { toasts, toast } = useToast();

  /* ── api config ── */
  const [apiBase, setApiBase] = useState(() => localStorage.getItem("adm_api") || BASE_URL);
  const [apiInput, setApiInput] = useState(apiBase);
  const [showBanner, setShowBanner] = useState(!localStorage.getItem("adm_api"));
  const [apiStatus, setApiStatus] = useState("spin"); // spin | on | off

  /* ── view state ── */
  const [view, setView] = useState("dashboard"); // dashboard | products | orders

  /* ── dashboard ── */
  const [dash, setDash] = useState(null);
  const [dashLoading, setDashLoading] = useState(true);

  /* ── products ── */
  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [prodSearch, setProdSearch] = useState("");
  const [prodCat, setProdCat] = useState("all");

  /* ── add/edit product modal ── */
  const [prodModal, setProdModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", quantity: "", description: "" });
  const [errors, setErrors] = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [imgPrev, setImgPrev] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [drag, setDrag] = useState(false);

  /* ── delete confirm ── */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ── orders ── */
  const [orders, setOrders] = useState([]);
  const [ordLoading, setOrdLoading] = useState(false);
  const [ordSearch, setOrdSearch] = useState("");
  const [ordStatus, setOrdStatus] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  /* ── inject CSS ── */
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  /* ══════════════════════════════════════
     API CALLS
  ══════════════════════════════════════ */

  /* dashboard stats */
  const loadDash = useCallback(async () => {
    if (!apiBase) return;
    setDashLoading(true);
    try {
      const res = await fetch(`${apiBase}/orders/dashboard`);
      if (!res.ok) throw new Error("HTTP " + res.status);
      setDash(await res.json());
      setApiStatus("on");
    } catch {
      setApiStatus("off");
    } finally {
      setDashLoading(false);
    }
  }, [apiBase]);

  /* products */
  const loadProducts = useCallback(async () => {
    if (!apiBase) return;
    setProdLoading(true);
    try {
      const res = await fetch(`${apiBase}/products`);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setApiStatus("on");
    } catch {
      setApiStatus("off");
      toast("Cannot reach products API", "error");
    } finally {
      setProdLoading(false);
    }
  }, [apiBase, toast]);

  /* orders */
  const loadOrders = useCallback(async () => {
    if (!apiBase) return;
    setOrdLoading(true);
    try {
      const res = await fetch(`${apiBase}/orders`);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setApiStatus("on");
    } catch {
      setApiStatus("off");
      toast("Cannot reach orders API", "error");
    } finally {
      setOrdLoading(false);
    }
  }, [apiBase, toast]);

  /* initial load */
  useEffect(() => { loadDash(); }, [loadDash]);

  useEffect(() => {
    if (view === "products") loadProducts();
    if (view === "orders") loadOrders();
  }, [view, loadProducts, loadOrders]);

  /* ══════════════════════════════════════
     PRODUCT FORM
  ══════════════════════════════════════ */
  function openAdd() {
    setEditId(null);
    setForm({ name: "", category: "", price: "", quantity: "", description: "" });
    setErrors({});
    setImgFile(null);
    setImgPrev(null);
    setProdModal(true);
  }

  function openEdit(p) {
    setEditId(p._id);
    setForm({ name: p.name || "", category: p.category || "", price: p.price ?? "", quantity: p.quantity ?? "", description: p.description || "" });
    setErrors({});
    setImgFile(null);
    const base = apiBase.replace(/\/api.*/, "");
    setImgPrev(p.image ? base + p.image : null);
    setProdModal(true);
  }

  function closeModal() { setProdModal(false); setImgFile(null); setImgPrev(null); setErrors({}); }

  function pickImage(file) {
    if (!file) return;
    setImgFile(file);
    const r = new FileReader();
    r.onload = e => setImgPrev(e.target.result);
    r.readAsDataURL(file);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.category) e.category = "Required";
    if (form.price === "" || isNaN(form.price) || Number(form.price) < 0) e.price = "Valid price required";
    if (form.quantity === "" || isNaN(form.quantity) || Number(form.quantity) < 0) e.quantity = "Valid quantity required";
    return e;
  }

  async function submitProduct() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("category", form.category);
    fd.append("price", form.price);
    fd.append("quantity", form.quantity);
    fd.append("description", form.description.trim());
    if (imgFile) fd.append("image", imgFile);
    try {
      const url = editId ? `${apiBase}/products/${editId}` : `${apiBase}/products/`;
      const res = await fetch(url, { method: editId ? "PUT" : "POST", body: fd });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Failed"); }
      toast(editId ? "Product updated!" : "Product added!", "success");
      closeModal();
      loadProducts();
      loadDash();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  /* delete */
  function askDelete(id) { setDeleteId(id); setConfirmOpen(true); }

  async function doDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`${apiBase}/products/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      toast("Product deleted", "success");
      setConfirmOpen(false);
      setDeleteId(null);
      loadProducts();
      loadDash();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  /* ══════════════════════════════════════
     ORDER STATUS UPDATE
  ══════════════════════════════════════ */
  async function updateOrderStatus(orderId, status) {
  setUpdatingOrder(orderId);

  try {
    const res = await fetch(`${apiBase}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("HTTP " + res.status);

    toast(`Order status → ${status}`, "success");

    setOrders((p) =>
      p.map((o) => (o._id === orderId ? { ...o, status } : o))
    );

    loadDash();

  } catch (err) {
    toast(err.message, "error");
  } finally {
    setUpdatingOrder(null);
  }
}

  /* ══════════════════════════════════════
     SAVE API URL
  ══════════════════════════════════════ */
  function saveApi() {
    const v = apiInput.trim().replace(/\/$/, "");
    if (!v) { toast("Enter a valid URL", "error"); return; }
    setApiBase(v);
    localStorage.setItem("adm_api", v);
    setShowBanner(false);
    toast("API URL saved!", "success");
  }

  /* ══════════════════════════════════════
     DERIVED DATA
  ══════════════════════════════════════ */
  const visibleProducts = products.filter(p => {
    const mc = prodCat === "all" || p.category === prodCat;
    const q = prodSearch.toLowerCase();
    const ms = !q || (p.name || "").toLowerCase().includes(q);
    return mc && ms;
  });

  const visibleOrders = orders.filter(o => {
    const ms = ordStatus === "all" || o.status === ordStatus;
    const q = ordSearch.toLowerCase();
    const mq = !q
      || (o.farmerName || o.farmer?.name || "").toLowerCase().includes(q)
      || (o.productName || o.product?.name || "").toLowerCase().includes(q)
      || String(o._id).slice(-6).toUpperCase().includes(q.toUpperCase());
    return ms && mq;
  });

  const pendingCount = orders.filter(o => o.status === "Pending").length;

  /* ══════════════════════════════════════
     RENDER SECTIONS
  ══════════════════════════════════════ */

  /* ── DASHBOARD VIEW ── */
  const DashView = () => (
    <>
      {/* Stats */}
      <div className="stats">
        <div className="stat">
          <div className="stat-icon">📋</div>
          <div className="stat-lbl">Total Orders</div>
          <div className="stat-val">{dashLoading ? "—" : dash?.total ?? 0}</div>
          <div className="stat-sub">all time</div>
        </div>
        <div className="stat">
          <div className="stat-icon">⏳</div>
          <div className="stat-lbl">Pending</div>
          <div className="stat-val" style={{ color: "var(--amber)" }}>{dashLoading ? "—" : dash?.pending ?? 0}</div>
          <div className="stat-sub">awaiting action</div>
        </div>
        <div className="stat">
          <div className="stat-icon">🚚</div>
          <div className="stat-lbl">Shipped</div>
          <div className="stat-val" style={{ color: "var(--purple)" }}>{dashLoading ? "—" : dash?.shipped ?? 0}</div>
          <div className="stat-sub">in transit</div>
        </div>
        <div className="stat">
          <div className="stat-icon">✅</div>
          <div className="stat-lbl">Delivered</div>
          <div className="stat-val" style={{ color: "var(--green)" }}>{dashLoading ? "—" : dash?.delivered ?? 0}</div>
          <div className="stat-sub">completed</div>
        </div>
        <div className="stat">
          <div className="stat-icon">📦</div>
          <div className="stat-lbl">Products</div>
          <div className="stat-val">{dashLoading ? "—" : dash?.totalProducts ?? 0}</div>
          <div className="stat-sub">in catalog</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="sec-hdr">
        <span className="sec-title">Recent Orders</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setView("orders")}>View All →</button>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Farmer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {dashLoading ? (
              <tr><td colSpan={7} className="empty"><div style={{ display: "flex", alignItems: "center", gap: 9, justifyContent: "center" }}><div className="spin" style={{ borderTopColor: "var(--green)" }} /> Loading…</div></td></tr>
            ) : !dash?.recentOrders?.length ? (
              <tr><td colSpan={7} className="empty"><div className="empty-icon">📭</div><div className="empty-title">No Orders Yet</div></td></tr>
            ) : dash.recentOrders.map((o, i) => {
              const sm = STATUS_META[o.status] || STATUS_META.Pending;
              return (
                <tr key={o._id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <td><span className="order-id">{shortId(o._id)}</span></td>
                  <td><div className="farmer-cell"><div className="name">{o.farmer?.name || o.farmerName || "—"}</div></div></td>
                  <td>
                    <div className="prod-cell">
                      <div className="prod-thumb">
                        {o.product?.image
                          ? <img src={apiBase.replace(/\/api.*/, "") + o.product.image} alt="" onError={e => { e.target.style.display = "none"; e.target.parentNode.textContent = CAT_EMOJI.Other; }} />
                          : CAT_EMOJI.Other}
                      </div>
                      <span>{o.product?.name || o.productName || "—"}</span>
                    </div>
                  </td>
                  <td>{o.quantity}</td>
                  <td><span className="price">{fmt(o.totalPrice)}</span></td>
                  <td>
                    <span className="status-badge" style={{ color: sm.color, background: sm.bg, borderColor: sm.border }}>
                      {sm.icon} {o.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--text3)", fontSize: 11.5 }}>{timeAgo(o.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quick links */}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button className="btn btn-green" onClick={() => { setView("products"); openAdd(); }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
        <button className="btn btn-ghost" onClick={() => setView("orders")}>
          View All Orders
        </button>
      </div>
    </>
  );

  /* ── PRODUCTS VIEW ── */
  const ProductsView = () => (
    <>
      <div className="sec-hdr">
        <span className="sec-title">Product Catalog</span>
        <button className="btn btn-green btn-sm" onClick={openAdd}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
      </div>
      <div className="tbl-wrap">
        <div className="tbl-toolbar">
          {["all", ...CATS].map(c => (
            <button key={c} className={`chip${prodCat === c ? " on" : ""}`} onClick={() => setProdCat(c)}>
              {c === "all" ? "All" : c}
            </button>
          ))}
          <div style={{ marginLeft: "auto" }}>
            <button className="btn btn-ghost btn-sm" onClick={loadProducts} disabled={prodLoading}>
              {prodLoading ? <><div className="spin" /><span>Loading</span></> : "↻ Refresh"}
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th><th>Category</th><th>Price</th><th>Qty</th><th>Description</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prodLoading ? (
              <tr><td colSpan={6} className="empty"><div style={{ display: "flex", alignItems: "center", gap: 9, justifyContent: "center" }}><div className="spin" style={{ borderTopColor: "var(--green)" }} />Loading…</div></td></tr>
            ) : visibleProducts.length === 0 ? (
              <tr><td colSpan={6} className="empty">
                <div className="empty-icon">📭</div>
                <div className="empty-title">No Products</div>
                <div className="empty-sub">Add your first product</div>
                <button className="btn btn-green btn-sm" onClick={openAdd}>Add Product</button>
              </td></tr>
            ) : visibleProducts.map((p, i) => (
              <tr key={p._id} style={{ animationDelay: `${i * 0.035}s` }}>
                <td>
                  <div className="prod-cell">
                    <div className="prod-thumb">
                      {p.image
                        ? <img src={apiBase.replace(/\/api.*/, "") + p.image} alt="" onError={e => { e.target.style.display = "none"; e.target.parentNode.textContent = CAT_EMOJI[p.category] || "📦"; }} />
                        : CAT_EMOJI[p.category] || "📦"}
                    </div>
                    <div>
                      <div className="prod-name">{p.name}</div>
                      <div className="prod-id">{shortId(p._id)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 500,
                    background: "var(--green-g)", color: "var(--green)",
                    border: "1px solid rgba(107,203,139,.2)"
                  }}>{p.category || "—"}</span>
                </td>
                <td><span className="price">{fmt(p.price)}</span></td>
                <td><span className={(p.quantity || 0) < 10 ? "qty-low" : "qty-ok"}>{p.quantity ?? 0}{(p.quantity || 0) < 10 ? " ⚠" : ""}</span></td>
                <td><div className="desc">{p.description || <span style={{ color: "var(--text3)" }}>—</span>}</div></td>
                <td>
                  <div className="acts">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏ Edit</button>
                    <button className="btn btn-red btn-sm" onClick={() => askDelete(p._id)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  /* ── ORDERS VIEW ── */
  const OrdersView = () => (
    <>
      <div className="sec-hdr">
        <span className="sec-title">All Orders</span>
        <button className="btn btn-ghost btn-sm" onClick={loadOrders} disabled={ordLoading}>
          {ordLoading ? <><div className="spin" /><span>Loading</span></> : "↻ Refresh"}
        </button>
      </div>
      <div className="tbl-wrap">
        <div className="tbl-toolbar">
          {["all", ...ORDER_STATUSES].map(s => (
            <button key={s} className={`chip${ordStatus === s ? " on" : ""}`} onClick={() => setOrdStatus(s)}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <table>
          <thead>
            <tr><th>Order ID</th><th>Farmer</th><th>Product</th><th>Qty</th><th>Total</th><th>Payment</th><th>Status</th><th>Update Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {ordLoading ? (
              <tr><td colSpan={9} className="empty"><div style={{ display: "flex", alignItems: "center", gap: 9, justifyContent: "center" }}><div className="spin" style={{ borderTopColor: "var(--green)" }} />Loading…</div></td></tr>
            ) : visibleOrders.length === 0 ? (
              <tr><td colSpan={9} className="empty">
                <div className="empty-icon">🛒</div>
                <div className="empty-title">No Orders Found</div>
                <div className="empty-sub">{ordStatus !== "all" ? "Try clearing filters" : "Orders will appear here"}</div>
              </td></tr>
            ) : visibleOrders.map((o, i) => {
              const sm = STATUS_META[o.status] || STATUS_META.Pending;
              const isUpdating = updatingOrder === o._id;
              return (
                <tr key={o._id} style={{ animationDelay: `${i * 0.03}s` }}>
                  <td><span className="order-id">{shortId(o._id)}</span></td>
                  <td>
                    <div className="farmer-cell">
                      <div className="name">{o.farmer?.name || o.farmerName || "—"}</div>
                      <div className="sub">{o.farmer?.phone || o.farmer?.email || ""}</div>
                    </div>
                  </td>
                  <td>
                    <div className="prod-cell">
                      <div className="prod-thumb">
                        {o.product?.image
                          ? <img src={apiBase.replace(/\/api.*/, "") + o.product.image} alt="" onError={e => { e.target.style.display = "none"; e.target.parentNode.textContent = CAT_EMOJI.Other; }} />
                          : CAT_EMOJI[o.product?.category] || "📦"}
                      </div>
                      <div>
                        <div>{o.product?.name || o.productName || "—"}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{o.product?.category || ""}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{o.quantity}</td>
                  <td><span className="price">{fmt(o.totalPrice)}</span></td>
                  <td>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 11.5,
                      background: o.paymentType === "Online" ? "var(--blue-g)" : "var(--amber-g)",
                      color: o.paymentType === "Online" ? "var(--blue)" : "var(--amber)",
                      border: `1px solid ${o.paymentType === "Online" ? "rgba(96,174,240,.25)" : "rgba(240,180,41,.25)"}`,
                    }}>{o.paymentType || "COD"}</span>
                  </td>
                  <td>
                    <span className="status-badge" style={{ color: sm.color, background: sm.bg, borderColor: sm.border }}>
                      {sm.icon} {o.status}
                    </span>
                  </td>
                  <td>
                    {isUpdating
                      ? <div className="spin" style={{ borderTopColor: "var(--green)", margin: "0 auto" }} />
                      : (
                        <select
                          className="status-select"
                          value={o.status}
                          onChange={e => updateOrderStatus(o._id, e.target.value)}
                          disabled={o.status === "Delivered" || o.status === "Cancelled"}
                        >
                          {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      )}
                  </td>
                  <td style={{ color: "var(--text3)", fontSize: 11.5, whiteSpace: "nowrap" }}>{timeAgo(o.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );

  /* ══════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════ */
  return (
    <>
      <div className="app">
        {/* ── SIDEBAR ── */}
        <aside className="sb">
          <div className="sb-brand">
            <div className="sb-eyebrow">Admin Panel</div>
            <div className="sb-name">Farm<span>Hub</span></div>
          </div>
          <nav className="sb-nav">
            <div className="sb-section">Overview</div>
            <button className={`sb-btn${view === "dashboard" ? " on" : ""}`} onClick={() => setView("dashboard")}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Dashboard
            </button>

            <div className="sb-section" style={{ marginTop: 8 }}>Catalog</div>
            <button className={`sb-btn${view === "products" ? " on" : ""}`} onClick={() => setView("products")}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              Products
            </button>
            <button className={`sb-btn${view === "products" ? "" : ""}`} onClick={() => { setView("products"); openAdd(); }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Product
            </button>

            <div className="sb-section" style={{ marginTop: 8 }}>Orders</div>
            <button className={`sb-btn${view === "orders" ? " on" : ""}`} onClick={() => setView("orders")}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              All Orders
              {pendingCount > 0 && <span className="sb-cnt">{pendingCount}</span>}
            </button>

            <div className="sb-section" style={{ marginTop: 8 }}>Settings</div>
            <button className="sb-btn" onClick={() => { setShowBanner(true); setApiInput(apiBase); }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07"/><path d="M19.07 19.07A10 10 0 0 0 4.93 4.93"/></svg>
              API Config
            </button>
          </nav>
          <div className="sb-foot">
            <div className="sb-status">
              <div className={`cdot ${apiStatus}`} />
              <span>{apiStatus === "on" ? "Connected" : apiStatus === "off" ? "Offline" : "Connecting…"}</span>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          <div className="topbar">
            <span className="topbar-title">
              {view === "dashboard" && "Dashboard"}
              {view === "products" && "Products"}
              {view === "orders" && "Orders"}
            </span>
            <div className="searchbox">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                placeholder={view === "orders" ? "Search orders, farmers…" : "Search products…"}
                value={view === "orders" ? ordSearch : prodSearch}
                onChange={e => view === "orders" ? setOrdSearch(e.target.value) : setProdSearch(e.target.value)}
              />
            </div>
            {view === "products" && (
              <button className="btn btn-green btn-sm" onClick={openAdd}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Product
              </button>
            )}
          </div>

          <div className="content">
            {/* API Banner */}
            {showBanner && (
              <div className="api-banner">
              </div>
            )}

            {view === "dashboard" && <DashView />}
            {view === "products" && <ProductsView />}
            {view === "orders" && <OrdersView />}
          </div>
        </div>
      </div>

      {/* ── ADD / EDIT PRODUCT MODAL ── */}
      <div className={`overlay${prodModal ? " open" : ""}`} onClick={e => e.target === e.currentTarget && closeModal()}>
        <div className="modal">
          <div className="modal-hdr">
            <span className="modal-title">{editId ? "Edit Product" : "Add Product"}</span>
            <button className="modal-close" onClick={closeModal}>✕</button>
          </div>
          <div className="modal-body">
            <div className="form-grid">
              <div className="fg full">
                <label className="fl">Product Name *</label>
                <input className={`fi${errors.name ? " err" : ""}`} placeholder="e.g. Organic Wheat" value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: undefined })); }} />
                {errors.name && <span className="errmsg">{errors.name}</span>}
              </div>
              <div className="fg">
                <label className="fl">Category *</label>
                <select className={`fsel${errors.category ? " err" : ""}`} value={form.category}
                  onChange={e => { setForm(f => ({ ...f, category: e.target.value })); setErrors(er => ({ ...er, category: undefined })); }}>
                  <option value="">Select…</option>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.category && <span className="errmsg">{errors.category}</span>}
              </div>
              <div className="fg">
                <label className="fl">Price (₹) *</label>
                <input className={`fi${errors.price ? " err" : ""}`} type="number" min="0" step="0.01" placeholder="0.00" value={form.price}
                  onChange={e => { setForm(f => ({ ...f, price: e.target.value })); setErrors(er => ({ ...er, price: undefined })); }} />
                {errors.price && <span className="errmsg">{errors.price}</span>}
              </div>
              <div className="fg">
                <label className="fl">Quantity *</label>
                <input className={`fi${errors.quantity ? " err" : ""}`} type="number" min="0" placeholder="0" value={form.quantity}
                  onChange={e => { setForm(f => ({ ...f, quantity: e.target.value })); setErrors(er => ({ ...er, quantity: undefined })); }} />
                {errors.quantity && <span className="errmsg">{errors.quantity}</span>}
              </div>
              <div className="fg full">
                <label className="fl">Description</label>
                <textarea className="fta" placeholder="Optional description…" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="fg full">
                <label className="fl">Product Image</label>
                {imgPrev ? (
                  <div className="img-prev">
                    <img src={imgPrev} alt="preview" />
                    <button className="img-rm" onClick={() => { setImgFile(null); setImgPrev(null); }}>✕</button>
                  </div>
                ) : (
                  <div className={`upload-zone${drag ? " drag" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={e => { e.preventDefault(); setDrag(false); pickImage(e.dataTransfer.files[0]); }}>
                    <input type="file" accept="image/*" onChange={e => pickImage(e.target.files[0])} />
                    <div className="upload-ico">🖼️</div>
                    <div className="upload-txt">Drag & drop or click to upload</div>
                    <div className="upload-sub">PNG, JPG, WEBP — max 5 MB</div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-ftr">
              <button className="btn btn-ghost" onClick={closeModal} disabled={submitting}>Cancel</button>
              <button className="btn btn-green" onClick={submitProduct} disabled={submitting}>
                {submitting ? <><div className="spin" /><span>{editId ? "Saving…" : "Adding…"}</span></> : <span>{editId ? "Save Changes" : "Add Product"}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── DELETE CONFIRM ── */}
      <div className={`overlay${confirmOpen ? " open" : ""}`} onClick={e => e.target === e.currentTarget && !deleting && setConfirmOpen(false)}>
        <div className="confirm-box">
          <div className="confirm-ico">🗑️</div>
          <div className="confirm-title">Delete Product?</div>
          <div className="confirm-text">This will permanently remove the product. This cannot be undone.</div>
          <div className="confirm-acts">
            <button className="btn btn-ghost" onClick={() => setConfirmOpen(false)} disabled={deleting}>Cancel</button>
            <button className="btn btn-red" onClick={doDelete} disabled={deleting}>
              {deleting ? <><div className="spin" /><span>Deleting…</span></> : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {/* ── TOASTS ── */}
      <div className="toasts">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </>
  );
}