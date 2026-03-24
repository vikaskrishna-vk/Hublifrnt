import { useEffect, useState } from "react";
import axios from "axios";

const MarketPrice = () => {

const [prices,setPrices] = useState([])

useEffect(()=>{
fetchPrices()
},[])

const fetchPrices = async()=>{

const res = await axios.get(
"http://localhost:5001/api/auction/market-price"
)

setPrices(res.data)

}

return (

<div className="min-h-screen p-8">

<h1 className="text-3xl font-bold mb-6">
Today's Market Prices
</h1>

{prices.map((p)=>(
<div
key={p._id}
className="bg-white p-4 rounded shadow mb-4"
>

<h2 className="font-bold">
{p.cropName}
</h2>

<p>
Final Price: ₹{p.highestBid}
</p>

</div>
))}

</div>

)

}

export default MarketPrice