import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { ArrowLeft, Gavel, Clock, TrendingUp, User, Phone, Trophy } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const socket = io("http://localhost:5001");

const CSS = `
/* ── GLOBAL FULLSCREEN ── */
html,body{margin:0!important;padding:0!important;width:100%!important;min-height:100vh!important;background:#000!important;overflow-x:hidden}
#root{width:100%!important;min-height:100vh!important;background:#000!important}

@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

/* ── FULLSCREEN OVERRIDE ── */
html,body{margin:0!important;padding:0!important;width:100%!important;min-height:100vh!important;background:#000!important;overflow-x:hidden}
#root{width:100%!important;min-height:100vh!important;background:#000!important}
.ap*{box-sizing:border-box}
.ap{
  --bg:#000000;--bg1:#0a0a0a;--bg2:#111111;--bg3:#181818;
  --line:#1e1e1e;--line2:#2a2a2a;
  --lime:#b5e550;--lime-d:rgba(181,229,80,.12);--lime-g:rgba(181,229,80,.22);
  --amber:#f5c842;--amber-d:rgba(245,200,66,.12);
  --terra:#e8714a;--terra-d:rgba(232,113,74,.12);
  --sky:#6bc5e8;--sky-d:rgba(107,197,232,.12);
  --text:#e8e8e8;--text2:#666666;--text3:#333333;
  --r:12px;--rl:18px;--t:.2s cubic-bezier(.4,0,.2,1);
  --fd:'Sora',sans-serif;--fb:'DM Sans',sans-serif;--fm:'JetBrains Mono',monospace;
  font-family:var(--fb);background:var(--bg);color:var(--text);
  min-height:100vh;-webkit-font-smoothing:antialiased;
  padding:28px;width:100%;
}
.ap-page-title{
  font-family:var(--fd);font-size:28px;font-weight:800;
  color:var(--text);letter-spacing:-.5px;margin-bottom:6px;
  display:flex;align-items:center;gap:12px;
}
.ap-page-sub{font-size:14px;color:var(--text2);margin-bottom:28px}
.ap-live-dot{
  width:10px;height:10px;border-radius:50%;background:var(--terra);
  box-shadow:0 0 10px var(--terra);animation:lp 2s infinite;
  display:inline-block;flex-shrink:0;
}
@keyframes lp{0%,100%{opacity:1}50%{opacity:.3}}
/* AUCTION GRID */
.ap-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
.ap-card{
  background:var(--bg1);border:1px solid var(--line);border-radius:var(--rl);
  padding:24px;position:relative;overflow:hidden;
  transition:all var(--t);display:flex;flex-direction:column;
}
.ap-card:hover{border-color:var(--line2);transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.4)}
.ap-card-accent{
  position:absolute;top:0;left:0;right:0;height:3px;
}
.ap-card-live .ap-card-accent{background:linear-gradient(90deg,var(--lime),var(--sky))}
.ap-card-closed .ap-card-accent{background:linear-gradient(90deg,var(--terra),transparent)}
.ap-card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px}
.ap-crop-name{font-family:var(--fd);font-size:19px;font-weight:700;color:var(--text);letter-spacing:-.3px}
.ap-status-live{
  display:inline-flex;align-items:center;gap:5px;
  padding:4px 11px;border-radius:20px;font-size:11px;font-weight:700;
  background:var(--lime-d);color:var(--lime);border:1px solid rgba(181,229,80,.3);
}
.ap-status-closed{
  display:inline-flex;align-items:center;gap:5px;
  padding:4px 11px;border-radius:20px;font-size:11px;font-weight:700;
  background:var(--terra-d);color:var(--terra);border:1px solid rgba(232,113,74,.3);
}
.ap-card-meta{display:flex;flex-direction:column;gap:6px;margin-bottom:18px}
.ap-meta-row{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--text2)}
.ap-meta-row svg{opacity:.6;flex-shrink:0}
.ap-card-price{
  background:var(--bg2);border:1px solid var(--line);border-radius:10px;
  padding:12px 16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;
}
.ap-price-label{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--text3);margin-bottom:3px}
.ap-price-value{font-family:var(--fm);font-size:20px;font-weight:600;color:var(--lime)}
.ap-ends{font-size:12px;color:var(--terra);margin-bottom:16px;display:flex;align-items:center;gap:5px}
.ap-join-btn{
  width:100%;padding:12px;border-radius:10px;border:none;cursor:pointer;
  background:var(--lime);color:#000000;font-family:var(--fd);font-size:14px;font-weight:700;
  transition:all var(--t);display:flex;align-items:center;justify-content:center;gap:7px;
}
.ap-join-btn:hover:not(:disabled){background:#c8f060;box-shadow:0 0 20px rgba(181,229,80,.3);transform:translateY(-1px)}
.ap-join-btn:disabled{background:var(--bg3);color:var(--text3);cursor:not-allowed}

/* AUCTION ROOM */
.ap-room{display:grid;grid-template-columns:1fr 1.2fr;gap:24px}
@media(max-width:900px){.ap-room{grid-template-columns:1fr}}
.ap-room-panel{background:var(--bg1);border:1px solid var(--line);border-radius:var(--rl);padding:24px}
.ap-room-title{font-family:var(--fd);font-size:17px;font-weight:700;color:var(--text);margin-bottom:20px}
.ap-back-btn{
  display:inline-flex;align-items:center;gap:7px;
  background:none;border:none;color:var(--text2);font-size:13.5px;font-weight:500;
  cursor:pointer;font-family:var(--fb);padding:0;margin-bottom:20px;
  transition:color var(--t);
}
.ap-back-btn:hover{color:var(--lime)}
.ap-auction-hero{
  background:var(--bg2);border:1px solid var(--line);border-radius:14px;
  padding:20px;margin-bottom:20px;position:relative;overflow:hidden;
}
.ap-auction-hero::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,var(--lime),var(--sky));
}
.ap-auction-name{font-family:var(--fd);font-size:22px;font-weight:800;color:var(--text);margin-bottom:12px}
.ap-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.ap-info-item{background:var(--bg3);border-radius:9px;padding:10px 14px}
.ap-info-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:var(--text3);margin-bottom:3px}
.ap-info-val{font-size:13.5px;font-weight:500;color:var(--text)}
.ap-highest{
  background:var(--lime-d);border:1px solid rgba(181,229,80,.2);border-radius:10px;
  padding:12px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;
}
.ap-highest-lbl{font-size:11px;color:var(--text2)}
.ap-highest-val{font-family:var(--fm);font-size:24px;font-weight:700;color:var(--lime)}
.ap-timer{
  display:flex;align-items:center;gap:7px;
  padding:8px 14px;border-radius:9px;
  background:var(--terra-d);border:1px solid rgba(232,113,74,.2);
  font-family:var(--fm);font-size:15px;font-weight:600;color:var(--terra);width:fit-content;
}
.ap-bid-input{
  background:var(--bg2);border:1px solid var(--line2);border-radius:10px;
  padding:12px 16px;color:var(--text);font-family:var(--fm);font-size:16px;
  outline:none;width:100%;margin:16px 0 12px;
  transition:all var(--t);
}
.ap-bid-input:focus{border-color:var(--lime);box-shadow:0 0 0 3px rgba(181,229,80,.15)}
.ap-bid-input::placeholder{color:var(--text3);font-family:var(--fb);font-size:14px}
.ap-bid-btn{
  width:100%;padding:13px;border-radius:10px;border:none;cursor:pointer;
  background:var(--lime);color:#000000;font-family:var(--fd);font-size:14px;font-weight:800;
  transition:all var(--t);display:flex;align-items:center;justify-content:center;gap:8px;
}
.ap-bid-btn:hover:not(:disabled){background:#c8f060;box-shadow:0 0 24px rgba(181,229,80,.4)}
.ap-bid-btn:disabled{background:var(--bg3);color:var(--text3);cursor:not-allowed}
/* BIDS FEED */
.ap-bid-item{
  display:flex;align-items:center;justify-content:space-between;
  padding:12px 0;border-bottom:1px solid rgba(42,61,32,.4);
  animation:slideIn .25s ease;
}
@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.ap-bid-item:last-child{border-bottom:none}
.ap-bid-name{font-size:14px;font-weight:600;color:var(--text)}
.ap-bid-time{font-size:11px;color:var(--text3);margin-top:2px}
.ap-bid-amount{font-family:var(--fm);font-size:17px;font-weight:700;color:var(--lime)}
.ap-bid-item:first-child .ap-bid-amount{color:var(--amber)}
.ap-no-bids{text-align:center;padding:40px 20px;color:var(--text3)}
.ap-no-bids-icon{font-size:32px;margin-bottom:10px;opacity:.3}
`;

const AuctionPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [liveBids, setLiveBids] = useState([]);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");
  const [candleData, setCandleData] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    fetchAuctions();
    socket.on("newBid", (bid) => {
      setLiveBids(prev => [bid, ...prev]);
      setHighestBid(bid.amount);
      setHighestBidder(bid.bidder);
      setCandleData(prev => [...prev, { x: new Date(), o: prev.length ? prev[prev.length - 1].c : bid.amount, h: bid.amount, l: bid.amount, c: bid.amount }]);
    });
    return () => socket.off("newBid");
  }, []);

  useEffect(() => {
    if (!selectedAuction) return;
    const timer = setInterval(() => {
      const diff = new Date(selectedAuction.endTime) - new Date();
      if (diff <= 0) { setTimeLeft("Auction Closed"); clearInterval(timer); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedAuction]);

  const fetchAuctions = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/auction");
      setAuctions(res.data);
    } catch (err) { console.log("Error fetching auctions"); }
  };

  const joinAuction = async (auction) => {
    setSelectedAuction(auction);
    setHighestBid(auction.highestBid);
    setHighestBidder(auction.highestBidder);
    try {
      const res = await axios.get(`http://localhost:5001/api/auction/bids/${auction._id}`);
      setLiveBids(res.data);
    } catch (err) { console.log("Error fetching bids"); }
    setCandleData([{ x: new Date(), o: auction.basePrice, h: auction.basePrice, l: auction.basePrice, c: auction.basePrice }]);
  };

  const placeBid = async () => {
    const amount = Number(bidAmount);
    if (!amount) return;
    try {
      const res = await axios.post(`http://localhost:5001/api/auction/bid/${selectedAuction._id}`, {
        bid: amount, bidder: user?.name || "Buyer"
      });
      const bidData = {
        bidder: res.data?.bid?.bidder || user?.name || "Buyer",
        amount: res.data?.bid?.amount || amount,
        time: res.data?.bid?.time || new Date().toLocaleTimeString()
      };
      setLiveBids(prev => [bidData, ...prev]);
      setHighestBid(bidData.amount);
      setHighestBidder(bidData.bidder);
      setCandleData(prev => {
        const lastClose = prev.length ? prev[prev.length - 1].c : bidData.amount;
        return [...prev, { x: new Date(), o: lastClose, h: Math.max(lastClose, bidData.amount), l: Math.min(lastClose, bidData.amount), c: bidData.amount }];
      });
      socket.emit("placeBid", bidData);
      setBidAmount("");
    } catch (err) { console.log("Bid failed", err); }
  };

  const isClosed = (endTime) => endTime && new Date(endTime) < new Date();

  const chartData = {
    labels: liveBids.map(bid => bid.time),
    datasets: [{
      label: "Bid Price (₹)",
      data: liveBids.map(bid => bid.amount),
      backgroundColor: liveBids.map((_, i) => i === 0 ? "rgba(245,200,66,0.8)" : "rgba(181,229,80,0.5)"),
      borderRadius: 4,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#162010",
        borderColor: "#3a5028",
        borderWidth: 1,
        titleColor: "#7a9a68",
        bodyColor: "#d8e8c8",
        callbacks: { label: ctx => `₹${ctx.parsed.y.toLocaleString()}` }
      }
    },
    scales: {
      x: { ticks: { color: "#3d5530", font: { size: 10 } }, grid: { color: "rgba(42,61,32,.4)" } },
      y: { ticks: { color: "#3d5530", callback: v => `₹${v}` }, grid: { color: "rgba(42,61,32,.4)" } }
    }
  };

  return (
    <div className="ap">

      {!selectedAuction ? (
        <>
          <div className="ap-page-title">
            <Gavel size={26} style={{ color: "var(--lime)" }} />
            Live Crop Auctions
          </div>
          <div className="ap-page-sub">
            {auctions.filter(a => !isClosed(a.endTime)).length} active auctions · Bids update in real-time
          </div>

          <div className="ap-grid">
            {auctions.map((auction) => {
              const closed = isClosed(auction.endTime);
              return (
                <div key={auction._id} className={`ap-card ${closed ? "ap-card-closed" : "ap-card-live"}`}>
                  <div className="ap-card-accent" />
                  <div className="ap-card-header">
                    <div className="ap-crop-name">{auction.cropName}</div>
                    {closed
                      ? <span className="ap-status-closed">✓ Closed</span>
                      : <span className="ap-status-live"><span className="ap-live-dot" /> Live</span>
                    }
                  </div>
                  <div className="ap-card-meta">
                    <div className="ap-meta-row"><User size={13} /> {auction.farmerName}</div>
                    <div className="ap-meta-row"><Phone size={13} /> {auction.farmerPhone}</div>
                    <div className="ap-meta-row"><TrendingUp size={13} /> {auction.quantity}</div>
                  </div>
                  <div className="ap-card-price">
                    <div>
                      <div className="ap-price-label">Base Price</div>
                      <div className="ap-price-value">₹{auction.basePrice}</div>
                    </div>
                    {auction.highestBid > 0 && (
                      <div style={{ textAlign: "right" }}>
                        <div className="ap-price-label">Highest Bid</div>
                        <div className="ap-price-value" style={{ color: "var(--amber)" }}>₹{auction.highestBid}</div>
                      </div>
                    )}
                  </div>
                  <div className="ap-ends">
                    <Clock size={13} />
                    {closed ? "Ended" : "Ends"}: {new Date(auction.endTime).toLocaleString()}
                  </div>
                  <button className="ap-join-btn" onClick={() => joinAuction(auction)} disabled={closed}>
                    {closed ? "Auction Closed" : <><Gavel size={15} /> Join Auction</>}
                  </button>
                </div>
              );
            })}
            {auctions.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 20px", color: "var(--text3)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🌾</div>
                <div style={{ fontFamily: "var(--fd)", fontSize: 20, color: "var(--text2)", marginBottom: 8 }}>No auctions available</div>
                <div style={{ fontSize: 14 }}>Check back later for live crop auctions</div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <button className="ap-back-btn" onClick={() => setSelectedAuction(null)}>
            <ArrowLeft size={16} /> Back to Auctions
          </button>
          <div className="ap-room">

            {/* LEFT PANEL */}
            <div>
              <div className="ap-room-panel" style={{ marginBottom: 20 }}>
                <div className="ap-auction-hero">
                  <div className="ap-auction-name">{selectedAuction.cropName}</div>
                  <div className="ap-info-grid">
                    <div className="ap-info-item">
                      <div className="ap-info-lbl">Quantity</div>
                      <div className="ap-info-val">{selectedAuction.quantity}</div>
                    </div>
                    <div className="ap-info-item">
                      <div className="ap-info-lbl">Farmer</div>
                      <div className="ap-info-val">{selectedAuction.farmerName}</div>
                    </div>
                    <div className="ap-info-item">
                      <div className="ap-info-lbl">Contact</div>
                      <div className="ap-info-val">{selectedAuction.farmerPhone}</div>
                    </div>
                    <div className="ap-info-item">
                      <div className="ap-info-lbl">Base Price</div>
                      <div className="ap-info-val" style={{ fontFamily: "var(--fm)", color: "var(--lime)" }}>₹{selectedAuction.basePrice}</div>
                    </div>
                  </div>
                </div>

                <div className="ap-highest">
                  <div>
                    <div className="ap-highest-lbl">Highest Bid by {highestBidder || "—"}</div>
                    <div className="ap-highest-val">₹{highestBid || selectedAuction.basePrice}</div>
                  </div>
                  <Trophy size={22} style={{ color: "var(--amber)", opacity: 0.8 }} />
                </div>

                <div className="ap-timer">
                  <Clock size={15} /> {timeLeft || "Calculating…"}
                </div>

                <input
                  type="number"
                  className="ap-bid-input"
                  placeholder={`Enter bid above ₹${highestBid || selectedAuction.basePrice}`}
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  disabled={isClosed(selectedAuction.endTime)}
                />
                <button
                  className="ap-bid-btn"
                  onClick={placeBid}
                  disabled={isClosed(selectedAuction.endTime)}
                >
                  <Gavel size={16} />
                  {isClosed(selectedAuction.endTime) ? "Auction Closed" : "Place Bid"}
                </button>
              </div>

              <div className="ap-room-panel">
                <div className="ap-room-title">📊 Live Trading Chart</div>
                {liveBids.length > 0
                  ? <Bar data={chartData} options={chartOptions} />
                  : <div className="ap-no-bids"><div className="ap-no-bids-icon">📊</div><div>No chart data yet</div></div>
                }
              </div>
            </div>

            {/* RIGHT PANEL — LIVE BIDS */}
            <div className="ap-room-panel" style={{ maxHeight: "80vh", overflowY: "auto" }}>
              <div className="ap-room-title">
                ⚡ Live Bids
                <span style={{ fontFamily: "var(--fm)", fontSize: 13, color: "var(--text3)", marginLeft: 10, fontWeight: 400 }}>
                  {liveBids.length} bids
                </span>
              </div>

              {liveBids.length === 0 ? (
                <div className="ap-no-bids">
                  <div className="ap-no-bids-icon">🔨</div>
                  <div style={{ fontFamily: "var(--fd)", fontSize: 16, color: "var(--text2)", marginBottom: 6 }}>No bids yet</div>
                  <div style={{ fontSize: 13 }}>Be the first to place a bid</div>
                </div>
              ) : liveBids.map((bid, i) => (
                <div key={i} className="ap-bid-item">
                  <div>
                    <div className="ap-bid-name">{bid.bidder}</div>
                    <div className="ap-bid-time">{bid.time}</div>
                  </div>
                  <div className="ap-bid-amount">₹{bid.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default AuctionPage;