import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LandingPage } from "@/pages/LandingPage";
import { ListingPage } from "@/pages/ListingPage";
import { CartPage } from "@/pages/CartPage";
import { AuthPage } from "@/pages/AuthPage";
import { ProfilePage } from "@/pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/carpets" element={<ListingPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
