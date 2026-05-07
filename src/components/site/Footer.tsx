import { MapPin, Phone, Clock } from "lucide-react";

export const Footer = () => (
  <footer className="gradient-purple text-primary-foreground mt-20">
    <div className="container py-14 grid md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/logo.png"
            alt="Amaka Massage"
            className="h-16 w-auto object-contain brightness-0 invert"
          />
        </div>
        <p className="text-sm opacity-80 leading-relaxed">
          Relax. Recharge. Feel Better.
        </p>
      </div>
      <div>
        <h4 className="font-serif text-lg mb-3 text-accent">Address</h4>
        <p className="text-sm opacity-90 flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          Bochumer Landstraße 154<br />45276 Essen
        </p>
      </div>
      <div>
        <h4 className="font-serif text-lg mb-3 text-accent">Contact</h4>
        <a href="tel:015906306248" className="text-sm opacity-90 flex gap-2 hover:text-accent">
          <Phone className="h-4 w-4 mt-0.5" />0159 06306248
        </a>
      </div>
      <div>
        <h4 className="font-serif text-lg mb-3 text-accent">Opening Hours</h4>
        <p className="text-sm opacity-90 flex gap-2"><Clock className="h-4 w-4 mt-0.5 shrink-0" />
          Mon – Fri: 10:00 – 19:00<br />Saturday: 13:00 – 20:00
        </p>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10">
      <div className="container py-6 text-xs text-center opacity-70 space-y-1">
        <p>All treatments are wellness massages. No medical diagnosis or therapy.</p>
        <p>
          © {new Date().getFullYear()} Amaka Massage – Essen &nbsp;·&nbsp;{" "}
          Website by{" "}
          <a
            href="https://maxpromo.digital"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:opacity-100"
          >
            maxpromo.digital
          </a>
        </p>
      </div>
    </div>
  </footer>
);
