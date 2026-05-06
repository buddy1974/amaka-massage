import { Flower2, MapPin, Phone, Clock } from "lucide-react";

export const Footer = () => (
  <footer className="gradient-purple text-primary-foreground mt-20">
    <div className="container py-14 grid md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Flower2 className="h-7 w-7 text-accent" />
          <div>
            <div className="font-serif text-xl font-bold">AMAKA</div>
            <div className="text-[10px] tracking-[0.3em] uppercase opacity-80">Massage – Essen</div>
          </div>
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
      <div className="container py-6 text-xs text-center opacity-70">
        All treatments are wellness massages. No medical diagnosis or therapy. © {new Date().getFullYear()} Amaka Massage – Essen
      </div>
    </div>
  </footer>
);
