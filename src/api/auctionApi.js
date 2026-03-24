import axios from "axios";

const API = axios.create({
  baseURL: "https://hublibck.onrender.com/api/auction",
});

// get all auctions
export const getAllAuctions = () => API.get("/");

// place bid
export const placeBid = (id, data) => API.post(`/bid/${id}`, data);

// get closed auctions for market price
export const getMarketPrices = () => API.get("/market-price");
