import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Phone, MapPin, Clock, CheckCircle2, Star, CreditCard, Gift } from "lucide-react";
import hero from "@/assets/hero-massage.webp";
import about from "@/assets/8.webp";
import room1 from "@/assets/3.webp";
import room2 from "@/assets/4.webp";
import room3 from "@/assets/5.webp";
import { featuredServices } from "@/data/services";

const PHONE    = "015906306248";
const PHONE_D  = "0159 06306248";
const PHONE2   = "020174921756";
const PHONE2_D = "0201 74921756";
const WA       = "https://wa.me/4915213928938";

const Index = () => (
  <Layout>

    {/* ── 1. HERO ── */}
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <img src={hero} alt="Professionelle Afro-Massage in Essen"
        className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
      <div className="relative container py-24">
        <div className="max-w-2xl">
          <p className="text-accent font-medium tracking-[0.25em] uppercase text-sm mb-4">
            Essen · Premium Wellness
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight">
            AMAKA'S CITY
          </h1>
          <p className="text-accent/90 text-xl md:text-2xl mt-2 font-light">
            Traditionelle Massage und Wellness Spa Salon
          </p>
          <p className="text-white/75 text-lg mt-5 leading-relaxed max-w-lg">
            Entspannen Sie Körper und Geist. Erleben Sie authentische afrikanische Massagetechniken in ruhiger, privater Atmosphäre.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/booking">
              <Button size="lg" className="gradient-purple text-white hover:opacity-90 px-8 h-14 text-lg shadow-lg">
                <Calendar className="mr-2 h-5 w-5" /> Termin buchen
              </Button>
            </Link>
            <a href={`tel:${PHONE}`}>
              <Button size="lg" variant="outline"
                className="border-white/60 text-white bg-white/10 hover:bg-white hover:text-primary-deep px-8 h-14 text-lg backdrop-blur-sm">
                <Phone className="mr-2 h-5 w-5" /> Jetzt anrufen
              </Button>
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <p className="text-white/50 text-sm flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>4,9 / 5 · 23 Bewertungen · Essen</span>
            </p>
            <p className="text-white/50 text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-accent" />
              <span>Kartenzahlung akzeptiert</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ── 2. TRUST BAR ── */}
    <section className="bg-[#0d0020] text-primary-foreground py-5">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-8 md:gap-14 text-sm font-medium">
          {[
            "Traditionelle Afro-Massage",
            "Ruhige & private Atmosphäre",
            "Einfache Online-Buchung",
            "Kartenzahlung möglich",
          ].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── 3. SERVICES GRID ── */}
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-2">Unsere Behandlungen</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary-deep">Massageleistungen</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {featuredServices.map((s) => (
            <Link key={s.slug} to={`/booking?service=${s.slug}`}
              className="group flex bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-36 md:w-44 shrink-0 overflow-hidden">
                <img src={s.image} alt={s.name} loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <h3 className="font-serif text-lg text-primary-deep leading-snug">{s.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-primary font-bold text-lg">ab {s.prices[0].price}</span>
                  <span className="gradient-purple text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                    Buchen
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
              Alle Leistungen & Preise ansehen
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* ── 4. GOOGLE REVIEWS ── */}
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            { icon: "⭐", label: "4,9 / 5 Bewertung" },
            { icon: "✔", label: "Vertraut in Essen" },
            { icon: "✔", label: "Echte Kundenmeinungen" },
          ].map((b) => (
            <div key={b.label}
              className="flex items-center gap-2 bg-card rounded-full px-5 py-2 shadow-card text-sm font-medium text-primary-deep">
              <span>{b.icon}</span><span>{b.label}</span>
            </div>
          ))}
        </div>
        <div className="text-center mb-10">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-2">Google Bewertungen</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary-deep">Was unsere Kunden sagen</h2>
          <p className="text-muted-foreground mt-3">Echte Erfahrungen unserer Kunden in Essen</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { text: "Sehr entspannende Massage, professionelles und sauberes Ambiente. Ich komme definitiv wieder.", name: "Thomas K." },
            { text: "Die beste Massage in Essen. Freundliche und ruhige Atmosphäre – genau das, was ich nach einer stressigen Woche brauchte.", name: "Lisa M." },
            { text: "Starke Hände, tiefe Entspannung. Professioneller Service in einem sehr privaten und sauberen Studio.", name: "Daniel S." },
          ].map((r) => (
            <div key={r.name} className="bg-card rounded-2xl shadow-card p-7 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed flex-1">„{r.text}"</p>
              <p className="font-semibold text-primary-deep text-sm">— {r.name}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="https://share.google/o3OJXaFsTcN1sx6kO" target="_blank" rel="noreferrer">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white gap-2 px-8">
              Alle Bewertungen auf Google ansehen
            </Button>
          </a>
        </div>
      </div>
    </section>

    {/* ── 5. ABOUT ── */}
    <section className="bg-secondary/40 py-24">
      <div className="container grid md:grid-cols-2 gap-14 items-center">
        <img src={about} alt="Wellness Spa Salon – Amaka's City Essen" loading="lazy"
          className="rounded-2xl shadow-soft h-[480px] w-full object-cover" />
        <div>
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-3">Über uns</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary-deep leading-tight">
            Ihr Ort<br />zum Entspannen
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed mt-6">
            Wir bieten authentische Afro-Massage in einer ruhigen, privaten Umgebung an. Unser Ziel ist einfach – Ihnen helfen, Stress abzubauen und sich besser zu fühlen.
          </p>
          <p className="text-foreground/70 text-lg leading-relaxed mt-4">
            Jede Behandlung basiert auf den reichen Traditionen der afrikanischen Körperarbeit, durchgeführt mit Sorgfalt und langjähriger Erfahrung.
          </p>
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm text-primary-deep">
            <Gift className="h-5 w-5 text-primary inline mr-2" />
            <strong>Geschenkgutscheine sind erhältlich</strong> – das perfekte Geschenk für Ihre Liebsten.
          </div>
          <Link to="/booking" className="inline-block mt-8">
            <Button size="lg" className="gradient-purple text-white hover:opacity-90 px-8 h-14">
              <Calendar className="mr-2 h-5 w-5" /> Termin buchen
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* ── 6. PRICING PREVIEW ── */}
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-2">Transparente Preise</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary-deep">Unsere Preise</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl shadow-card p-8">
            <h3 className="font-serif text-2xl text-primary-deep">Traditionelle Massage</h3>
            <p className="text-muted-foreground text-sm mt-1">AFRO ORIGIN · Alle Einzelmassagen</p>
            <ul className="mt-6 space-y-3">
              {([["30 Min.","35 €"],["60 Min.","55 €"],["90 Min.","80 €"]] as const).map(([d,p]) => (
                <li key={d} className={`flex justify-between items-center py-3 px-4 rounded-xl ${
                  d === "60 Min." ? "bg-primary/10 border border-primary/30" : "bg-secondary"
                }`}>
                  <span className="font-medium">{d}</span>
                  <div className="flex items-center gap-2">
                    {d === "60 Min." && <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">Beliebt</span>}
                    <span className="font-bold text-primary text-lg">{p}</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-3">Bis 180 Min. verfügbar</p>
          </div>
          <div className="bg-primary-deep rounded-2xl shadow-soft p-8 text-primary-foreground">
            <h3 className="font-serif text-2xl text-accent">Aromaölmassage</h3>
            <p className="text-primary-foreground/60 text-sm mt-1">Warme Öle · Tiefe Entspannung</p>
            <ul className="mt-6 space-y-3">
              {([["30 Min.","35 €"],["60 Min.","60 €"],["90 Min.","85 €"]] as const).map(([d,p]) => (
                <li key={d} className={`flex justify-between items-center py-3 px-4 rounded-xl ${
                  d === "60 Min." ? "bg-accent/20 border border-accent/40" : "bg-white/10"
                }`}>
                  <span className="font-medium">{d}</span>
                  <div className="flex items-center gap-2">
                    {d === "60 Min." && <span className="text-xs text-accent font-medium bg-accent/20 px-2 py-0.5 rounded-full">Beliebt</span>}
                    <span className="font-bold text-accent text-lg">{p}</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-primary-foreground/40 mt-3">Bis 180 Min. verfügbar</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/services">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
              Vollständige Preisliste ansehen
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* ── 7. OUR SPACE ── */}
    <section className="bg-secondary/40 py-24">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-2">Unser Studio</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary-deep">Entspannen Sie in ruhiger Atmosphäre</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <img src={room1} alt="Studio" loading="lazy" className="rounded-2xl shadow-card h-64 w-full object-cover hover:scale-[1.02] transition-transform duration-500" />
          <img src={room2} alt="Massageraum" loading="lazy" className="rounded-2xl shadow-card h-64 w-full object-cover hover:scale-[1.02] transition-transform duration-500 md:mt-8" />
          <img src={room3} alt="Entspannungsbereich" loading="lazy" className="rounded-2xl shadow-card h-64 w-full object-cover hover:scale-[1.02] transition-transform duration-500" />
        </div>
      </div>
    </section>

    {/* ── 8. STRONG CTA ── */}
    <section className="gradient-purple text-primary-foreground py-28">
      <div className="container text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-6xl font-bold leading-tight">Bereit zum Entspannen?</h2>
        <p className="text-primary-foreground/75 text-xl mt-5">Jetzt Termin buchen oder direkt anrufen.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link to="/booking">
            <Button size="lg" className="bg-white text-primary-deep hover:bg-accent font-bold px-10 h-14 text-lg">
              <Calendar className="mr-2 h-5 w-5" /> Jetzt buchen
            </Button>
          </Link>
          <a href={`tel:${PHONE}`}>
            <Button size="lg" variant="outline"
              className="border-white text-white bg-transparent hover:bg-white hover:text-primary-deep px-10 h-14 text-lg">
              <Phone className="mr-2 h-5 w-5" /> Anrufen
            </Button>
          </a>
        </div>
        <p className="text-primary-foreground/50 text-sm mt-6">
          Oder per WhatsApp:{" "}
          <a href={WA} target="_blank" rel="noreferrer" className="underline hover:text-accent">01521 3928938</a>
        </p>
      </div>
    </section>

    {/* ── 9. CONTACT + MAP ── */}
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-2">Besuchen Sie uns</p>
          <h2 className="font-serif text-4xl text-primary-deep">So finden Sie uns</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-xl p-3 shrink-0"><MapPin className="h-6 w-6 text-primary" /></div>
              <div>
                <p className="font-semibold text-primary-deep">Adresse</p>
                <p className="text-muted-foreground mt-0.5">Bochumer Landstr. 154<br />45276 Essen</p>
                <p className="text-sm text-muted-foreground mt-1">Parkmöglichkeiten am Essen Steele Ostbahnhof, 2 Gehminuten entfernt.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-xl p-3 shrink-0"><Phone className="h-6 w-6 text-primary" /></div>
              <div>
                <p className="font-semibold text-primary-deep">Telefon</p>
                <a href={`tel:${PHONE}`} className="text-primary font-bold block hover:underline mt-0.5">{PHONE_D}</a>
                <a href={`tel:${PHONE2}`} className="text-muted-foreground block hover:underline">{PHONE2_D}</a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-xl p-3 shrink-0"><Clock className="h-6 w-6 text-primary" /></div>
              <div>
                <p className="font-semibold text-primary-deep">Öffnungszeiten</p>
                <p className="text-muted-foreground mt-0.5">Mo.–Di., Do.–Fr.: 10:00 – 19:00 Uhr</p>
                <p className="text-muted-foreground">Mi.: 10:00 – 17:00 Uhr</p>
                <p className="text-muted-foreground">Sa.: 13:00 – 20:00 Uhr</p>
                <p className="text-muted-foreground">So.: Geschlossen</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card h-72">
            <iframe title="Amaka's City – Standort"
              src="https://www.google.com/maps?q=Bochumer+Landstra%C3%9Fe+154,+45276+Essen&output=embed"
              className="w-full h-full border-0" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

  </Layout>
);

export default Index;
