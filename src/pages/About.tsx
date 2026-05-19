import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Flower2, Heart, Sparkles, ShieldCheck, Clock, Award, Calendar, Gift } from "lucide-react";
import interior from "@/assets/3.webp";

const About = () => (
  <Layout>
    <section className="gradient-hero py-16">
      <div className="container text-center">
        <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="font-serif text-5xl text-primary-deep">Amaka's City Afro Touch</h1>
        <p className="font-script text-2xl text-primary mt-2">Ihr Wohlbefinden steht an erster Stelle.</p>
        <p className="text-muted-foreground mt-2">Traditionelle Massage – Essen</p>
      </div>
    </section>
    <section className="container py-16 grid md:grid-cols-2 gap-12 items-center">
      <img src={interior} alt="Amaka's City – Wellness Studio Essen" loading="lazy" width={1200} height={800}
        className="rounded-2xl shadow-soft h-[460px] w-full object-cover" />
      <div>
        <p className="text-lg text-foreground/80 leading-relaxed">
          Amaka's City Afro Touch ist ein erstklassiges Massagestudio mit afrikanischen Wurzeln in Essen.
          Jede Behandlung basiert auf authentischen afrikanischen Körpertechniken, durchgeführt mit Sorgfalt, persönlicher Aufmerksamkeit und langjähriger Erfahrung.
        </p>
        <p className="text-lg text-foreground/80 leading-relaxed mt-4">
          In unserem Studio in Essen schaffen wir eine ruhige und private Umgebung, in der Sie wirklich abschalten können.
          Unser Ziel ist einfach: <span className="text-primary font-medium">Sie verlassen uns entspannt, erfrischt und stressfrei.</span>
        </p>
        <h3 className="font-serif text-2xl text-primary-deep mt-8">Warum Amaka's City Afro Touch?</h3>
        <ul className="mt-4 space-y-3">
          {[
            { i: Heart,      t: "Authentische afrikanische Massagetechniken" },
            { i: Sparkles,   t: "Ruhige, private Atmosphäre" },
            { i: ShieldCheck, t: "Persönliche Betreuung für jeden Kunden" },
            { i: Award,      t: "Transparente, faire Preise" },
            { i: Clock,      t: "Einfache Online-Buchung oder per Telefon" },
            { i: Gift,       t: "Geschenkgutscheine erhältlich" },
          ].map((f) => (
            <li key={f.t} className="flex items-center gap-3">
              <f.i className="h-5 w-5 text-primary" />
              <span className="text-foreground/80">{f.t}</span>
            </li>
          ))}
        </ul>
        <Link to="/booking" className="inline-block mt-8">
          <Button className="gradient-purple text-primary-foreground hover:opacity-90">
            <Calendar className="mr-2 h-4 w-4" /> Termin buchen
          </Button>
        </Link>
      </div>
    </section>
    <section className="container pb-12 max-w-2xl mx-auto text-center">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 space-y-1">
        <p className="text-sm text-amber-900">
          <strong>Hinweis:</strong> Unsere Massagen verstehen sich als Wellnessbehandlung. Keine Diagnosen oder Heilbehandlungen.
        </p>
        <p className="text-sm font-bold text-destructive uppercase tracking-wide">⛔ Keine Erotikmassage</p>
      </div>
    </section>
  </Layout>
);

export default About;
