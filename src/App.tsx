import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LandingPage } from "@/pages/LandingPage";
import { ListingPage } from "@/pages/ListingPage";
import { CartPage } from "@/pages/CartPage";
import { AuthPage } from "@/pages/AuthPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { CheckoutCompletePage } from "@/pages/CheckoutCompletePage";
import { WishlistPage } from "@/pages/WishlistPage";
import { VariantDetailPage } from "@/pages/VariantDetailPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { FAQPage } from "@/pages/FAQPage";
import { ShippingPage } from "@/pages/ShippingPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/carpets" element={<ListingPage />} />
        <Route path="/carpets/:id" element={<VariantDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/complete" element={<CheckoutCompletePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
