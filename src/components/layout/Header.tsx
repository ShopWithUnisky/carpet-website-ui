import { useRef, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/context/ThemeContext";
import { haptic } from "@/lib/haptic";
import { cn } from "@/lib/utils";
import { HiHome, HiShoppingCart, HiViewGrid, HiHeart, HiSun, HiMoon } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import type { User } from "firebase/auth";

function getInitials(user: User): string {
  if (user.displayName?.trim()) {
    const parts = user.displayName.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (user.email) return user.email[0].toUpperCase();
  return "?";
}

const bottomNavItems = [
  { to: "/", label: "Home", icon: HiHome },
  { to: "/carpets", label: "Carpets", icon: HiViewGrid },
] as const;

export function Header() {
  const { user, loading, signOut } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!avatarOpen) return;
    const close = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [avatarOpen]);

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
                <Link to="/wishlist" onClick={() => haptic()}>
                  <HiHeart className="size-5" />
                  {wishlistItems.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -right-1 -top-1 size-5 rounded-full p-0 text-xs"
                    >
                      {wishlistItems.length}
                    </Badge>
                  )}
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                haptic();
                toggleTheme();
              }}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <HiSun className="size-5" />
              ) : (
                <HiMoon className="size-5" />
              )}
            </Button>
            {!loading &&
              (user ? (
                <div className="relative" ref={avatarRef}>
                  <button
                    type="button"
                    onClick={() => {
                      haptic();
                      setAvatarOpen((o) => !o);
                    }}
                    className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted ring-offset-background transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-expanded={avatarOpen}
                    aria-haspopup="true"
                    aria-label="Account menu"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="size-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        {getInitials(user)}
                      </span>
                    )}
                  </button>
                  {avatarOpen && (
                    <div
                      className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border bg-popover py-1 text-popover-foreground shadow-md"
                      role="menu"
                    >
                      {user.email && (
                        <div className="truncate px-3 py-2 text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      )}
                      <Link
                        to="/profile"
                        role="menuitem"
                        className="block w-full px-3 py-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          haptic();
                          setAvatarOpen(false);
                        }}
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        className="w-full px-3 py-2 text-left text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          haptic();
                          setAvatarOpen(false);
                          signOut();
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth" onClick={() => haptic()}>
                    Sign In
                  </Link>
                </Button>
              ))}
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
