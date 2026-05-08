import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Phone, Heart, Sparkles, ShieldCheck, Clock, Flower2 } from "lucide-react";
import hero from "@/assets/hero-massage.png";
import interior from "@/assets/8.png";
import { services } from "@/data/services";

const Index = () => {
  return (
    <Layout>
      {/* HERO */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container grid lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
          <div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary-deep leading-tight">
              AMAKA MASSAGE <span className="text-primary">– ESSEN</span>
            </h1>
            <p className="font-script text-3xl md:text-4xl text-primary mt-4">
              Relax. Recharge. Feel Better.
            </p>
            <p className="text-base md:text-lg text-foreground/70 mt-6 max-w-md">
              Premium Afro Massage in a calm, private environment.
              Experience the healing traditions of African bodywork in Essen.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/booking">
                <Button size="lg" className="gradient-purple text-primary-foreground hover:opacity-90 shadow-soft">
                  <Calendar className="mr-2 h-5 w-5" /> Book Now
                </Button>
              </Link>
              <a href="tel:015906306248">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Phone className="mr-2 h-5 w-5" /> Call Now
                </Button>
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={hero}
              alt="Afro Massage by Amaka – Professional therapist in Essen"
              width={1536}
              height={1024}
              className="rounded-2xl shadow-soft w-full h-[420px] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 bg-background rounded-2xl shadow-soft p-4">
              <Flower2 className="h-8 w-8 text-primary" />
              <div>
                <div className="font-serif text-primary-deep font-semibold">Premium Afro Massage</div>
                <div className="text-xs text-muted-foreground">by Amaka – Essen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
          <h2 className="font-serif text-4xl text-primary-deep">Afro Massage by Amaka</h2>
          <p className="font-script text-2xl text-primary mt-2">Care, tradition and experience.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img src={interior} alt="Calm massage studio interior" loading="lazy" width={1200} height={800}
            className="rounded-2xl shadow-soft object-cover h-[400px] w-full" />
          <div>
            <p className="text-foreground/80 leading-relaxed text-lg">
              At Amaka Massage, every treatment draws on the rich traditions of African bodywork.
              Each session is delivered with care, attention, and years of experience.
            </p>
            <p className="text-foreground/80 leading-relaxed text-lg mt-4">
              Our goal is simple: <span className="text-primary font-medium">you leave relaxed,
              refreshed, and stress-free.</span>
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                { icon: Heart, text: "Authentic Afro techniques" },
                { icon: Sparkles, text: "Calm, private atmosphere" },
                { icon: ShieldCheck, text: "Personal attention" },
                { icon: Clock, text: "Easy online booking" },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3 bg-secondary rounded-xl p-3">
                  <f.icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm text-primary-deep font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-secondary/40 py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
            <h2 className="font-serif text-4xl text-primary-deep">Our Afro Massages</h2>
            <p className="text-muted-foreground mt-2">Six premium treatments rooted in African tradition.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <article key={s.slug} className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow group">
                <div className="overflow-hidden">
                  <img src={s.image} alt={s.name} loading="lazy" width={800} height={600}
                    className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-primary-deep">{s.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                  <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
                    {s.prices.map((p) => (
                      <li key={p.duration} className="flex justify-between text-sm">
                        <span className="text-foreground/70">{p.duration}</span>
                        <span className="font-semibold text-primary">{p.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View All Services & Prices
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-purple text-primary-foreground py-20">
        <div className="container text-center">
          <h2 className="font-serif text-4xl md:text-5xl">Experience Premium Afro Massage.</h2>
          <p className="font-script text-3xl text-accent mt-3">You deserve it.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/booking">
              <Button size="lg" className="bg-background text-primary hover:bg-accent">
                <Calendar className="mr-2 h-5 w-5" /> Book Now
              </Button>
            </Link>
            <a href="https://wa.me/4915906306248" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary">
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
