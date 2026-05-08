import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Flower2, MapPin, Phone, Clock, MessageCircle, CreditCard, Car } from "lucide-react";
import { toast } from "sonner";

const PHONE   = "015906306248";
const PHONE_D = "0159 06306248";
const PHONE2  = "020174921756";
const PHONE2_D = "0201 74921756";
const WA      = "https://wa.me/4915213928938";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Vielen Dank! Wir melden uns in Kürze bei Ihnen.");
    (e.target as HTMLFormElement).reset();
  };
  return (
    <Layout>
      <section className="gradient-hero py-16">
        <div className="container text-center">
          <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
          <h1 className="font-serif text-5xl text-primary-deep">Kontakt & Buchung</h1>
          <p className="font-script text-2xl text-primary mt-2">Wir sind für Sie da.</p>
        </div>
      </section>

      <section className="container py-16 grid lg:grid-cols-2 gap-10">
        <div className="space-y-5">
          <div className="bg-card rounded-2xl p-6 shadow-card flex gap-4">
            <MapPin className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-xl text-primary-deep">Adresse</h3>
              <p className="text-muted-foreground mt-1">Bochumer Landstr. 154<br />45276 Essen</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card flex gap-4">
            <Car className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-xl text-primary-deep">Parken</h3>
              <p className="text-muted-foreground mt-1">Parkmöglichkeiten am Essen Steele Ostbahnhof, nur 2 Gehminuten von unserem Studio entfernt.</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card flex gap-4">
            <Phone className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-xl text-primary-deep">Telefon / WhatsApp</h3>
              <a href={`tel:${PHONE}`} className="text-primary font-semibold block mt-1">{PHONE_D}</a>
              <a href={`tel:${PHONE2}`} className="text-primary font-semibold block mt-0.5">{PHONE2_D}</a>
              <a href={WA} target="_blank" rel="noreferrer" className="text-green-600 block mt-0.5 text-sm">WhatsApp: 01521 3928938</a>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card flex gap-4">
            <Clock className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-xl text-primary-deep">Öffnungszeiten</h3>
              <p className="text-muted-foreground mt-1">
                Mo. – Di., Do. – Fr.: 10:00 – 19:00 Uhr<br />
                Mi.: 10:00 – 17:00 Uhr<br />
                Sa.: 13:00 – 20:00 Uhr<br />
                So.: Geschlossen
              </p>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
            <CreditCard className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-primary-deep"><strong>Kartenzahlung akzeptiert</strong> – Zahlen Sie bequem vor Ort mit Karte oder Bar.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${PHONE}`}>
              <Button className="gradient-purple text-primary-foreground hover:opacity-90">
                <Phone className="mr-2 h-4 w-4" /> {PHONE_D}
              </Button>
            </a>
            <a href={`tel:${PHONE2}`}>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Phone className="mr-2 h-4 w-4" /> {PHONE2_D}
              </Button>
            </a>
            <a href={WA} target="_blank" rel="noreferrer">
              <Button className="bg-green-500 text-white hover:bg-green-600">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card">
            <iframe title="Karte"
              src="https://www.google.com/maps?q=Bochumer+Landstra%C3%9Fe+154,+45276+Essen&output=embed"
              className="w-full h-64 border-0" loading="lazy" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-card space-y-4 h-fit">
          <h2 className="font-serif text-2xl text-primary-deep">Nachricht senden</h2>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required className="mt-1" placeholder="Ihr vollständiger Name" />
          </div>
          <div>
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" type="email" required className="mt-1" placeholder="ihre@email.de" />
          </div>
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" type="tel" className="mt-1" placeholder="0159 06306248" />
          </div>
          <div>
            <Label htmlFor="message">Nachricht</Label>
            <Textarea id="message" required rows={4} className="mt-1" placeholder="Ihre Nachricht oder Terminwunsch..." />
          </div>
          <Button type="submit" className="w-full gradient-purple text-primary-foreground hover:opacity-90">
            Nachricht senden
          </Button>
          <p className="text-xs text-muted-foreground text-center">Wir freuen uns auf Ihren Besuch!</p>
        </form>
      </section>

      <section className="container pb-12 max-w-2xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          <strong>Hinweis:</strong> Unsere Massagen verstehen sich als Wellnessbehandlung. Keine Diagnosen oder Heilbehandlungen. <strong>Keine Erotikmassage.</strong>
        </p>
      </section>
    </Layout>
  );
};

export default Contact;
