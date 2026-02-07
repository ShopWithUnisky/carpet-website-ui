import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight">
              Carpet Company
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Premium carpets for your space.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link
              to="/carpets"
              className="hover:text-foreground transition-colors"
            >
              Carpets
            </Link>
            <Link
              to="/cart"
              className="hover:text-foreground transition-colors"
            >
              Cart
            </Link>
            <Link
              to="/auth"
              className="hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
        <p className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Carpet Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
