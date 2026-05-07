import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { services } from "@/data/services";
import { Calendar, Flower2 } from "lucide-react";

const Services = () => (
  <Layout>
    <section className="gradient-hero py-16">
      <div className="container text-center">
        <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="font-serif text-5xl text-primary-deep">Afro Massage Services & Prices</h1>
        <p className="font-script text-2xl text-primary mt-2">Transparent. Honest. Rooted in tradition.</p>
      </div>
    </section>
    <section className="container py-16 grid md:grid-cols-2 gap-8">
      {services.map((s) => (
        <article key={s.slug} className="bg-card rounded-2xl overflow-hidden shadow-card flex flex-col md:flex-row">
          <img src={s.image} alt={s.name} loading="lazy" width={800} height={600}
            className="md:w-2/5 h-56 md:h-auto object-cover" />
          <div className="p-6 flex-1">
            <h2 className="font-serif text-2xl text-primary-deep">{s.name}</h2>
            <p className="text-sm text-muted-foreground mt-2">{s.description}</p>
            <ul className="mt-4 space-y-2 border-t border-border pt-4">
              {s.prices.map((p) => (
                <li key={p.duration} className="flex justify-between">
                  <span className="text-foreground/70">{p.duration}</span>
                  <span className="font-semibold text-primary">{p.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
    <section className="gradient-purple text-primary-foreground py-12">
      <div className="container text-center">
        <p className="font-script text-2xl text-accent">Ready to experience the difference?</p>
        <Link to="/booking" className="inline-block mt-4">
          <Button size="lg" className="bg-background text-primary hover:bg-accent">
            <Calendar className="mr-2 h-5 w-5" /> Book Your Session
          </Button>
        </Link>
      </div>
    </section>
  </Layout>
);

export default Services;
