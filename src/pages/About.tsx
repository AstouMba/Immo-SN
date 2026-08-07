import Layout from "@/components/layout/Layout";
import { Heart, Shield, Users, Building2, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.34em] text-muted-foreground">
              <span className="h-px w-10 bg-muted-foreground/40" />
              Notre identité
            </div>
            
            <h1 className="font-serif text-[clamp(2.5rem,6vw,4.8rem)] leading-[1] tracking-[-0.05em] text-primary">
              Une vision claire pour <br />
              <span className="text-accent italic">l'immobilier moderne.</span>
            </h1>
            
            <p className="max-w-xl text-[1.15rem] leading-[1.8] text-muted">
              DIASPORA IMO MATHIAM MBOW redéfinit l'expérience immobilière en privilégiant la transparence, 
              le design minimaliste et l'efficacité opérationnelle.
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4.5 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-white transition hover:bg-[#2a2a2a] group"
              >
                Nous contacter
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a 
                href="#mission" 
                className="inline-flex items-center gap-3 rounded-full border border-black/15 bg-white/70 px-8 py-4.5 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-primary transition hover:bg-white"
              >
                Notre mission
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="relative group overflow-hidden rounded-[3rem] border border-black/8 shadow-premium aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[640px]">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400&q=80&auto=format&fit=crop"
              alt="Espace de travail moderne"
              className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
            <div className="absolute bottom-10 left-10 right-10 rounded-[2rem] border border-white/20 bg-white/10 p-8 backdrop-blur-xl">
              <p className="text-white text-xl font-serif italic leading-relaxed">
                "La clarté est la forme finale de la sophistication."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] border border-black/8 bg-card px-8 py-20 shadow-card sm:px-16">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accent">Nos fondations</p>
            <h2 className="mt-4 font-serif text-[2.8rem] tracking-tight text-primary leading-tight">Pourquoi DIASPORA IMO MATHIAM MBOW ?</h2>
            <p className="mt-6 text-muted leading-relaxed text-[1.05rem]">
              Nous croyons que chaque projet immobilier mérite une attention particulière et une présentation irréprochable.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              { 
                icon: Building2, 
                title: "Clarté Visuelle", 
                text: "Chaque bien est traité comme une pièce éditoriale : des visuels nets et une information hiérarchisée." 
              },
              { 
                icon: Heart, 
                title: "Parcours Fluide", 
                text: "Une interface pensée pour la rapidité, permettant une navigation sans friction sur tous vos appareils." 
              },
              { 
                icon: Shield, 
                title: "Engagement", 
                text: "Un accompagnement sérieux et transparent, basé sur la confiance mutuelle et le respect des engagements." 
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="rounded-[2.5rem] border border-black/5 bg-white/60 p-10 shadow-sm transition-all duration-500 hover:shadow-premium hover:-translate-y-1 group">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-beige-400/30 border border-black/5 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-10 font-serif text-2xl text-primary">{item.title}</h3>
                  <p className="mt-5 text-[1rem] leading-7 text-muted">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[3rem] bg-primary p-12 text-white shadow-premium sm:p-16">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white/40">L'Équipe</p>
            <h2 className="mt-8 font-serif text-[2.5rem] leading-[1.1] tracking-tight">Une structure à taille humaine.</h2>
            <p className="mt-8 text-white/70 text-[1.1rem] leading-[1.8] max-w-md">
              Nous privilégions la qualité à la quantité. Un accompagnement sur-mesure pour chaque client, 
              que vous soyez acquéreur ou locataire.
            </p>
            <div className="mt-12 flex items-center gap-5">
              <div className="h-14 w-14 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/50">Disponibilité</p>
                <p className="text-base font-medium tracking-wide">Conseils experts 7j/7</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-[3rem] border border-black/8 bg-card p-12 shadow-card sm:p-16">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accent">Engagement</p>
            <h2 className="mt-8 font-serif text-[2.5rem] leading-[1.1] tracking-tight">Standard Premium.</h2>
            <ul className="mt-10 space-y-6">
              {[
                "Sélection rigoureuse des biens présentés",
                "Photographies et visuels haute fidélité",
                "Contact et réservation en un clic",
                "Suivi personnalisé de chaque demande"
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-5 text-muted group">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent transition-transform group-hover:scale-125" />
                  <span className="text-[1.05rem] font-medium leading-tight">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
