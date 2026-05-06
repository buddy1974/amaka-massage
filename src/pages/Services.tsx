import { Layout } from "@/components/site/Layout";
import { services } from "@/data/services";
import { Flower2 } from "lucide-react";

const Services = () => (
  <Layout>
    <section className="gradient-hero py-16">
      <div className="container text-center">
        <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="font-serif text-5xl text-primary-deep">Services & Prices</h1>
        <p className="font-script text-2xl text-primary mt-2">Transparent. Honest. Calm.</p>
      </div>
    </section>
    <section className="container py-16 grid md:grid-cols-2 gap-8">
      {services.map((s) => (
        <article key={s.name} className="bg-card rounded-2xl overflow-hidden shadow-card flex flex-col md:flex-row">
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
  </Layout>
);

export default Services;
