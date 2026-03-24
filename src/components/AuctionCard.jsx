import { Sprout, TrendingUp } from "lucide-react";

export function AuctionCard({ auction, actions }) {
  const isActive = auction.status === "active";

  return (
    <div className="rounded-lg border bg-white p-5 shadow hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Sprout className="h-5 w-5 text-green-600" />
          </div>

          <div>
            <h3 className="font-semibold">{auction.cropName}</h3>

            <p className="text-sm text-gray-500">Qty: {auction.quantity} kg</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-2 py-1 text-xs rounded-md font-medium ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {isActive ? "Active" : "Closed"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-gray-100 p-3">
          <p className="text-xs text-gray-500">Base Price</p>

          <p className="text-sm font-semibold">₹{auction.basePrice}</p>
        </div>

        <div className="rounded-md bg-green-100 p-3">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600" />

            <p className="text-xs text-green-600">Highest Bid</p>
          </div>

          <p className="text-sm font-bold text-green-600">
            ₹{auction.highestBid || "—"}
          </p>
        </div>
      </div>

      {auction.highestBidder && (
        <p className="mt-3 text-xs text-gray-500">
          Highest Bidder:
          <span className="font-medium text-black ml-1">
            {auction.highestBidder}
          </span>
        </p>
      )}

      {actions && <div className="mt-4">{actions}</div>}
    </div>
  );
}
