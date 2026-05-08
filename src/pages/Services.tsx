import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { services } from "@/data/services";
import { Calendar, Flower2, Gift, CreditCard } from "lucide-react";

const kombis = [
  {
    label: "Kombi 1",
    price: "109 €",
    duration: "2 Std.",
    items: ["Traditionelle Massage · 60 Min.", "Kopf-Schulter-Nacken-Massage · 30 Min.", "Fußmassage · 30 Min."],
    slug: "kombi-massage-1",
  },
  {
    label: "Kombi 2",
    price: "109 €",
    duration: "2 Std.",
    items: ["Wellness-Aroma Öl Massage · 60 Min.", "Kopf-Gesicht-Massage · 30 Min.", "Fußmassage · 30 Min."],
    slug: "kombi-massage-2",
  },
  {
    label: "Kombi 3",
    price: "119 €",
    duration: "2 Std.",
    items: ["Hot-Stone Massage · 90 Min.", "Kopf-Nacken und Fußmassage · 30 Min."],
    slug: "kombi-massage-3",
  },
];

const individualServices = services.filter(s => !s.slug.startsWith("kombi-") && s.slug !== "physical-chat-room");
const chatRoom = services.find(s => s.slug === "physical-chat-room");

const Services = () => (
  <Layout>
    <section className="gradient-hero py-16">
      <div className="container text-center">
        <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="font-serif text-5xl text-primary-deep">Leistungen & Preise</h1>
        <p className="font-script text-2xl text-primary mt-2">Transparent. Ehrlich. Verwurzelt in der Tradition.</p>
      </div>
    </section>

    {/* Payment notice */}
    <div className="bg-primary/5 border-b border-primary/10">
      <div className="container py-3 flex flex-wrap items-center justify-center gap-4 text-sm text-primary-deep">
        <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-primary" /> Kartenzahlung akzeptiert</span>
        <span className="flex items-center gap-1.5"><Gift className="h-4 w-4 text-primary" /> Geschenkgutscheine erhältlich</span>
      </div>
    </div>

    {/* Individual services */}
    <section className="container py-16">
      <h2 className="font-serif text-3xl text-primary-deep mb-8">Einzelmassagen</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {individualServices.map((s) => (
          <article key={s.slug} className="bg-card rounded-2xl overflow-hidden shadow-card flex flex-col md:flex-row">
            <img src={s.image} alt={s.name} loading="lazy" className="md:w-2/5 h-48 md:h-auto object-cover" />
            <div className="p-6 flex-1">
              <h2 className="font-serif text-xl text-primary-deep">{s.name}</h2>
              <p className="text-sm text-muted-foreground mt-2">{s.description}</p>
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {s.prices.map((p) => (
                  <li key={`${p.durationMin}-${p.priceEur}`} className="flex justify-between">
                    <span className="text-foreground/70">{p.duration}</span>
                    <span className="font-semibold text-primary">{p.price}</span>
                  </li>
                ))}
              </ul>
              <Link to={`/booking?service=${s.slug}`} className="inline-block mt-4">
                <Button size="sm" className="gradient-purple text-primary-foreground hover:opacity-90">
                  <Calendar className="mr-2 h-3 w-3" /> Buchen
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* Intensiv Massage highlight */}
    <section className="bg-primary/5 py-8">
      <div className="container">
        <div className="bg-card rounded-2xl p-6 border border-primary/20 max-w-2xl mx-auto text-center">
          <p className="text-xs text-primary font-medium uppercase tracking-widest mb-2">Intensivbehandlung</p>
          <h3 className="font-serif text-2xl text-primary-deep">Intensiv Massage mit Bio Sheabutteröl, Bio Kokosöl & Aboniki</h3>
          <p className="text-muted-foreground text-sm mt-2">Bei Migräne, Stress und körperlicher Belastung</p>
          <div className="flex justify-center gap-6 mt-4">
            {[["60 Min.","75 €"],["90 Min.","110 €"],["120 Min.","145 €"]].map(([d,p]) => (
              <div key={d} className="text-center">
                <p className="text-sm text-muted-foreground">{d}</p>
                <p className="font-bold text-primary text-xl">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Kombi Pakete */}
    <section className="container py-16">
      <h2 className="font-serif text-3xl text-primary-deep mb-2">Kombi-Massage / Wellness Paket</h2>
      <p className="text-muted-foreground mb-8">Jeweils 2 Stunden · Die perfekte Kombination</p>
      <div className="grid md:grid-cols-3 gap-6">
        {kombis.map((k) => (
          <div key={k.label} className="bg-card rounded-2xl shadow-card p-7 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-2xl text-primary-deep">{k.label}</h3>
              <div className="text-right">
                <p className="font-bold text-primary text-2xl">{k.price}</p>
                <p className="text-xs text-muted-foreground">{k.duration}</p>
              </div>
            </div>
            <ul className="space-y-2 flex-1">
              {k.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-foreground/80">
                  <span className="text-primary mt-0.5">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to={`/booking?service=${k.slug}`} className="mt-6">
              <Button className="w-full gradient-purple text-primary-foreground hover:opacity-90">
                <Calendar className="mr-2 h-4 w-4" /> Buchen
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>

    {/* Physical Chat-Room */}
    {chatRoom && (
      <section className="bg-secondary/40 py-16">
        <div className="container max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
            <img src={chatRoom.image} alt="Physical Chat-Room" loading="lazy" className="h-56 w-full object-cover" />
            <div className="p-8">
              <span className="text-xs text-primary font-medium uppercase tracking-widest">Besonderes Angebot</span>
              <h2 className="font-serif text-3xl text-primary-deep mt-2">Physical Chat-Room</h2>
              <p className="text-foreground/80 mt-4 leading-relaxed">
                Brauchen Sie jemanden zum Reden? Wir sind für Sie da.<br />
                Es ist ein Ort zum Entspannen, Abschalten – ein sicherer, angenehmer Ort, an dem Sie Leute treffen können.
                Wir haben stets ein offenes Ohr für Sie.
              </p>
              <ul className="mt-6 space-y-2 border-t border-border pt-6">
                {chatRoom.prices.map((p) => (
                  <li key={`${p.durationMin}`} className="flex justify-between">
                    <span className="text-foreground/70">{p.duration}</span>
                    <span className="font-semibold text-primary">{p.price}</span>
                  </li>
                ))}
              </ul>
              <Link to={`/booking?service=${chatRoom.slug}`} className="inline-block mt-6">
                <Button className="gradient-purple text-primary-foreground hover:opacity-90">
                  <Calendar className="mr-2 h-4 w-4" /> Termin buchen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    )}

    {/* Disclaimer */}
    <section className="container py-8 max-w-2xl mx-auto text-center">
      <p className="text-sm text-muted-foreground leading-relaxed">
        <strong>Hinweis:</strong> Unsere Massagen verstehen sich als Wellnessbehandlung.
        Es werden keine Diagnosen oder Heilbehandlungen durchgeführt. <strong>Keine Erotikmassage.</strong>
      </p>
    </section>

    <div className="container pb-16 text-center">
      <Link to="/booking">
        <Button size="lg" className="gradient-purple text-primary-foreground hover:opacity-90 px-10">
          <Calendar className="mr-2 h-5 w-5" /> Jetzt Termin buchen
        </Button>
      </Link>
    </div>
  </Layout>
);

export default Services;
