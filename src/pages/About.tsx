import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Flower2, Heart, Sparkles, ShieldCheck, Clock, Award, Calendar } from "lucide-react";
import interior from "@/assets/spa-interior.jpg";

const About = () => (
  <Layout>
    <section className="gradient-hero py-16">
      <div className="container text-center">
        <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="font-serif text-5xl text-primary-deep">Afro Massage by Amaka</h1>
        <p className="font-script text-2xl text-primary mt-2">Your well-being comes first.</p>
      </div>
    </section>
    <section className="container py-16 grid md:grid-cols-2 gap-12 items-center">
      <img src={interior} alt="Amaka Massage studio interior" loading="lazy" width={1200} height={800}
        className="rounded-2xl shadow-soft h-[460px] w-full object-cover" />
      <div>
        <p className="text-lg text-foreground/80 leading-relaxed">
          Amaka Massage is a premium Afro massage studio in Essen. Every treatment draws on authentic
          African bodywork traditions, delivered with care, personal attention, and years of experience.
        </p>
        <p className="text-lg text-foreground/80 leading-relaxed mt-4">
          Located in Essen, our studio offers a calm and private environment where you can
          truly switch off. Our goal is simple: <span className="text-primary font-medium">you leave
          relaxed, refreshed, and stress-free.</span>
        </p>
        <h3 className="font-serif text-2xl text-primary-deep mt-8">Why Choose Afro Massage by Amaka</h3>
        <ul className="mt-4 space-y-3">
          {[
            { i: Heart, t: "Authentic African massage techniques" },
            { i: Sparkles, t: "Calm, private atmosphere" },
            { i: ShieldCheck, t: "Personal attention for every client" },
            { i: Award, t: "Affordable, transparent prices" },
            { i: Clock, t: "Easy online or WhatsApp booking" },
          ].map((f) => (
            <li key={f.t} className="flex items-center gap-3">
              <f.i className="h-5 w-5 text-primary" />
              <span className="text-foreground/80">{f.t}</span>
            </li>
          ))}
        </ul>
        <Link to="/booking" className="inline-block mt-8">
          <Button className="gradient-purple text-primary-foreground hover:opacity-90">
            <Calendar className="mr-2 h-4 w-4" /> Book a Session
          </Button>
        </Link>
      </div>
    </section>
  </Layout>
);

export default About;
