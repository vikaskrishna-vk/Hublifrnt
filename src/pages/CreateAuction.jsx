import { useState } from "react";
import axios from "axios";

const CreateAuction = () => {

const [cropName,setCropName] = useState("")
const [quantity,setQuantity] = useState("")
const [basePrice,setBasePrice] = useState("")

const createAuction = async()=>{

try{

await axios.post(
"http://localhost:5001/api/auction/create",
{
cropName,
quantity,
basePrice
}
)

alert("Auction Created")

}catch(err){

alert("Error creating auction")

}

}

return (

<div className="min-h-screen bg-gray-100 p-8">

<h1 className="text-3xl font-bold mb-6">
Create Crop Auction
</h1>

<div className="bg-white p-6 rounded shadow max-w-md">

<input
placeholder="Crop Name"
className="border p-3 rounded w-full mb-3"
onChange={(e)=>setCropName(e.target.value)}
/>

<input
placeholder="Quantity"
className="border p-3 rounded w-full mb-3"
onChange={(e)=>setQuantity(e.target.value)}
/>

<input
placeholder="Base Price"
className="border p-3 rounded w-full mb-3"
onChange={(e)=>setBasePrice(e.target.value)}
/>

<button
onClick={createAuction}
className="bg-green-600 text-white px-4 py-2 rounded w-full"
>
Create Auction
</button>

</div>

</div>

)

}

export default CreateAuction