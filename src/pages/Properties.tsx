import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import PropertyCard from "@/components/property/PropertyCard";
import { cities, propertyTypes } from "@/data/properties";
import { useMvpProperties } from "@/hooks/useMvpData";
import type { SearchFilters } from "@/types/property";
import { ChevronLeft, ChevronRight, Filter, Loader2, X } from "lucide-react";

const PropertiesPage = ({ defaultTransactionType }: { defaultTransactionType?: "rent" | "sale" }) => {
  const [filters, setFilters] = useState<SearchFilters>({ transactionType: defaultTransactionType });
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    setPage(1);
  }, [filters.city, filters.propertyType, filters.transactionType, filters.minPrice, filters.maxPrice, filters.minSurface, filters.rooms]);

  const { data, isLoading, isError } = useMvpProperties({
    transactionType: filters.transactionType,
    propertyType: filters.propertyType,
    city: filters.city,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minSurface: filters.minSurface,
    rooms: filters.rooms,
    page,
    limit,
  });

  const properties = data?.data ?? [];
  const meta = (data?.meta ?? {}) as { page?: number; limit?: number; total?: number; totalPages?: number };
  const totalPages = meta.totalPages ?? 1;
  const total = meta.total ?? properties.length;

  const resetFilters = () => setFilters({ transactionType: defaultTransactionType });
  const updateFilters = (next: Partial<SearchFilters>) => setFilters((current) => ({ ...current, ...next }));

  return (
    <Layout>
      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Notre catalogue</p>
          <h1 className="mt-4 font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.04em] text-primary">Découvrez des lieux <br />d'exception.</h1>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-muted">Une sélection rigoureuse de biens immobiliers présentés avec clarté pour une lecture immédiate de l'essentiel.</p>
        </div>

        <div className="mt-12 rounded-[2.25rem] border border-black/8 bg-card p-6 shadow-premium lg:p-10">
          <div className="mb-8 flex items-center gap-3"><Filter className="h-4 w-4 text-accent" /><h2 className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary">Filtres de recherche</h2></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <label className="space-y-3"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Type de contrat</span><select className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3.5 text-[0.85rem] outline-none focus:border-accent" value={filters.transactionType ?? ""} onChange={(e) => updateFilters({ transactionType: (e.target.value || undefined) as SearchFilters["transactionType"] })}><option value="">Vente & Location</option><option value="sale">Vente</option><option value="rent">Location</option></select></label>
            <label className="space-y-3"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Type de bien</span><select className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3.5 text-[0.85rem] outline-none focus:border-accent" value={filters.propertyType ?? ""} onChange={(e) => updateFilters({ propertyType: (e.target.value || undefined) as SearchFilters["propertyType"] })}><option value="">Tous les types</option>{propertyTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="space-y-3"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Localisation</span><select className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3.5 text-[0.85rem] outline-none focus:border-accent" value={filters.city ?? ""} onChange={(e) => updateFilters({ city: e.target.value || undefined })}><option value="">Toutes les villes</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select></label>
            <label className="space-y-3"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Prix minimum</span><input className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3.5 text-[0.85rem] outline-none focus:border-accent" type="number" placeholder="Ex : 50 000" value={filters.minPrice ?? ""} onChange={(e) => updateFilters({ minPrice: e.target.value ? Number(e.target.value) : undefined })} /></label>
            <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-white transition hover:bg-[#2a2a2a]" onClick={() => { resetFilters(); setPage(1); }} type="button"><X className="h-3.5 w-3.5" />Réinitialiser</button>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-[0.75rem] font-bold uppercase tracking-[0.24em] text-muted">{total} bien(s) trouvé(s)</div>
          {totalPages > 1 && <div className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-muted">Page {page} sur {totalPages}</div>}
        </div>
        {isLoading ? <div className="flex min-h-72 items-center justify-center text-muted"><Loader2 className="mr-3 h-5 w-5 animate-spin" />Chargement des biens...</div> : isError ? <div className="mt-12 rounded-[2.5rem] border border-dashed border-danger/30 bg-card p-20 text-center text-muted">Impossible de charger le catalogue. Vérifiez que le backend est démarré.</div> : properties.length ? <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">{properties.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="mt-12 rounded-[2.5rem] border border-dashed border-black/15 bg-card p-20 text-center"><h3 className="font-serif text-3xl text-primary">Aucun bien ne correspond</h3><button className="mt-8 rounded-full border border-black/15 bg-white px-8 py-4 text-[0.7rem] font-bold uppercase tracking-[0.24em]" onClick={() => { resetFilters(); setPage(1); }}>Voir tout le catalogue</button></div>}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-between gap-4 rounded-[2rem] border border-black/8 bg-card px-5 py-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted transition disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </button>
            <div className="text-[0.75rem] font-bold uppercase tracking-[0.24em] text-primary">
              {page} / {totalPages}
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted transition disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default PropertiesPage;
