import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {

const [otp,setOtp] = useState(["","","","","",""]);
const navigate = useNavigate();
const location = useLocation();

const email = location.state?.email;

const handleChange = (value,index)=>{

if(!/^[0-9]?$/.test(value)) return;

const newOtp = [...otp];
newOtp[index] = value;
setOtp(newOtp);

if(value && index < 5){
document.getElementById(`otp-${index+1}`).focus();
}

};

const handleSubmit = async (e)=>{
e.preventDefault();

const finalOtp = otp.join("");

try{

const res = await axios.post(
"http://localhost:5001/api/auth/verify-otp",
{ email, otp: finalOtp }
);

alert("Account verified successfully");

const role = res.data.role;

// redirect based on role
if(role === "farmer"){
navigate("/farmer");
}
else if(role === "buyer"){
navigate("/buyer");
}
else{
navigate("/login");
}

}catch(err){

alert(err.response?.data?.message || "Invalid OTP");

}

};

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

<h2 className="text-2xl font-bold text-center mb-2">
Verify OTP
</h2>

<p className="text-gray-500 text-center mb-6">
Enter the 6‑digit code sent to your email
</p>

<form onSubmit={handleSubmit} className="space-y-6">

<div className="flex justify-between">

{otp.map((digit,index)=>(
<input
key={index}
id={`otp-${index}`}
type="text"
maxLength="1"
value={digit}
onChange={(e)=>handleChange(e.target.value,index)}
className="w-12 h-12 text-center text-xl border rounded-lg focus:ring-2 focus:ring-green-500"
/>
))}

</div>

<button
type="submit"
className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
>

Verify OTP

</button>

</form>

</div>

</div>

)

};

export default VerifyOTP;