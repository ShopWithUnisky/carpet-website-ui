import { HistoryTab } from "@/components/profile/HistoryTab";
import { PaymentMethodsTab } from "@/components/profile/PaymentMethodsTab";
import { ProfileDetailsTab } from "@/components/profile/ProfileDetailsTab";
import { SettingsTab } from "@/components/profile/SettingsTab";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Heart, ShoppingCart } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

export function ProfilePage() {
  useDocumentTitle("Profile | Carpet Company");
  const { user, loading } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="h-8 w-48" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, payments, and preferences
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/wishlist">
            <Heart className="mr-2 size-4" />
            Wishlist ({wishlistCount})
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/cart">
            <ShoppingCart className="mr-2 size-4" />
            Cart ({cartCount})
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 flex h-auto w-full flex-wrap gap-1 bg-muted p-1">
          <TabsTrigger value="profile" className="flex-1 shrink-0">
            Profile
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex-1 shrink-0">
            Payment methods
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 shrink-0">
            History
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 shrink-0">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileDetailsTab user={user} />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentMethodsTab />
        </TabsContent>
        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
