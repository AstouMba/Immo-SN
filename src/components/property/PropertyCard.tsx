import { Link } from "react-router-dom";
import { BedDouble, MapPin, Ruler, ArrowRight } from "lucide-react";
import type { Property } from "@/types/property";
import { formatPrice } from "@/lib/format";

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-black/8 bg-card shadow-card transition duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 rounded-full bg-beige-300/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-primary backdrop-blur-sm">
          {property.transactionType === "sale" ? "Vente" : "Location"}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 text-xs font-medium text-muted">
          <span>{property.location.city}</span>
          <span className="uppercase tracking-[0.2em] text-muted-foreground/40">Exclusivité</span>
        </div>
        
        <h3 className="mt-4 font-serif text-2xl font-medium tracking-[-0.03em] text-primary group-hover:text-accent transition-colors">
          {property.title}
        </h3>
        
        <p className="mt-2 text-xl font-medium text-accent">
          {formatPrice(property.price, property.transactionType)}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-3 py-1.5 text-[0.7rem] font-medium text-muted">
            <BedDouble className="h-3.5 w-3.5 text-accent/70" />
            <span>{property.bedrooms ?? "-"} ch.</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-3 py-1.5 text-[0.7rem] font-medium text-muted">
            <Ruler className="h-3.5 w-3.5 text-accent/70" />
            <span>{property.surface} m²</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-3 py-1.5 text-[0.7rem] font-medium text-muted">
            <MapPin className="h-3.5 w-3.5 text-accent/70" />
            <span>{property.location.neighborhood || property.location.city}</span>
          </div>
        </div>

        <Link
          to={`/property/${property.id}`}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-medium text-white transition hover:bg-[#2a2a2a]"
        >
          Voir le détail
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
};

export default PropertyCard;
