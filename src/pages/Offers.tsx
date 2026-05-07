import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Flower2, Gift, Heart, Sparkles, Users, Tag } from "lucide-react";
import couple from "@/assets/service-couple.jpg";

const offers = [
  { icon: Sparkles, title: "New Client Offer", text: "10% discount on your first Afro Massage visit." },
  { icon: Tag, title: "3 Sessions Package", text: "Save 5 € when you book 3 Afro Massage sessions." },
  { icon: Tag, title: "5 Sessions Package", text: "Save 10 € when you book 5 Afro Massage sessions." },
  { icon: Gift, title: "Gift Voucher", text: "Available for all Afro Massage services. The perfect gift." },
];

const Offers = () => (
  <Layout>
    <section className="gradient-hero py-16">
      <div className="container text-center">
        <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="font-serif text-5xl text-primary-deep">Special Offers</h1>
        <p className="font-script text-2xl text-primary mt-2">Treat yourself, save more.</p>
      </div>
    </section>

    <section className="container py-16">
      <div className="grid md:grid-cols-2 gap-6">
        {offers.map((o) => (
          <div key={o.title} className="bg-card rounded-2xl p-8 shadow-card flex gap-5">
            <div className="h-14 w-14 rounded-full gradient-purple flex items-center justify-center shrink-0">
              <o.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-primary-deep">{o.title}</h3>
              <p className="text-muted-foreground mt-2">{o.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid md:grid-cols-2 bg-card rounded-2xl overflow-hidden shadow-soft">
        <img src={couple} alt="Afro Couple Massage" loading="lazy" width={800} height={600}
          className="h-64 md:h-full w-full object-cover" />
        <div className="p-10">
          <Users className="h-8 w-8 text-primary" />
          <h3 className="font-serif text-3xl text-primary-deep mt-3">Afro Couple Massage</h3>
          <p className="text-muted-foreground mt-2">Share a relaxing Afro Massage experience side by side.</p>
          <ul className="mt-6 space-y-2">
            <li className="flex justify-between border-b border-border pb-2">
              <span>60 min</span><span className="font-semibold text-primary">90 €</span>
            </li>
            <li className="flex justify-between">
              <span>90 min</span><span className="font-semibold text-primary">120 €</span>
            </li>
          </ul>
          <Link to="/booking">
            <Button className="mt-6 gradient-purple text-primary-foreground hover:opacity-90">
              <Heart className="mr-2 h-4 w-4" /> Book Afro Couple Massage
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default Offers;
