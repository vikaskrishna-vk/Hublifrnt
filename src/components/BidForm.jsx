import { useState } from "react";
import { placeBid } from "../api/auctionApi"; // ⚠️ IMPORTANT IMPORT

export function BidForm({ auctionId, currentHighest, onBidPlaced }) {
  const [buyerName, setBuyerName] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = Number(bidAmount);

    if (!buyerName.trim() || !amount) {
      alert("Please fill all fields");
      return;
    }

    if (amount <= currentHighest) {
      alert(`Bid must be higher than ₹${currentHighest}`);
      return;
    }

    setLoading(true);

    try {
      await placeBid(auctionId, {
        bidder: buyerName.trim(),
        bid: amount,
      });

      alert(`Your bid of ₹${amount} was placed successfully`);

      setBuyerName("");
      setBidAmount("");

      onBidPlaced();
    } catch (err) {
      console.log("BID ERROR:", err.response?.data);

      alert(err.response?.data?.message || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Your Name"
        value={buyerName}
        onChange={(e) => setBuyerName(e.target.value)}
        className="border p-2 rounded-md"
      />

      <input
        type="number"
        placeholder="Bid Amount (₹)"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        className="border p-2 rounded-md"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      >
        {loading ? "Placing..." : "Place Bid"}
      </button>
    </form>
  );
}
