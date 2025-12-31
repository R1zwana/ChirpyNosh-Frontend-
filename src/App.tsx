import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Expiration from "./pages/Expiration";
import Recipes from "./pages/Recipes";
import PartnerSignup from "./pages/PartnerSignup";
import RecipientSignup from "./pages/RecipientSignup";
import AddListing from "./pages/AddListing";
import Partners from "./pages/Partners";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/expiration" element={<Expiration />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/partner-signup" element={<PartnerSignup />} />
        <Route path="/recipient-signup" element={<RecipientSignup />} />
        <Route path="/add-listing" element={<AddListing />} />
        <Route path="/partners" element={<Partners />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
