import { useEffect,useState } from "react";
import axios from "axios";

function FertilizerMarket(){

const [items,setItems] = useState([]);

useEffect(()=>{

axios.get("http://localhost:5001/api/fertilizers")
.then(res=>setItems(res.data))

},[])

return(

<div>

<h2>Fertilizer Market</h2>

{items.map(item=>(
<div key={item._id}>

<h3>{item.name}</h3>
<p>Price: ₹{item.price}</p>
<p>Stock: {item.quantity}</p>

<button>Buy</button>

</div>
))}

</div>

)

}

export default FertilizerMarket