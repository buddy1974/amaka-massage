import { Layout } from "@/components/site/Layout";
import { Flower2, Heart, Sparkles, ShieldCheck, Clock, Award } from "lucide-react";
import interior from "@/assets/spa-interior.jpg";

const About = () => (
  <Layout>
    <section className="gradient-hero py-16">
      <div className="container text-center">
        <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="font-serif text-5xl text-primary-deep">About Us</h1>
        <p className="font-script text-2xl text-primary mt-2">Your well-being comes first.</p>
      </div>
    </section>
    <section className="container py-16 grid md:grid-cols-2 gap-12 items-center">
      <img src={interior} alt="Spa interior" loading="lazy" width={1200} height={800}
        className="rounded-2xl shadow-soft h-[460px] w-full object-cover" />
      <div>
        <p className="text-lg text-foreground/80 leading-relaxed">
          At Amaka Massage, your well-being comes first. Every treatment is done with care,
          attention, and experience.
        </p>
        <p className="text-lg text-foreground/80 leading-relaxed mt-4">
          Located in Essen, our studio offers a calm and private environment where you can
          truly switch off. Our goal is simple: you leave relaxed, refreshed, and stress-free.
        </p>
        <h3 className="font-serif text-2xl text-primary-deep mt-8">Why Choose Us</h3>
        <ul className="mt-4 space-y-3">
          {[
            { i: Heart, t: "Professional massage therapy" },
            { i: Sparkles, t: "Calm and private atmosphere" },
            { i: ShieldCheck, t: "Personal attention for every client" },
            { i: Award, t: "Affordable, transparent prices" },
            { i: Clock, t: "Easy booking by phone or WhatsApp" },
          ].map((f) => (
            <li key={f.t} className="flex items-center gap-3">
              <f.i className="h-5 w-5 text-primary" />
              <span className="text-foreground/80">{f.t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </Layout>
);

export default About;
