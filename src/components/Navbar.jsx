import { Link } from "react-router-dom";

function Navbar(){

return(

<div style={{background:"#333",padding:"10px"}}>

<Link to="/" style={{color:"white",marginRight:"20px"}}>Home</Link>
<Link to="/auction" style={{color:"white",marginRight:"20px"}}>Auction</Link>
<Link to="/fertilizers" style={{color:"white"}}>Fertilizers</Link>

</div>

)

}

export default Navbar