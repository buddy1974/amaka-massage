import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Flower2, Gift, Tag, Calendar } from "lucide-react";

const Offers = () => (
  <Layout>
    <section className="gradient-hero py-16">
      <div className="container text-center">
        <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="font-serif text-5xl text-primary-deep">Angebote & Pakete</h1>
        <p className="font-script text-2xl text-primary mt-2">Mehr Entspannung, mehr Wert.</p>
      </div>
    </section>

    {/* Kombis */}
    <section className="container py-16">
      <h2 className="font-serif text-3xl text-primary-deep mb-2">Kombi-Massage / Wellness Paket</h2>
      <p className="text-muted-foreground mb-8">Jeweils 2 Stunden · Die perfekte Kombination für tiefe Entspannung</p>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            label: "Kombi 1",
            price: "109 €",
            slug: "kombi-massage-1",
            items: ["Traditionelle Massage 60 Min.", "Kopf-Schulter-Nacken-Massage 30 Min.", "Fußmassage 30 Min."],
          },
          {
            label: "Kombi 2",
            price: "109 €",
            slug: "kombi-massage-2",
            items: ["Wellness-Aroma Öl Massage 60 Min.", "Kopf-Gesicht-Massage 30 Min.", "Fußmassage 30 Min."],
          },
          {
            label: "Kombi 3",
            price: "119 €",
            slug: "kombi-massage-3",
            items: ["Hot-Stone Massage 90 Min.", "Kopf-Nacken und Fußmassage 30 Min."],
            highlight: true,
          },
        ].map((k) => (
          <div key={k.label} className={`rounded-2xl shadow-card p-7 flex flex-col ${k.highlight ? 'bg-primary-deep text-primary-foreground' : 'bg-card'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`font-serif text-2xl ${k.highlight ? 'text-accent' : 'text-primary-deep'}`}>{k.label}</h3>
              <div className="text-right">
                <p className={`font-bold text-2xl ${k.highlight ? 'text-accent' : 'text-primary'}`}>{k.price}</p>
                <p className={`text-xs ${k.highlight ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>2 Std.</p>
              </div>
            </div>
            <ul className="space-y-2 flex-1">
              {k.items.map((item) => (
                <li key={item} className={`flex gap-2 text-sm ${k.highlight ? 'text-primary-foreground/80' : 'text-foreground/80'}`}>
                  <span className={k.highlight ? 'text-accent' : 'text-primary'}>·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to={`/booking?service=${k.slug}`} className="mt-6">
              <Button className={`w-full ${k.highlight ? 'bg-accent text-primary-deep hover:bg-accent/90' : 'gradient-purple text-primary-foreground hover:opacity-90'}`}>
                <Calendar className="mr-2 h-4 w-4" /> Jetzt buchen
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>

    {/* Gift vouchers */}
    <section className="bg-secondary/40 py-16">
      <div className="container max-w-2xl mx-auto text-center">
        <div className="bg-card rounded-2xl shadow-soft p-10">
          <div className="h-16 w-16 rounded-full gradient-purple flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-3xl text-primary-deep">Geschenkgutscheine</h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Schenken Sie Entspannung. Geschenkgutscheine sind für alle Massageleistungen erhältlich –
            das perfekte Geschenk für Geburtstage, Jubiläen oder einfach als Dankeschön.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a href="tel:015213928938">
              <Button className="gradient-purple text-primary-foreground hover:opacity-90">
                <Tag className="mr-2 h-4 w-4" /> Gutschein anfragen
              </Button>
            </a>
            <a href="https://wa.me/4915213928938" target="_blank" rel="noreferrer">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>

    <div className="container pb-16 pt-8 text-center">
      <Link to="/services">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
          Alle Leistungen & Preise ansehen
        </Button>
      </Link>
    </div>
  </Layout>
);

export default Offers;
