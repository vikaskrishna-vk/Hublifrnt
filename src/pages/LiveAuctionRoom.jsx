// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { getAllAuctions, placeBid } from "../api/auctionApi";

// import BidHistory from "../components/BidHistory";
// import BidChart from "../components/BidChart";
// import CountdownTimer from "../components/CountdownTimer";
// import LoadingSpinner from "../components/LoadingSpinner";

// import {
//   ArrowLeft,
//   Gavel,
//   IndianRupee,
//   Trophy,
//   User,
//   Phone
// } from "lucide-react";

// export default function LiveAuctionRoom() {

//   const { id } = useParams();

//   const [auction, setAuction] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [bids, setBids] = useState([]);
//   const [buyerName, setBuyerName] = useState("");
//   const [bidAmount, setBidAmount] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [auctionEnded, setAuctionEnded] = useState(false);

//   useEffect(() => {

//     getAllAuctions()
//       .then((res) => {

//         const found = res.data.find((a) => a._id === id);

//         if (found) {
//           setAuction(found);
//           setAuctionEnded(found.status === "closed");
//         }

//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));

//   }, [id]);

//   const handleBid = async (e) => {

//     e.preventDefault();

//     if (!auction) return;

//     const amount = Number(bidAmount);

//     if (!buyerName.trim() || !amount) {
//       alert("Fill all fields");
//       return;
//     }

//     const currentHighest = auction.highestBid || auction.basePrice;

//     if (amount <= currentHighest) {
//       alert(`Bid must be higher than ₹${currentHighest}`);
//       return;
//     }

//     setSubmitting(true);

//     try {

//       await placeBid(id, {
//         bidder: buyerName.trim(),
//         bid: amount
//       });

//       setBids((prev) => [
//         { bidderName: buyerName.trim(), amount, time: new Date().toISOString() },
//         ...prev
//       ]);

//       setAuction((prev) => ({
//         ...prev,
//         highestBid: amount,
//         highestBidder: buyerName.trim()
//       }));

//       setBidAmount("");

//     } catch {

//       alert("Failed to place bid");

//     } finally {

//       setSubmitting(false);

//     }

//   };

//   if (loading) return <LoadingSpinner />;

//   if (!auction) return <p className="p-4">Auction not found</p>;

//   if (auctionEnded) {
//     return (
//       <div className="max-w-lg mx-auto text-center py-12">

//         <Trophy className="mx-auto h-10 w-10 text-yellow-500 mb-4" />

//         <h1 className="text-2xl font-bold mb-2">
//           Auction Closed
//         </h1>

//         <p className="text-lg">
//           Winner: {auction.highestBidder || "—"}
//         </p>

//         <p className="text-xl font-bold text-green-600 flex justify-center items-center gap-1 mt-2">
//           <IndianRupee className="h-5 w-5" />
//           {auction.highestBid || "—"}
//         </p>

//         <p className="text-sm text-gray-500 mt-2 flex justify-center items-center gap-1">
//           <Phone className="h-4 w-4" />
//           Contact the buyer to complete the transaction
//         </p>

//         <Link to="/buyer">
//           <button className="mt-6 border px-4 py-2 rounded hover:bg-gray-100">
//             <ArrowLeft className="inline h-4 w-4 mr-1" />
//             Back to Auctions
//           </button>
//         </Link>

//       </div>
//     );
//   }

//   return (

//     <div className="space-y-6">

//       <div>

//         <Link
//           to="/buyer"
//           className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-2"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </Link>

//         <h1 className="text-2xl font-bold">
//           {auction.cropName}
//         </h1>

//         <p className="text-sm text-gray-500">
//           Qty: {auction.quantity} kg · Base: ₹{auction.basePrice}
//         </p>

//       </div>

//       {auction.endTime && (
//         <CountdownTimer
//           endTime={auction.endTime}
//           onExpired={() => setAuctionEnded(true)}
//         />
//       )}

//       {/* Live Stats */}

//       <div className="grid gap-4 sm:grid-cols-3">

//         <div className="border p-4 rounded">

//           <p className="text-xs text-gray-500">
//             Highest Bid
//           </p>

//           <p className="text-xl font-bold flex items-center gap-1 text-green-600">
//             <IndianRupee className="h-4 w-4" />
//             {auction.highestBid || "—"}
//           </p>

//         </div>

//         <div className="border p-4 rounded">

//           <p className="text-xs text-gray-500">
//             Highest Bidder
//           </p>

//           <p className="font-semibold">
//             {auction.highestBidder || "—"}
//           </p>

//         </div>

//         <div className="border p-4 rounded">

//           <p className="text-xs text-gray-500">
//             Total Bids
//           </p>

//           <p className="text-xl font-bold flex items-center gap-1">
//             <Gavel className="h-4 w-4" />
//             {bids.length}
//           </p>

//         </div>

//       </div>

//       <div className="grid gap-6 lg:grid-cols-2">

//         <div className="space-y-6">

//           <BidChart bids={bids} />

//           <div className="border p-5 rounded">

//             <h3 className="font-semibold mb-3">
//               Place Your Bid
//             </h3>

//             <form onSubmit={handleBid} className="flex flex-col gap-3">

//               <input
//                 placeholder="Your Name"
//                 value={buyerName}
//                 onChange={(e) => setBuyerName(e.target.value)}
//                 className="border p-2 rounded"
//               />

//               <input
//                 type="number"
//                 placeholder={`Min ₹${(auction.highestBid || auction.basePrice) + 1}`}
//                 value={bidAmount}
//                 onChange={(e) => setBidAmount(e.target.value)}
//                 className="border p-2 rounded"
//               />

//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
//               >

//                 {submitting ? "Placing..." : "Place Bid"}

//               </button>

//             </form>

//           </div>

//         </div>

//         <BidHistory bids={bids} />

//       </div>

//     </div>

//   );
// }