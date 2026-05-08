import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Phone, MapPin, Clock, CheckCircle2, Star } from "lucide-react";
import hero from "@/assets/hero-massage.png";
import about from "@/assets/8.png";
import room1 from "@/assets/3.png";
import room2 from "@/assets/4.png";
import room3 from "@/assets/5.png";
import { services } from "@/data/services";

const PHONE     = "015213928938";
const PHONE_D   = "01521 3928938";
const PHONE2    = "020174921756";
const PHONE2_D  = "0201 74921756";

const Index = () => (
  <Layout>

    {/* ── 1. HERO ──────────────────────────────────────────── */}
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <img
        src={hero}
        alt="Professional Afro massage therapist in Essen"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
      <div className="relative container py-24">
        <div className="max-w-2xl">
          <p className="text-accent font-medium tracking-[0.25em] uppercase text-sm mb-4">
            Essen · Premium Wellness
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight">
            Premium Afro<br />Massage in Essen
          </h1>
          <p className="text-white/80 text-xl mt-6 leading-relaxed max-w-lg">
            Relax your body. Clear your mind. Feel renewed.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link to="/booking">
              <Button size="lg" className="gradient-purple text-white hover:opacity-90 px-8 h-14 text-lg shadow-lg">
                <Calendar className="mr-2 h-5 w-5" /> Book Appointment
              </Button>
            </Link>
            <a href={`tel:${PHONE}`}>
              <Button size="lg" variant="outline"
                className="border-white/60 text-white bg-white/10 hover:bg-white hover:text-primary-deep px-8 h-14 text-lg backdrop-blur-sm">
                <Phone className="mr-2 h-5 w-5" /> Call Now
              </Button>
            </a>
          </div>
          <p className="text-white/50 text-sm mt-8 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>4.9 / 5 &nbsp;·&nbsp; 23 reviews &nbsp;·&nbsp; Trusted by clients in Essen</span>
          </p>
        </div>
      </div>
    </section>

    {/* ── 2. TRUST BAR ─────────────────────────────────────── */}
    <section className="bg-[#0d0020] text-primary-foreground py-5">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-8 md:gap-14 text-sm font-medium">
          {[
            "Professional Afro Massage",
            "Clean & Private Environment",
            "Easy Booking",
          ].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── 3. SERVICES GRID ─────────────────────────────────── */}
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-2">Our Treatments</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary-deep">Massage Services</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {services.map((s) => (
            <article
              key={s.slug}
              className="group flex bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300"
            >
              <div className="w-36 md:w-44 shrink-0 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <h3 className="font-serif text-xl text-primary-deep">{s.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-primary font-bold text-lg">from {s.prices[0].price}</span>
                  <Link to="/booking">
                    <Button size="sm" className="gradient-purple text-white hover:opacity-90">
                      Book
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
              View Full Price List
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* ── 4. ABOUT / EXPERIENCE ────────────────────────────── */}
    <section className="bg-secondary/40 py-24">
      <div className="container grid md:grid-cols-2 gap-14 items-center">
        <img
          src={about}
          alt="Calm massage studio interior in Essen"
          loading="lazy"
          className="rounded-2xl shadow-soft h-[480px] w-full object-cover"
        />
        <div>
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-3">About Us</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary-deep leading-tight">
            Your place<br />to relax
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed mt-6">
            We offer authentic Afro massage in a calm, private environment.
            Our goal is simple — help you release stress and feel better.
          </p>
          <p className="text-foreground/70 text-lg leading-relaxed mt-4">
            Every treatment draws on the rich traditions of African bodywork,
            delivered with care and years of experience.
          </p>
          <Link to="/booking" className="inline-block mt-8">
            <Button size="lg" className="gradient-purple text-white hover:opacity-90 px-8 h-14">
              <Calendar className="mr-2 h-5 w-5" /> Book your session today
            </Button>
          </Link>
        </div>
      </div>
    </section>


    {/* ── 4b. GOOGLE REVIEWS ───────────────────────────────── */}
    <section className="py-24 bg-secondary/30">
      <div className="container">
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            { icon: "⭐", label: "4.9 / 5 Rating" },
            { icon: "✔", label: "Trusted in Essen" },
            { icon: "✔", label: "Real customer feedback" },
          ].map((b) => (
            <div key={b.label}
              className="flex items-center gap-2 bg-card rounded-full px-5 py-2 shadow-card text-sm font-medium text-primary-deep">
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
        <div className="text-center mb-10">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-2">Google Reviews</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary-deep">What our clients say</h2>
          <p className="text-muted-foreground mt-3">Real experiences from our customers in Essen</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { text: "Very relaxing massage, professional and clean environment. I will definitely come again.", name: "Thomas K." },
            { text: "Best massage I had in Essen. Friendly and calm atmosphere — exactly what I needed after a stressful week.", name: "Lisa M." },
            { text: "Strong hands, deep relaxation. Professional service in a very private and clean studio.", name: "Daniel S." },
          ].map((r) => (
            <div key={r.name} className="bg-card rounded-2xl shadow-card p-7 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed flex-1">"{r.text}"</p>
              <p className="font-semibold text-primary-deep text-sm">— {r.name}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="https://share.google/o3OJXaFsTcN1sx6kO" target="_blank" rel="noreferrer">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white gap-2 px-8">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              View all reviews on Google
            </Button>
          </a>
        </div>
      </div>
    </section>

    {/* ── 5. PRICING ───────────────────────────────────────── */}
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-2">Transparent Prices</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary-deep">Simple Pricing</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Standard */}
          <div className="bg-card rounded-2xl shadow-card p-8">
            <h3 className="font-serif text-2xl text-primary-deep">Standard Massage</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Traditional · Deep Tissue · Hot Stone · Foot · Head
            </p>
            <ul className="mt-6 space-y-3">
              {([["30 min","25 €"],["60 min","40 €"],["90 min","58 €"]] as const).map(([d,p]) => (
                <li key={d} className={`flex justify-between items-center py-3 px-4 rounded-xl ${
                  d === "60 min" ? "bg-primary/10 border border-primary/30" : "bg-secondary"
                }`}>
                  <span className="font-medium text-foreground">{d}</span>
                  <div className="flex items-center gap-2">
                    {d === "60 min" && (
                      <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                        Most popular
                      </span>
                    )}
                    <span className="font-bold text-primary text-lg">{p}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Aroma */}
          <div className="bg-primary-deep rounded-2xl shadow-soft p-8 text-primary-foreground">
            <h3 className="font-serif text-2xl text-accent">Aroma Oil Massage</h3>
            <p className="text-primary-foreground/60 text-sm mt-1">
              Warm oils · African botanicals · Deep calm
            </p>
            <ul className="mt-6 space-y-3">
              {([["30 min","30 €"],["60 min","49 €"],["90 min","69 €"]] as const).map(([d,p]) => (
                <li key={d} className={`flex justify-between items-center py-3 px-4 rounded-xl ${
                  d === "60 min" ? "bg-accent/20 border border-accent/40" : "bg-white/10"
                }`}>
                  <span className="font-medium">{d}</span>
                  <div className="flex items-center gap-2">
                    {d === "60 min" && (
                      <span className="text-xs text-accent font-medium bg-accent/20 px-2 py-0.5 rounded-full">
                        Most popular
                      </span>
                    )}
                    <span className="font-bold text-accent text-lg">{p}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center mt-10">
          <Link to="/booking">
            <Button size="lg" className="gradient-purple text-white hover:opacity-90 px-10 h-14">
              <Calendar className="mr-2 h-5 w-5" /> Book Now
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* ── 6. OUR SPACE ─────────────────────────────────────── */}
    <section className="bg-secondary/40 py-24">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-2">Our Studio</p>
          <h2 className="font-serif text-4xl md:text-5xl text-primary-deep">
            Relax in a calm environment
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <img src={room1} alt="Studio space" loading="lazy"
            className="rounded-2xl shadow-card h-64 w-full object-cover hover:scale-[1.02] transition-transform duration-500" />
          <img src={room2} alt="Massage room" loading="lazy"
            className="rounded-2xl shadow-card h-64 w-full object-cover hover:scale-[1.02] transition-transform duration-500 md:mt-8" />
          <img src={room3} alt="Relaxation area" loading="lazy"
            className="rounded-2xl shadow-card h-64 w-full object-cover hover:scale-[1.02] transition-transform duration-500" />
        </div>
      </div>
    </section>

    {/* ── 7. STRONG CTA ────────────────────────────────────── */}
    <section className="gradient-purple text-primary-foreground py-28">
      <div className="container text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
          Ready to relax?
        </h2>
        <p className="text-primary-foreground/75 text-xl mt-5 leading-relaxed">
          Book your appointment now or call directly.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link to="/booking">
            <Button size="lg"
              className="bg-white text-primary-deep hover:bg-accent hover:text-primary-deep font-bold px-10 h-14 text-lg">
              <Calendar className="mr-2 h-5 w-5" /> Book Now
            </Button>
          </Link>
          <a href={`tel:${PHONE}`}>
            <Button size="lg" variant="outline"
              className="border-white text-white bg-transparent hover:bg-white hover:text-primary-deep px-10 h-14 text-lg">
              <Phone className="mr-2 h-5 w-5" /> Call Now
            </Button>
          </a>
        </div>
      </div>
    </section>

    {/* ── 8. CONTACT + MAP ─────────────────────────────────── */}
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-primary font-medium tracking-[0.25em] uppercase text-sm mb-2">Find Us</p>
          <h2 className="font-serif text-4xl text-primary-deep">Visit the Studio</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-xl p-3 shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-primary-deep">Address</p>
                <p className="text-muted-foreground mt-0.5">
                  Bochumer Landstraße 154<br />45276 Essen
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-xl p-3 shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-primary-deep">Phone</p>
                <a href={`tel:${PHONE}`} className="text-primary font-bold block hover:underline mt-0.5">
                  {PHONE_D}
                </a>
                <a href={`tel:${PHONE2}`} className="text-muted-foreground block hover:underline">
                  {PHONE2_D}
                </a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-xl p-3 shrink-0">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-primary-deep">Opening Hours</p>
                <p className="text-muted-foreground mt-0.5">Mon – Fri: 10:00 – 19:00</p>
                <p className="text-muted-foreground">Saturday: 13:00 – 20:00</p>
                <p className="text-muted-foreground">Sunday: Closed</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card h-72">
            <iframe
              title="Amaka Massage location"
              src="https://www.google.com/maps?q=Bochumer+Landstra%C3%9Fe+154,+45276+Essen&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

  </Layout>
);

export default Index;
