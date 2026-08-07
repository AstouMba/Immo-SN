import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

const Layout = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Location", path: "/location" },
    { name: "Vente", path: "/vente" },
    { name: "À propos", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20 selection:text-primary">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,111,90,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.8),transparent_38%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8">
        <header 
          className={`sticky top-4 z-50 flex items-center justify-between gap-4 rounded-[1.75rem] border border-black/10 bg-[#f8f3ed]/85 px-5 py-4 backdrop-blur-md transition-all duration-300 ${
            scrolled ? "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] py-3" : "shadow-sm"
          }`}
        >
          <Link to="/" className="flex flex-col">
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-8 text-[0.78rem] font-medium uppercase tracking-[0.24em] text-[#4d4a45] lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                className={`transition hover:text-primary ${
                  location.pathname === link.path ? "text-primary font-semibold" : ""
                }`}
                to={link.path}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/location"
              className="hidden rounded-full border border-black/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#4d4a45] transition hover:border-black/20 hover:text-primary sm:inline-flex"
            >
              Explorer
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#4d4a45] transition hover:bg-black/5"
              aria-label="Rechercher"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#4d4a45] transition hover:bg-black/5 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-md lg:hidden">
            <div className="flex flex-col items-center justify-center h-full gap-8 text-[1.2rem] font-medium uppercase tracking-[0.24em] text-[#4d4a45]">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`transition hover:text-primary ${
                    location.pathname === link.path ? "text-primary font-bold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        <main className="min-h-[70vh] py-6 sm:py-8 lg:py-10">{children}</main>

        <footer className="mt-12 border-t border-black/10 bg-[#f3ede4] rounded-t-[2.25rem] overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
              <div className="space-y-6">
                <BrandLogo />
                <p className="max-w-xs text-[0.95rem] leading-7 text-muted">
                  DIASPORA IMO MATHIAM MBOW redéfinit l'expérience immobilière avec une identité calme et une approche éditoriale.
                </p>
              </div>
              
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Explorer</p>
                <nav className="flex flex-col gap-4 text-sm text-muted">
                  <Link to="/" className="hover:text-primary transition">Accueil</Link>
                  <Link to="/location" className="hover:text-primary transition">Location</Link>
                  <Link to="/vente" className="hover:text-primary transition">Vente</Link>
                  <Link to="/about" className="hover:text-primary transition">À propos</Link>
                </nav>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Agence</p>
                <div className="flex flex-col gap-4 text-sm text-muted">
                  <p>+221 77 091 91 91</p>
                  <p>contact@domaine-discover.com</p>
                  <p>Dakar, Sénégal</p>
                </div>
              </div>
            </div>
            
            <div className="mt-16 pt-8 border-t border-black/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              <p>© {new Date().getFullYear()} DIASPORA IMO MATHIAM MBOW. Tous droits réservés.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-primary transition">Instagram</a>
                <a href="#" className="hover:text-primary transition">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
