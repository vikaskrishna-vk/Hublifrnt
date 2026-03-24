import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import DealerDashboard from "./pages/DealerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AuctionPage from "./pages/AuctionPage";
import FertilizerMarket from "./pages/FertilizerMarket";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import KisanSahayak from "./pages/KisanSahayak"; 
import CreateAuction from "./pages/CreateAuction"
import MarketPrice from "./pages/MarketPrice"
import LandingPage from "./pages/LandingPage";








function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage  />} />
         <Route path="/login" element={<Login />} />
         <Route path="/login" element={<Login />} />
        <Route path="/government-schemes" element={<KisanSahayak />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/dealer" element={<DealerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/auction" element={<AuctionPage />} />
        <Route path="/auction" element={<AuctionPage />} />
        <Route path="/fertilizers" element={<FertilizerMarket />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/dealer" element={<DealerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/auction" element={<AuctionPage />} />
       <Route path="/create-auction" element={<CreateAuction />} />
       <Route path="/market-price" element={<MarketPrice />} />
         <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
 

      </Routes>
    </BrowserRouter>
  );
}

export default App;