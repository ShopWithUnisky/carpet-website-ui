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

export function SettingsTab() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Preferences and notifications
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
            Order updates and marketing (can be wired to a backend later).
          </p>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="notify-orders"
              className="size-4 rounded border-input"
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
          <p className="text-sm text-muted-foreground pt-1">
            USD · English
          </p>
        </section>
        <div className="pt-4">
          <Button variant="outline" size="sm">
            Save preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
