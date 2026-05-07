import { Layout } from "@/components/site/Layout";
import { Flower2 } from "lucide-react";

const Booking = () => (
  <Layout>
    <section className="gradient-hero py-16">
      <div className="container text-center">
        <Flower2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="font-serif text-5xl text-primary-deep">Book Your Session</h1>
        <p className="font-script text-2xl text-primary mt-2">Premium Afro Massage by Amaka</p>
      </div>
    </section>
    <section className="container py-16 text-center">
      <p className="text-muted-foreground">Booking system coming soon.</p>
    </section>
  </Layout>
);

export default Booking;
