import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Compass,
  LogIn,
  Leaf,
  MapPin,
  Ruler,
  Sparkles,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import PropertyCard from "@/components/property/PropertyCard";
import { useMvpProperties } from "@/hooks/useMvpData";
import heroImage from "@/assets/hero-luxury-apartment.jpg";

const services = [
  {
    icon: Building2,
    title: "Vente",
    text: "Des annonces présentées avec clarté pour inspirer confiance dès la première visite.",
  },
  {
    icon: Sparkles,
    title: "Location",
    text: "Un parcours simple, rapide et lisible pour trouver un bien sans effort inutile.",
  },
  {
    icon: Compass,
    title: "Conseil",
    text: "Un accompagnement serein pour vous guider dans vos décisions patrimoniales.",
  },
  {
    icon: Ruler,
    title: "Terrains",
    text: "Des emplacements identifiés proprement avec les informations essentielles.",
  },
];

const stats = [
  { value: "120+", label: "Biens sélectionnés" },
  { value: "18", label: "Quartiers couverts" },
  { value: "95%", label: "Réponses rapides" },
  { value: "7j/7", label: "Disponibilité" },
];

const highlights = [
  "Interface épurée et crédible",
  "Navigation simple et directe",
  "Mise en avant des biens les plus forts",
];

const Home = () => {
  const { data, isLoading, isError } = useMvpProperties();
  const featuredProperties = data?.data.filter((property) => property.featured).slice(0, 3) ?? data?.data.slice(0, 3) ?? [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-12 sm:mb-16 lg:mb-20">
        <div className="grid items-stretch gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:gap-8">
          <div className="flex flex-col justify-center rounded-[2.5rem] border border-black/5 bg-card p-8 shadow-premium sm:p-10 lg:p-16">
            <div className="inline-flex items-center gap-3 self-start text-[0.7rem] font-bold uppercase tracking-[0.34em] text-accent">
              <span className="h-px w-10 bg-accent/40" />
              Pensé avec intention.
            </div>

            <h1 className="mt-10 font-serif text-[clamp(2.8rem,7vw,6.2rem)] leading-[0.95] tracking-[-0.05em] text-primary">
              Un design
              <span className="block italic">épuré pour</span>
              <span className="block">
                l’immobilier
                <span className="block text-accent">clair.</span>
              </span>
            </h1>

            <p className="mt-10 max-w-lg text-[1.15rem] leading-[1.8] text-muted">
              DIASPORA IMO MATHIAM MBOW présente les biens avec une identité calme, plus éditoriale, et une lecture immédiate des informations essentielles.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/location"
                className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-5 text-[0.75rem] font-bold uppercase tracking-[0.24em] text-white transition hover:bg-[#2a2a2a] group shadow-premium"
              >
                Explorer les biens
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full border border-black/15 bg-white/70 px-8 py-5 text-[0.75rem] font-bold uppercase tracking-[0.24em] text-primary transition hover:bg-white"
              >
                Nous contacter
                <ChevronRight className="h-4.5 w-4.5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-beige-300/70 px-8 py-5 text-[0.75rem] font-bold uppercase tracking-[0.24em] text-primary transition hover:bg-beige-300"
              >
                <LogIn className="h-4 w-4" />
                Connexion admin
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-black/5 bg-white/60 p-5 group transition-all duration-300 hover:shadow-sm">
                  <div className="flex items-start gap-3">
                    <Leaf className="mt-0.5 h-4 w-4 text-accent/60" />
                    <p className="text-[0.75rem] font-medium leading-5 text-muted">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-[3rem] border border-black/5 bg-beige-400 shadow-card">
            <img
              src={heroImage}
              alt="Intérieur lumineux et minimaliste"
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-[2s] hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-30" />
            
            <div className="absolute left-8 top-8 rounded-full border border-white/35 bg-white/20 px-5 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-white backdrop-blur-md shadow-sm">
              Sélection Limitée
            </div>
            
            <div className="absolute bottom-8 left-8 right-8 grid gap-6 rounded-[2.25rem] border border-white/20 bg-black/15 p-8 text-white backdrop-blur-xl sm:grid-cols-[1fr_auto] sm:items-end shadow-premium">
              <div className="space-y-3">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/60">En vedette</p>
                <h2 className="max-w-md font-serif text-3xl leading-tight sm:text-4xl italic">
                  Lignes simples, volumes calmes.
                </h2>
              </div>
              <div className="flex items-center gap-3 text-[0.75rem] font-bold uppercase tracking-[0.2em]">
                <MapPin className="h-4 w-4 text-accent" />
                Dakar, Sénégal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="projects" className="py-12 sm:py-24 border-t border-black/10">
        <div className="flex items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.34em] text-accent">Catalogue</p>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3.8rem)] tracking-tight text-primary leading-tight">
              Une sélection plus <span className="italic">lisible.</span>
            </h2>
          </div>
          <Link
            to="/location"
            className="hidden items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-muted-foreground transition hover:text-primary sm:inline-flex pb-2 group"
          >
            Voir tout le catalogue
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="studio" className="py-12 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[3rem] border border-black/8 bg-card shadow-card group aspect-[4/3] lg:aspect-auto">
            <img 
              src={heroImage} 
              alt="Espace intérieur sobre" 
              className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.05]" 
            />
          </div>

          <div className="rounded-[3rem] border border-black/8 bg-card p-10 shadow-premium sm:p-16 flex flex-col justify-center">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accent">Philosophie</p>
            <h2 className="mt-8 font-serif text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.05] tracking-tight text-primary">
              On conçoit avec clarté, <br /> on avance avec soin.
            </h2>
            <p className="mt-8 text-[1.1rem] leading-[1.8] text-muted">
              Chaque bien est traité comme une pièce éditoriale : des visuels nets, une information hiérarchisée et une identité calme pour laisser parler le lieu.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[2.25rem] border border-black/5 bg-white/70 p-8 shadow-sm transition-all duration-500 hover:shadow-premium hover:-translate-y-1">
                  <div className="text-[2.5rem] font-serif text-primary leading-none tracking-tight">{stat.value}</div>
                  <div className="mt-4 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-5">
              <Link
                to="/about"
                className="inline-flex items-center gap-3 rounded-full border border-black/15 bg-white px-8 py-4.5 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-primary transition hover:bg-beige-100"
              >
                Notre studio
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4.5 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-white transition hover:bg-[#2a2a2a] group"
              >
                Parler à l’équipe
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-24">
        <div className="rounded-[3rem] border border-black/8 bg-card px-8 py-20 shadow-card sm:px-16 sm:py-24">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between mb-20">
            <div className="max-w-2xl">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accent">Services</p>
              <h2 className="mt-6 font-serif text-[clamp(2.2rem,5vw,3.8rem)] tracking-tight text-primary leading-[1.05]">
                Une offre nette <br /> et rassurante.
              </h2>
            </div>
            <p className="max-w-md text-[1.05rem] leading-[1.7] text-muted italic border-l-2 border-accent/20 pl-8">
              "L'objectif est d'éliminer le bruit visuel pour ne garder que l'essentiel du projet immobilier."
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="rounded-[2.5rem] border border-black/5 bg-white/60 p-10 shadow-sm transition-all duration-500 hover:shadow-premium hover:-translate-y-1 group">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-beige-400/30 border border-black/5 text-accent transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-10 font-serif text-2xl text-primary">{service.title}</h3>
                  <p className="mt-5 text-[0.95rem] leading-7 text-muted">{service.text}</p>
                  <Link to="/contact" className="mt-10 inline-flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accent hover:text-primary transition group-hover:translate-x-1 duration-300">
                    En savoir plus
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="py-12 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[3rem] bg-primary p-12 text-white shadow-premium sm:p-16">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white/40">Contact</p>
            <h2 className="mt-8 font-serif text-[2.8rem] leading-[1] tracking-tight">
              Parlons de votre <br /> futur chez-vous.
            </h2>
            <p className="mt-10 text-white/70 text-[1.1rem] leading-[1.8] max-w-sm">
              Une prise de contact simple pour aller directement à l'essentiel de votre projet.
            </p>

            <div className="mt-14 space-y-5">
              {[
                { label: "Téléphone", value: "+221 77 091 91 91" },
                { label: "Messagerie", value: "contact@domaine-discover.com" },
                { label: "Disponibilité", value: "Lundi - Samedi, 9h - 19h" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7 hover:bg-white/10 transition-colors group cursor-default">
                  <div className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-white/30 group-hover:text-accent transition-colors">{item.label}</div>
                  <div className="mt-3 text-[1.1rem] font-medium text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[3rem] border border-black/8 bg-card p-12 shadow-card sm:p-20 flex flex-col justify-center">
            <h3 className="font-serif text-[2.8rem] text-primary tracking-tight leading-none mb-12">Restons en contact.</h3>
            
            <div className="space-y-10">
              <div className="grid gap-10 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/60 ml-1">Nom complet</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full border-b border-black/15 bg-transparent px-0 py-5 text-[1.05rem] font-medium outline-none transition placeholder:text-muted/30 focus:border-accent"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/60 ml-1">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+221 ..."
                    className="w-full border-b border-black/15 bg-transparent px-0 py-5 text-[1.05rem] font-medium outline-none transition placeholder:text-muted/30 focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/60 ml-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="w-full resize-none border-b border-black/15 bg-transparent px-0 py-5 text-[1.05rem] font-medium outline-none transition placeholder:text-muted/30 focus:border-accent"
                />
              </div>

              <div className="pt-10">
                <button
                  type="button"
                  className="inline-flex items-center gap-5 rounded-full bg-primary px-12 py-6 text-[0.8rem] font-bold uppercase tracking-[0.3em] text-white transition hover:bg-[#2a2a2a] group shadow-premium"
                >
                  Envoyer
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
