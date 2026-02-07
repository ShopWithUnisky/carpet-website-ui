import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { haptic } from "@/lib/haptic";
import { cn } from "@/lib/utils";
import { HiHome, HiShoppingCart, HiViewGrid } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

const bottomNavItems = [
  { to: "/", label: "Home", icon: HiHome },
  { to: "/carpets", label: "Carpets", icon: HiViewGrid },
] as const;

export function Header() {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <>
      {/* Top header: logo only on mobile, full nav on desktop */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="text-xl">Carpet Company</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-4 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <HiHome className="size-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/carpets" className="flex items-center gap-2">
                  <HiViewGrid className="size-4" />
                  Carpets
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/cart">
                  <HiShoppingCart className="size-5" />
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-1 -top-1 size-5 rounded-full p-0 text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>
            </nav>
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth" onClick={() => haptic()}>
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Bottom nav: mobile only — frosted pill with hover/active states */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-2 pb-2 md:hidden"
        style={{
          paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        }}
      >
        <nav
          className={cn(
            "flex w-full max-w-[340px] items-center justify-around gap-1 rounded-full border border-border/80 bg-background/80 px-2.5 py-2.5 shadow-lg backdrop-blur-md",
            "supports-[backdrop-filter]:bg-background/70",
          )}
        >
          {bottomNavItems.map(({ to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => haptic()}
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                  "hover:bg-primary/15 active:bg-primary/20",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/95"
                    : "text-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" />
              </Link>
            );
          })}
          <Link
            to="/cart"
            onClick={() => haptic()}
            className={cn(
              "relative flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
              "hover:bg-primary/15 active:bg-primary/20",
              location.pathname === "/cart"
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/95"
                : "text-foreground",
            )}
          >
            <HiShoppingCart className="size-5 shrink-0" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-0.5 -top-0.5 size-4 min-w-4 rounded-full p-0 text-[10px]"
              >
                {totalItems}
              </Badge>
            )}
          </Link>
        </nav>
      </div>
    </>
  );
}
