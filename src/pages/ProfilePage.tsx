import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDetailsTab } from "@/components/profile/ProfileDetailsTab";
import { PaymentMethodsTab } from "@/components/profile/PaymentMethodsTab";
import { HistoryTab } from "@/components/profile/HistoryTab";
import { SettingsTab } from "@/components/profile/SettingsTab";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePage() {
  useDocumentTitle("Profile | Carpet Company");
  const { user, loading } = useAuth();

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
