import { MapPin, Phone, Clock, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="gradient-purple text-primary-foreground mt-20">
    <div className="container py-14 grid md:grid-cols-4 gap-10">
      <div>
        <Link to="/">
          <img src="/logo.png" alt="Amaka's City" className="h-16 w-auto object-contain brightness-0 invert mb-3" />
        </Link>
        <p className="text-sm opacity-80 leading-relaxed font-semibold">Amaka's City Afro Touch</p>
        <p className="text-xs opacity-60 leading-relaxed mt-1">Traditionelle Massage – Essen</p>
        <div className="flex items-center gap-1.5 mt-3 text-xs opacity-70">
          <CreditCard className="h-3.5 w-3.5 shrink-0" />
          <span>Kartenzahlung akzeptiert</span>
        </div>
      </div>
      <div>
        <h4 className="font-serif text-lg mb-3 text-accent">Adresse</h4>
        <p className="text-sm opacity-90 flex gap-2">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Bochumer Landstr. 154<br />45276 Essen<br /><span className="text-xs opacity-70">2 Gehmin. vom Essen Steele Ostbahnhof</span></span>
        </p>
      </div>
      <div>
        <h4 className="font-serif text-lg mb-3 text-accent">Kontakt</h4>
        <a href="tel:015906306248" className="text-sm opacity-90 flex gap-2 hover:text-accent mb-1">
          <Phone className="h-4 w-4 mt-0.5 shrink-0" />0159 06306248
        </a>
        <a href="tel:020174921756" className="text-sm opacity-90 flex gap-2 hover:text-accent mb-1">
          <Phone className="h-4 w-4 mt-0.5 shrink-0" />0201 74921756
        </a>
        <a href="https://wa.me/4915213928938" target="_blank" rel="noreferrer"
          className="text-xs opacity-60 hover:opacity-90 flex gap-2 mt-1">
          <span>WhatsApp: 01521 3928938</span>
        </a>
      </div>
      <div>
        <h4 className="font-serif text-lg mb-3 text-accent">Öffnungszeiten</h4>
        <p className="text-sm opacity-90 flex gap-2">
          <Clock className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            Mo. – Di., Do. – Fr.: 10:00 – 19:00<br />
            Mi.: 10:00 – 17:00<br />
            Sa.: 13:00 – 20:00<br />
            So.: Geschlossen
          </span>
        </p>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10 container py-4">
      <p className="text-xs text-center opacity-50">Hinweis: Unsere Massagen verstehen sich als Wellnessbehandlung. Keine Diagnosen oder Heilbehandlungen.</p>
      <p className="text-xs text-center font-bold tracking-widest uppercase mt-1 opacity-80">⛔ Keine Erotikmassage</p>
    </div>
    <div className="border-t border-primary-foreground/10">
      <div className="container py-5 text-xs text-center opacity-60 space-y-1">
        <p>© {new Date().getFullYear()} Amaka's City Afro Touch – Essen. Alle Rechte vorbehalten.</p>
        <p>Developed by <a href="https://maxpromo.digital" target="_blank" rel="noreferrer"
          className="hover:opacity-100 underline underline-offset-2">maxpromo.digital</a></p>
      </div>
    </div>
  </footer>
);
