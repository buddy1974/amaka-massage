import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { singleServices, kombiServices } from "@/data/services";
import { Calendar, Flower2, Gift, CreditCard, ShieldAlert, Star, Flame } from "lucide-react";

const Services = () => (
  <Layout>
    <section className="gradient-hero py-16">
      <div className="container text-center">
        <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="font-serif text-5xl text-primary-deep">Leistungen & Preise</h1>
        <p className="font-script text-2xl text-primary mt-2">Transparent. Ehrlich. Verwurzelt in der Tradition.</p>
      </div>
    </section>

    {/* Notices bar */}
    <div className="bg-primary/5 border-b border-primary/10">
      <div className="container py-3 flex flex-wrap items-center justify-center gap-6 text-sm">
        <span className="flex items-center gap-1.5 text-primary-deep font-medium">
          <CreditCard className="h-4 w-4 text-primary" /> Kartenzahlung akzeptiert
        </span>
        <span className="flex items-center gap-1.5 text-primary-deep font-medium">
          <Gift className="h-4 w-4 text-primary" /> Geschenkgutscheine erhältlich
        </span>
        <span className="flex items-center gap-1.5 text-destructive font-semibold">
          <ShieldAlert className="h-4 w-4" /> Keine Erotikmassage
        </span>
      </div>
    </div>

    {/* Individual services */}
    <section className="container py-16">
      <h2 className="font-serif text-3xl text-primary-deep mb-2">Einzelmassagen</h2>
      <p className="text-muted-foreground mb-8 text-sm">Alle Preise inkl. Öle & Materialien. Barzahlung & Kartenzahlung.</p>
      <div className="grid md:grid-cols-2 gap-6">
        {singleServices.map((s) => (
          <article key={s.slug} className="bg-card rounded-2xl overflow-hidden shadow-card flex flex-col md:flex-row">
            <img src={s.image} alt={s.name} loading="lazy" className="md:w-2/5 h-48 md:h-auto object-cover" />
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h2 className="font-serif text-xl text-primary-deep leading-tight">{s.name}</h2>
                {s.badge && (
                  <span className="shrink-0 text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {s.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 mb-3">{s.description}</p>
              <ul className="mt-auto space-y-1.5 border-t border-border pt-3">
                {s.prices.map((p) => (
                  <li key={`${p.durationMin}-${p.priceEur}`} className="flex justify-between items-center text-sm">
                    <span className="text-foreground/70">
                      {p.duration}
                      {p.note && <span className="ml-1.5 text-xs text-muted-foreground">({p.note})</span>}
                    </span>
                    <span className="font-semibold text-primary">{p.price}</span>
                  </li>
                ))}
              </ul>
              {!s.badge?.includes('Freigabe') && (
                <Link to={`/booking?service=${s.slug}`} className="inline-block mt-4">
                  <Button size="sm" className="gradient-purple text-primary-foreground hover:opacity-90">
                    <Calendar className="mr-2 h-3 w-3" /> Buchen
                  </Button>
                </Link>
              )}
              {s.badge?.includes('Freigabe') && (
                <p className="mt-4 text-xs text-muted-foreground italic">Nur mit ärztlicher Freigabe buchbar – bitte anrufen.</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* Combo packages */}
    <section className="bg-primary/5 py-16">
      <div className="container">
        <div className="flex items-center gap-3 mb-2">
          <Flame className="h-6 w-6 text-primary" />
          <h2 className="font-serif text-3xl text-primary-deep">Kombi-Pakete – Spare bis zu 50 €</h2>
        </div>
        <p className="text-muted-foreground mb-8 text-sm">
          Kombinieren Sie mehrere Behandlungen zum Vorzugspreis. Individuelle Pakete auf Anfrage.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {kombiServices.map((k) => (
            <div key={k.slug} className="bg-card rounded-2xl p-6 shadow-card flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-serif text-lg text-primary-deep leading-tight">{k.name}</h3>
                {k.badge && (
                  <span className="shrink-0 text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {k.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex-1 mb-4">{k.description}</p>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <span className="text-2xl font-bold text-primary">{k.prices[0].price}</span>
                  <span className="text-xs text-muted-foreground ml-1.5">{k.prices[0].duration}</span>
                </div>
                <Link to={`/booking?service=${k.slug}`}>
                  <Button size="sm" className="gradient-purple text-primary-foreground hover:opacity-90">
                    <Calendar className="mr-1.5 h-3 w-3" /> Buchen
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          <Star className="h-3.5 w-3.5 inline mr-1 text-primary" />
          Individuelle Pakete auf Anfrage. Rufen Sie uns an: <strong>0159 06306248</strong>
        </p>
      </div>
    </section>

    {/* Why fair prices */}
    <section className="container py-16 max-w-3xl">
      <h2 className="font-serif text-3xl text-primary-deep mb-6">Warum diese Preise fair sind</h2>
      <div className="space-y-4 text-foreground/80">
        <p><strong className="text-primary-deep">1. Hochwertige Produkte:</strong> Bio Sheabutteröl, Bio Kokosöl und Aboniki Menthol für intensivere Pflege und Wirkung.</p>
        <p><strong className="text-primary-deep">2. Spezialtechnik:</strong> Afro Touch Methode für tiefere Entspannung und gezielte Lockerung.</p>
        <p><strong className="text-primary-deep">3. Kombi-Angebote:</strong> Spare gegenüber Einzelbuchung und genieße ein rundes Wellness-Erlebnis.</p>
        <p><strong className="text-primary-deep">4. Klare Preisstruktur:</strong> Logische Abstufung zwischen den Behandlungsdauern – keine versteckten Kosten.</p>
      </div>
    </section>

    {/* Legal / important notice */}
    <section className="container pb-14 max-w-3xl">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 space-y-2">
        <p className="text-sm text-amber-900">
          <strong>Hinweis:</strong> Alle Massagen sind reine Wellnessanwendungen zur Entspannung. Keine Diagnosen, Therapien oder Heilbehandlungen.
          Nach Operationen nur mit ärztlicher Freigabe.
        </p>
        <p className="text-sm font-bold text-destructive uppercase tracking-wide">
          ⛔ Keine Erotikmassage
        </p>
      </div>
    </section>
  </Layout>
);

export default Services;
