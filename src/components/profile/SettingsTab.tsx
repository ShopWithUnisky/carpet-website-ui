import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { getSettings, saveSettings, type SavedSettings } from "@/lib/settings";
import { useToast } from "@/context/ToastContext";
import { haptic } from "@/lib/haptic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const REGION_OPTIONS = ["USD · English", "EUR · English", "GBP · English"];

export function SettingsTab() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SavedSettings>({
    notifyOrders: true,
    notifyMarketing: false,
    region: "USD · English",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setLoaded(true);
  }, []);

  const handleSave = () => {
    haptic();
    saveSettings(settings);
    toast("Preferences saved");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Preferences and notifications (saved locally)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h4 className="text-sm font-medium">Appearance</h4>
          <p className="text-sm text-muted-foreground">
            Choose light or dark theme.
          </p>
          <div className="flex gap-2 pt-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
          </div>
        </section>
        <section className="space-y-2">
          <h4 className="text-sm font-medium">Notifications</h4>
          <p className="text-sm text-muted-foreground">
            Order updates and marketing. Save to persist.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="notify-orders"
              className="size-4 rounded border-input"
              checked={settings.notifyOrders}
              onChange={(e) =>
                setSettings((s) => ({ ...s, notifyOrders: e.target.checked }))
              }
            />
            <Label htmlFor="notify-orders" className="font-normal cursor-pointer">
              Email me order updates
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notify-marketing"
              className="size-4 rounded border-input"
              checked={settings.notifyMarketing}
              onChange={(e) =>
                setSettings((s) => ({ ...s, notifyMarketing: e.target.checked }))
              }
            />
            <Label htmlFor="notify-marketing" className="font-normal cursor-pointer">
              News and offers
            </Label>
          </div>
        </section>
        <section className="space-y-2">
          <h4 className="text-sm font-medium">Region</h4>
          <p className="text-sm text-muted-foreground">
            Currency and language (placeholder).
          </p>
          {loaded && (
            <Select
              value={settings.region}
              onValueChange={(value) =>
                setSettings((s) => ({ ...s, region: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGION_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </section>
        <div className="pt-4">
          <Button variant="outline" size="sm" onClick={handleSave}>
            Save preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
