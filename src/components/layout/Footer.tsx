import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold tracking-tight">
              Carpet Company
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Premium carpets for your space.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Shop</p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/carpets" className="hover:text-foreground transition-colors">
                Carpets
              </Link>
              <Link to="/cart" className="hover:text-foreground transition-colors">
                Cart
              </Link>
              <Link to="/wishlist" className="hover:text-foreground transition-colors">
                Wishlist
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-sm font-medium">Help</p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/faq" className="hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link to="/shipping" className="hover:text-foreground transition-colors">
                Shipping & returns
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-sm font-medium">Company</p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/auth" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
        <p className="mt-10 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Carpet Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
