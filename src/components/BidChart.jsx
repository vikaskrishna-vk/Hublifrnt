// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export function BidChart({ bids }) {

//   const data = [...bids]
//     .reverse()
//     .map((b) => ({
//       time: new Date(b.time).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       amount: b.amount,
//     }));

//   if (data.length === 0) {
//     return (
//       <div className="flex h-48 items-center justify-center rounded-lg border bg-white text-sm text-gray-500">
//         Bid chart will appear after bids are placed
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-lg border bg-white p-4 shadow">

//       <h3 className="mb-3 font-semibold">
//         Bid History Chart
//       </h3>

//       <div className="h-48 w-full">

//         <ResponsiveContainer width="100%" height="100%">

//           <AreaChart data={data}>

//             <CartesianGrid strokeDasharray="3 3" />

//             <XAxis dataKey="time" />

//             <YAxis />

//             <Tooltip />

//             <defs>
//               <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">

//                 <stop offset="0%" stopColor="#16a34a" stopOpacity={0.4} />

//                 <stop offset="100%" stopColor="#16a34a" stopOpacity={0.05} />

//               </linearGradient>
//             </defs>

//             <Area
//               type="monotone"
//               dataKey="amount"
//               stroke="#16a34a"
//               strokeWidth={2}
//               fill="url(#bidGradient)"
//               dot={{ r: 4 }}
//               animationDuration={500}
//             />

//           </AreaChart>

//         </ResponsiveContainer>

//       </div>

//     </div>
//   );
// }