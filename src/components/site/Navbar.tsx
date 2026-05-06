import { Link, NavLink } from "react-router-dom";
import { Phone, Menu, X, Flower2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services & Prices" },
  { to: "/offers", label: "Offers" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="gradient-purple text-primary-foreground sticky top-0 z-50 shadow-soft">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <Flower2 className="h-8 w-8 text-accent" />
          <div className="leading-tight">
            <div className="font-serif text-2xl font-bold tracking-wide">AMAKA</div>
            <div className="text-[10px] tracking-[0.3em] uppercase opacity-80">Massage</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.2em] transition-colors hover:text-accent ${
                  isActive ? "text-accent" : "text-primary-foreground/90"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <a href="tel:015906306248" className="hidden md:block">
          <Button variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Phone className="mr-2 h-4 w-4" /> 0159 06306248
          </Button>
        </a>
        <button className="lg:hidden text-primary-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-primary-foreground/10 px-4 pb-4">
          <nav className="flex flex-col gap-3 pt-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.2em]">
                {l.label}
              </NavLink>
            ))}
            <a href="tel:015906306248" className="text-sm uppercase tracking-[0.2em] text-accent">
              <Phone className="inline h-4 w-4 mr-2" />0159 06306248
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
