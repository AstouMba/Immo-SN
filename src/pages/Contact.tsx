import Layout from "@/components/layout/Layout";
import ContactForm from "@/components/forms/ContactForm";
import { MapPin, Phone, Clock, Mail, MessageSquare } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-12">
            <div>
              <div className="inline-flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.34em] text-muted-foreground">
                <span className="h-px w-10 bg-muted-foreground/40" />
                Nous joindre
              </div>
              
              <h1 className="mt-8 font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1] tracking-tight text-primary">
                Parlons de votre <br />
                <span className="text-accent italic">futur projet.</span>
              </h1>
              <p className="mt-10 max-w-xl text-[1.15rem] leading-[1.8] text-muted">
                Une question, une estimation ou une visite ? Notre équipe est à votre écoute pour vous accompagner dans vos démarches immobilières.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: Phone, label: "Téléphone", value: "+221 77 091 91 91" },
                { icon: Mail, label: "Messagerie", value: "contact@domaine-discover.com" },
                { icon: MessageSquare, label: "WhatsApp", value: "+221 77 091 91 91" },
                { icon: Clock, label: "Disponibilité", value: "Lun - Ven, 9h - 19h" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="rounded-[2.5rem] border border-black/5 bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-premium group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-beige-400/20 text-accent transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-6 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/50">{item.label}</p>
                    <p className="mt-2 text-[1rem] font-semibold text-primary">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="relative overflow-hidden rounded-[3rem] border border-black/10 shadow-sm grayscale transition duration-500 hover:grayscale-0">
              <iframe
                title="Localisation de l'agence"
                src="https://maps.google.com/maps?q=Mbao,%20Dakar,%20Senegal&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="h-96 w-full"
                loading="lazy"
                style={{ border: 0 }}
              />
              <div className="absolute top-6 left-6 rounded-full bg-white/20 border border-white/30 px-5 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white backdrop-blur-md flex items-center gap-2 shadow-sm">
                <MapPin className="h-3.5 w-3.5" />
                Siège Social
              </div>
            </div>
          </div>

          <div className="rounded-[3rem] border border-black/8 bg-card p-10 shadow-card sm:p-16">
            <h2 className="font-serif text-[2.5rem] text-primary tracking-tight leading-none mb-4">Contact</h2>
            <p className="text-[1.05rem] text-muted mb-12">Réponse garantie sous 24 heures ouvrées.</p>
            
            <ContactForm />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
