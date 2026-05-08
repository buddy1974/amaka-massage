import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Flower2, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you shortly.");
    (e.target as HTMLFormElement).reset();
  };
  return (
    <Layout>
      <section className="gradient-hero py-16">
        <div className="container text-center">
          <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
          <h1 className="font-serif text-5xl text-primary-deep">Contact & Booking</h1>
          <p className="font-script text-2xl text-primary mt-2">We are here for you.</p>
        </div>
      </section>

      <section className="container py-16 grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-card flex gap-4">
            <MapPin className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-serif text-xl text-primary-deep">Address</h3>
              <p className="text-muted-foreground mt-1">Bochumer Landstraße 154<br />45276 Essen</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card flex gap-4">
            <Phone className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-serif text-xl text-primary-deep">Phone / WhatsApp</h3>
              <a href="tel:015906306248" className="text-primary font-semibold block">0159 06306248</a>
              <a href="tel:020174921756" className="text-primary font-semibold block mt-0.5">0201 74921756</a>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card flex gap-4">
            <Clock className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-serif text-xl text-primary-deep">Opening Hours</h3>
              <p className="text-muted-foreground mt-1">
                Mon – Tue, Thu – Fri: 10:00 – 19:00<br />
                Wednesday: 10:00 – 17:00<br />
                Saturday: 13:00 – 20:00
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="tel:015906306248">
              <Button className="gradient-purple text-primary-foreground hover:opacity-90">
                <Phone className="mr-2 h-4 w-4" /> 0159 06306248
              </Button>
            </a>
            <a href="tel:020174921756">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Phone className="mr-2 h-4 w-4" /> 0201 74921756
              </Button>
            </a>
            <a href="https://wa.me/4915906306248" target="_blank" rel="noreferrer">
              <Button className="bg-green-500 text-white hover:bg-green-600">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card">
            <iframe
              title="Map"
              src="https://www.google.com/maps?q=Bochumer+Landstra%C3%9Fe+154,+45276+Essen&output=embed"
              className="w-full h-64 border-0"
              loading="lazy"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-card space-y-4 h-fit">
          <h2 className="font-serif text-2xl text-primary-deep">Send us a message</h2>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} required className="mt-1" />
          </div>
          <Button type="submit" className="gradient-purple text-primary-foreground hover:opacity-90 w-full">
            Send Message
          </Button>
        </form>
      </section>
    </Layout>
  );
};

export default Contact;
