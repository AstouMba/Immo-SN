import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, Edit2, Inbox, Loader2, LogOut, Plus, Trash2, Upload, X, Building2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminData } from "@/hooks/useMvpData";
import type { PropertyWritePayload, RequestStatus } from "@/lib/api";
import type { PropertyType, TransactionType } from "@/types/property";

type PropertyFormState = PropertyWritePayload & {
  imagePreviews: string[];
};

const emptyProperty: PropertyFormState = {
  title: "",
  description: "",
  price: 0,
  type: "apartment",
  transactionType: "rent",
  surface: 0,
  rooms: 0,
  bedrooms: 0,
  bathrooms: 0,
  address: "",
  city: "Dakar",
  neighborhood: "",
  postalCode: "",
  images: [],
  imageFiles: [],
  imagePreviews: [],
  features: [],
  available: true,
  featured: false,
};

const MAX_PROPERTY_IMAGES = 3;

const PROPERTY_CHARACTERISTICS: Record<PropertyType, { rooms: boolean; bedrooms: boolean; bathrooms: boolean; note: string }> = {
  apartment: { rooms: true, bedrooms: true, bathrooms: true, note: "Appartement: tous les champs de confort sont actifs." },
  house: { rooms: true, bedrooms: true, bathrooms: true, note: "Maison: vous pouvez détailler les pièces et les sanitaires." },
  villa: { rooms: true, bedrooms: true, bathrooms: true, note: "Villa: fiche complète avec pièces, chambres et salles de bain." },
  office: { rooms: true, bedrooms: false, bathrooms: true, note: "Bureau: les chambres sont désactivées, les autres champs restent utiles." },
  land: { rooms: false, bedrooms: false, bathrooms: false, note: "Terrain: seuls les champs pertinents restent actifs." },
};

const normalizePropertyForm = (form: PropertyFormState, type: PropertyType = form.type): PropertyFormState => {
  const rules = PROPERTY_CHARACTERISTICS[type];
  return {
    ...form,
    type,
    rooms: rules.rooms ? form.rooms : 0,
    bedrooms: rules.bedrooms ? form.bedrooms : 0,
    bathrooms: rules.bathrooms ? form.bathrooms : 0,
  };
};

const readFilesAsDataUrls = async (files: FileList | File[]) => Promise.all(
  Array.from(files).map((file) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Impossible de lire le fichier ${file.name}`));
    reader.readAsDataURL(file);
  })),
);

const statusLabel = (status: string) => ({ pending: "En attente", contacted: "Contacté", confirmed: "Confirmée", completed: "Terminée", cancelled: "Annulée", closed: "Clôturé" }[status] ?? status);
const statusClass = (status: string) => status === "confirmed" || status === "contacted" || status === "completed" ? "bg-green-50 text-green-800 border-green-200" : status === "cancelled" || status === "closed" ? "bg-red-50 text-red-800 border-red-200" : "bg-beige-300 text-primary border-black/10";

const Admin = () => {
  const { isAuthenticated, isAdmin, user, signOut, loading: authLoading } = useAuth();
  const { properties, inquiries, visits, reservations, createProperty, updateProperty, deleteProperty, updateInquiry, updateVisit, updateReservation } = useAdminData();
  const [activeTab, setActiveTab] = useState<"properties" | "inquiries" | "visits" | "reservations">("properties");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PropertyFormState>(emptyProperty);
  const [notice, setNotice] = useState("");

  const allProperties = properties.data?.data ?? [];
  const stats = useMemo(() => ({
    total: allProperties.length,
    available: allProperties.filter((property) => property.available).length,
    visits: visits.data?.filter((item) => item.status === "pending").length ?? 0,
    messages: inquiries.data?.filter((item) => item.status === "pending").length ?? 0,
  }), [allProperties, inquiries.data, visits.data]);

  if (authLoading) return <Layout><div className="flex min-h-96 items-center justify-center text-muted"><Loader2 className="mr-3 h-5 w-5 animate-spin" />Vérification de la session...</div></Layout>;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />;

  const openCreate = () => { setEditingId(null); setForm(normalizePropertyForm(emptyProperty, emptyProperty.type)); setFormOpen(true); setNotice(""); };
  const openEdit = (property: typeof allProperties[number]) => {
    setEditingId(property.id);
    setForm(normalizePropertyForm({ title: property.title, description: property.description, price: property.price, type: property.type, transactionType: property.transactionType, surface: property.surface, rooms: property.rooms, bedrooms: property.bedrooms, bathrooms: property.bathrooms, address: property.location.address, city: property.location.city, neighborhood: property.location.neighborhood, postalCode: property.location.postalCode, images: property.images, imageFiles: [], imagePreviews: [], features: property.features, available: property.available, featured: property.featured }, property.type));
    setFormOpen(true);
    setNotice("");
  };
  const submitProperty = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice("");
    try {
      const totalImages = form.images.length + form.imageFiles.length;
      if (totalImages < 1) {
        setNotice("Ajoutez au moins une photo du bien.");
        return;
      }
      if (totalImages > MAX_PROPERTY_IMAGES) {
        setNotice(`Vous pouvez ajouter au maximum ${MAX_PROPERTY_IMAGES} photos.`);
        return;
      }
      if (editingId) await updateProperty.mutateAsync({ id: editingId, payload: form });
      else await createProperty.mutateAsync(form);
      setFormOpen(false);
      setNotice(editingId ? "Le bien a été mis à jour." : "Le bien a été créé.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Impossible d'enregistrer le bien."); }
  };
  const removeProperty = async (id: string) => {
    if (!window.confirm("Supprimer définitivement ce bien ?")) return;
    try { await deleteProperty.mutateAsync(id); setNotice("Le bien a été supprimé."); } catch (error) { setNotice(error instanceof Error ? error.message : "Impossible de supprimer le bien."); }
  };
  const updateStatus = async (kind: "inquiry" | "visit" | "reservation", id: string, status: string) => {
    try {
      if (kind === "inquiry") await updateInquiry.mutateAsync({ id, status: status as "pending" | "contacted" | "closed" });
      if (kind === "visit") await updateVisit.mutateAsync({ id, status: status as RequestStatus });
      if (kind === "reservation") await updateReservation.mutateAsync({ id, status: status as RequestStatus });
      setNotice("Le statut a été mis à jour.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Impossible de mettre à jour le statut."); }
  };

  const inputClass = "w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 outline-none focus:border-accent";
  const typeRules = PROPERTY_CHARACTERISTICS[form.type];
  const isSaving = createProperty.isPending || updateProperty.isPending;
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    const remainingSlots = MAX_PROPERTY_IMAGES - form.images.length - form.imageFiles.length;
    if (remainingSlots <= 0) {
      setNotice(`Vous avez déjà atteint la limite de ${MAX_PROPERTY_IMAGES} photos.`);
      event.target.value = "";
      return;
    }
    if (files.length > remainingSlots) {
      setNotice(`Vous pouvez ajouter encore ${remainingSlots} photo(s) au maximum.`);
      event.target.value = "";
      return;
    }

    try {
      const images = await readFilesAsDataUrls(files);
      setForm((current) => ({
        ...current,
        imageFiles: [...current.imageFiles, ...Array.from(files)].slice(0, MAX_PROPERTY_IMAGES),
        imagePreviews: [...current.imagePreviews, ...images].slice(0, MAX_PROPERTY_IMAGES),
      }));
      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Impossible de charger les photos.");
    } finally {
      event.target.value = "";
    }
  };

  return <Layout>
    <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 border-b border-black/10 pb-10 md:flex-row md:items-end md:justify-between"><div><p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accent">Espace administration</p><h1 className="mt-4 font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-primary">Bonjour, {user?.fullName || "administrateur"}.</h1><p className="mt-5 max-w-2xl text-[1.05rem] leading-7 text-muted">Pilotez les biens, les messages et les rendez-vous depuis un espace unique.</p></div><button onClick={signOut} className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 bg-white px-5 py-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted transition hover:text-primary md:self-auto"><LogOut className="h-4 w-4" />Déconnexion</button></div>

      {notice && <div role="status" className="mt-6 flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/10 px-5 py-4 text-sm text-primary"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Fermer"><X className="h-4 w-4" /></button></div>}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={Building2} label="Biens au catalogue" value={stats.total} /><StatCard icon={Check} label="Biens disponibles" value={stats.available} /><StatCard icon={CalendarDays} label="Visites à traiter" value={stats.visits} /><StatCard icon={Inbox} label="Messages non lus" value={stats.messages} /></div>

      <div className="mt-12 flex flex-wrap gap-2 rounded-[1.5rem] border border-black/8 bg-card p-2 shadow-sm">{([['properties', 'Biens', Building2], ['inquiries', 'Messages', Inbox], ['visits', 'Visites', CalendarDays], ['reservations', 'Réservations', CalendarDays]] as const).map(([tab, label, Icon]) => <button key={tab} onClick={() => setActiveTab(tab)} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] transition ${activeTab === tab ? "bg-primary text-white" : "text-muted hover:bg-beige-300"}`}><Icon className="h-4 w-4" />{label}</button>)}</div>

      {activeTab === "properties" && <section className="mt-8"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accent">Gestion du catalogue</p><h2 className="mt-3 font-serif text-3xl text-primary">Vos biens</h2></div><button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white"><Plus className="h-4 w-4" />Ajouter un bien</button></div>{properties.isLoading ? <Loading /> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"><button onClick={openCreate} className="flex min-h-[380px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-black/15 bg-card/50 text-muted transition hover:border-accent hover:text-primary"><Plus className="h-10 w-10" /><span className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.24em]">Nouveau bien</span></button>{allProperties.map((property) => <article key={property.id} className="group overflow-hidden rounded-[2rem] border border-black/8 bg-card shadow-card"><div className="relative h-56 overflow-hidden"><img src={property.images[0]} alt={property.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] ${property.available ? "bg-beige-300/90 text-primary" : "bg-red-50 text-red-800"}`}>{property.available ? "Disponible" : "Indisponible"}</span></div><div className="p-5"><div className="flex justify-between gap-3 text-xs text-muted"><span>{property.location.city}</span><span>{property.transactionType === "rent" ? "Location" : "Vente"}</span></div><h3 className="mt-3 font-serif text-2xl text-primary">{property.title}</h3><p className="mt-2 text-lg font-semibold text-accent">{property.price.toLocaleString("fr-FR")} FCFA{property.transactionType === "rent" ? " / mois" : ""}</p><div className="mt-5 flex gap-2"><button onClick={() => openEdit(property)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-black/10 px-3 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted hover:text-primary"><Edit2 className="h-3.5 w-3.5" />Modifier</button><button onClick={() => removeProperty(property.id)} className="inline-flex items-center justify-center rounded-full border border-red-200 px-4 py-3 text-red-700 hover:bg-red-50" aria-label={`Supprimer ${property.title}`}><Trash2 className="h-4 w-4" /></button></div></div></article>)}</div>}</section>}

      {activeTab === "inquiries" && <RequestList title="Messages reçus" empty="Aucun message reçu." items={inquiries.data ?? []} loading={inquiries.isLoading} render={(item) => <><div className="flex items-start justify-between gap-4"><div><h3 className="font-serif text-2xl text-primary">{item.name}</h3><p className="mt-1 text-sm text-muted">{item.email}{item.phone ? ` · ${item.phone}` : ""}</p></div><StatusBadge status={item.status} /></div><p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted">{item.message}</p><div className="mt-5 flex flex-wrap gap-2">{item.status === "pending" && <ActionButton onClick={() => updateStatus("inquiry", item.id, "contacted")}>Marquer comme traité</ActionButton>}{item.status === "contacted" && <ActionButton onClick={() => updateStatus("inquiry", item.id, "closed")}>Clôturer</ActionButton>}</div></>} />}
      {activeTab === "visits" && <RequestList title="Demandes de visite" empty="Aucune demande de visite." items={visits.data ?? []} loading={visits.isLoading} render={(item) => <><div className="flex items-start justify-between gap-4"><div><h3 className="font-serif text-2xl text-primary">{item.name}</h3><p className="mt-1 text-sm text-muted">{item.property?.title ?? "Bien"} · {item.email}</p></div><StatusBadge status={item.status} /></div><div className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2"><p><strong className="text-primary">Date :</strong> {item.preferredDate || "À définir"}</p><p><strong className="text-primary">Heure :</strong> {item.preferredTime || "À définir"}</p></div>{item.notes && <p className="mt-4 text-sm italic text-muted">{item.notes}</p>}<div className="mt-5 flex flex-wrap gap-2">{item.status === "pending" && <ActionButton onClick={() => updateStatus("visit", item.id, "confirmed")}>Confirmer la visite</ActionButton>}{item.status === "confirmed" && <ActionButton onClick={() => updateStatus("visit", item.id, "completed")}>Marquer terminée</ActionButton>}{item.status !== "cancelled" && item.status !== "completed" && <ActionButton tone="light" onClick={() => updateStatus("visit", item.id, "cancelled")}>Refuser</ActionButton>}</div></>} />}
      {activeTab === "reservations" && <RequestList title="Réservations" empty="Aucune réservation." items={reservations.data ?? []} loading={reservations.isLoading} render={(item) => <><div className="flex items-start justify-between gap-4"><div><h3 className="font-serif text-2xl text-primary">{item.name}</h3><p className="mt-1 text-sm text-muted">{item.property?.title ?? "Bien"} · {item.email}</p></div><StatusBadge status={item.status} /></div><p className="mt-5 text-sm text-muted">Du <strong className="text-primary">{item.startDate}</strong> au <strong className="text-primary">{item.endDate}</strong>{item.numberOfGuests ? ` · ${item.numberOfGuests} personne(s)` : ""}</p><div className="mt-5 flex flex-wrap gap-2">{item.status === "pending" && <ActionButton onClick={() => updateStatus("reservation", item.id, "confirmed")}>Confirmer</ActionButton>}{item.status === "confirmed" && <ActionButton onClick={() => updateStatus("reservation", item.id, "completed")}>Marquer terminée</ActionButton>}{item.status !== "cancelled" && item.status !== "completed" && <ActionButton tone="light" onClick={() => updateStatus("reservation", item.id, "cancelled")}>Annuler</ActionButton>}</div></>} />}
    </section>

    {formOpen && <div className="fixed inset-0 z-[70] overflow-y-auto bg-primary/40 p-4 backdrop-blur-sm"><div className="mx-auto my-6 max-w-3xl rounded-[2.5rem] border border-black/10 bg-card p-6 shadow-premium sm:p-10"><div className="flex items-start justify-between gap-4"><div><p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accent">{editingId ? "Modifier" : "Nouveau"}</p><h2 className="mt-3 font-serif text-3xl text-primary">{editingId ? "Modifier le bien" : "Ajouter un bien"}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted">{typeRules.note}</p></div><button onClick={() => setFormOpen(false)} className="rounded-full border border-black/10 p-2 text-muted hover:text-primary" aria-label="Fermer"><X className="h-5 w-5" /></button></div><form onSubmit={submitProperty} className="mt-8 space-y-6"><div className="grid gap-5 sm:grid-cols-2"><Field label="Titre" required><input required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field><Field label="Ville" required><input required className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field></div><Field label="Description" required><textarea required rows={4} className={`${inputClass} resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field><div className="grid gap-5 sm:grid-cols-3"><Field label="Montant FCFA" required><input required min={0} inputMode="numeric" pattern="[0-9]*" type="text" className={inputClass} value={form.price === 0 ? "" : String(form.price)} onChange={(e) => setForm({ ...form, price: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })} placeholder="Ex : 85 000 000" /></Field><Field label="Surface m²" required><input required min={0} type="number" className={inputClass} value={form.surface} onChange={(e) => setForm({ ...form, surface: Number(e.target.value) })} /></Field><Field label="Adresse" required><input required className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Type"><select className={inputClass} value={form.type} onChange={(e) => { const nextType = e.target.value as PropertyType; setForm((current) => normalizePropertyForm({ ...current, type: nextType }, nextType)); }}><option value="apartment">Appartement</option><option value="house">Maison</option><option value="villa">Villa</option><option value="office">Bureau</option><option value="land">Terrain</option></select></Field><Field label="Transaction"><select className={inputClass} value={form.transactionType} onChange={(e) => setForm({ ...form, transactionType: e.target.value as TransactionType })}><option value="rent">Location</option><option value="sale">Vente</option></select></Field></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Quartier"><input className={inputClass} value={form.neighborhood ?? ""} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} placeholder="Mermoz, Almadies..." /></Field><Field label="Code postal"><input className={inputClass} value={form.postalCode ?? ""} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="12000" /></Field></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Latitude"><input className={inputClass} type="number" step="any" value={form.latitude ?? ""} onChange={(e) => setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : undefined })} placeholder="14.72" /></Field><Field label="Longitude"><input className={inputClass} type="number" step="any" value={form.longitude ?? ""} onChange={(e) => setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : undefined })} placeholder="-17.45" /></Field></div><div className="grid gap-5 sm:grid-cols-3"><Field label="Pièces"><input min={0} type="number" className={inputClass} disabled={!typeRules.rooms} value={typeRules.rooms ? form.rooms ?? 0 : ""} onChange={(e) => setForm({ ...form, rooms: Number(e.target.value) })} /><p className="mt-2 text-[0.72rem] text-muted">{typeRules.rooms ? "Champ actif pour ce type." : "Non applicable pour ce type."}</p></Field><Field label="Chambres"><input min={0} type="number" className={inputClass} disabled={!typeRules.bedrooms} value={typeRules.bedrooms ? form.bedrooms ?? 0 : ""} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} /><p className="mt-2 text-[0.72rem] text-muted">{typeRules.bedrooms ? "Champ actif pour ce type." : "Non applicable pour ce type."}</p></Field><Field label="Salles de bain"><input min={0} type="number" className={inputClass} disabled={!typeRules.bathrooms} value={typeRules.bathrooms ? form.bathrooms ?? 0 : ""} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} /><p className="mt-2 text-[0.72rem] text-muted">{typeRules.bathrooms ? "Champ actif pour ce type." : "Non applicable pour ce type."}</p></Field></div><div className="grid gap-5 sm:grid-cols-2"><label className="flex cursor-pointer items-start gap-3 rounded-[1.5rem] border border-black/10 bg-white/60 px-4 py-4"><input type="checkbox" className="mt-1 h-4 w-4 accent-black" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /><span><span className="block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary">Bien disponible</span><span className="mt-1 block text-sm leading-6 text-muted">Décochez si le bien doit rester visible mais indisponible.</span></span></label><label className="flex cursor-pointer items-start gap-3 rounded-[1.5rem] border border-black/10 bg-white/60 px-4 py-4"><input type="checkbox" className="mt-1 h-4 w-4 accent-black" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /><span><span className="block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary">Bien en vedette</span><span className="mt-1 block text-sm leading-6 text-muted">Mettez ce bien en avant sur la page d’accueil.</span></span></label></div><Field label={`Photos du bien (${form.images.length + form.imageFiles.length}/${MAX_PROPERTY_IMAGES})`} required><div className="space-y-4"><label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-black/12 bg-white/50 px-6 py-8 text-center transition hover:border-accent hover:bg-white"><Upload className="h-6 w-6 text-accent" /><span className="mt-4 text-sm font-semibold text-primary">Importer jusqu'à 3 photos</span><span className="mt-1 text-xs text-muted">PNG, JPG, WEBP. Une à trois images sont requises.</span><input accept="image/*" multiple className="hidden" type="file" onChange={handleImageUpload} /></label>{form.images.length > 0 && <div className="grid gap-4 sm:grid-cols-3">{form.images.map((image, index) => <div key={`${image.slice(0, 24)}-${index}`} className="overflow-hidden rounded-[1.25rem] border border-black/10 bg-white"><div className="relative aspect-[4/3]"><img src={image} alt={`Photo ${index + 1} du bien`} className="h-full w-full object-cover" /><button type="button" onClick={() => setForm((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))} className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white" aria-label={`Supprimer la photo ${index + 1}`}><Trash2 className="h-3.5 w-3.5" /></button></div><div className="px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">Photo {index + 1}</div></div>)}</div>}{form.imagePreviews.length > 0 && <div className="grid gap-4 sm:grid-cols-3">{form.imagePreviews.map((image, index) => <div key={`${image.slice(0, 24)}-${index}`} className="overflow-hidden rounded-[1.25rem] border border-black/10 bg-white"><div className="relative aspect-[4/3]"><img src={image} alt={`Nouvelle photo ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => setForm((current) => ({ ...current, imageFiles: current.imageFiles.filter((_, imageIndex) => imageIndex !== index), imagePreviews: current.imagePreviews.filter((_, imageIndex) => imageIndex !== index) }))} className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white" aria-label={`Supprimer la nouvelle photo ${index + 1}`}><Trash2 className="h-3.5 w-3.5" /></button></div><div className="px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">Photo {form.images.length + index + 1}</div></div>)}</div>}<p className="text-[0.75rem] text-muted">Vous pouvez encore ajouter {Math.max(MAX_PROPERTY_IMAGES - (form.images.length + form.imageFiles.length), 0)} photo(s).</p></div></Field><Field label="Équipements (séparés par des virgules)"><input className={inputClass} value={form.features?.join(", ") ?? ""} onChange={(e) => setForm({ ...form, features: e.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} placeholder="Piscine, Jardin, Parking" /></Field><div className="flex flex-wrap justify-end gap-3 border-t border-black/8 pt-6"><button type="button" onClick={() => setFormOpen(false)} className="rounded-full border border-black/10 px-6 py-3 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted">Annuler</button><button disabled={isSaving} type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white disabled:opacity-60">{isSaving && <Loader2 className="h-4 w-4 animate-spin" />}{editingId ? "Enregistrer" : "Créer le bien"}</button></div></form></div></div>}
    </Layout>;
};

const StatCard = ({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: number }) => <div className="rounded-[2rem] border border-black/8 bg-card p-6 shadow-sm"><div className="flex items-center justify-between"><p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</p><Icon className="h-5 w-5 text-accent" /></div><p className="mt-5 font-serif text-4xl text-primary">{value}</p></div>;
const Loading = () => <div className="flex min-h-64 items-center justify-center text-muted"><Loader2 className="mr-3 h-5 w-5 animate-spin" />Chargement...</div>;
const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => <label className="block space-y-2"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">{label}{required ? " *" : ""}</span>{children}</label>;
const StatusBadge = ({ status }: { status: string }) => <span className={`shrink-0 rounded-full border px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] ${statusClass(status)}`}>{statusLabel(status)}</span>;
const ActionButton = ({ children, onClick, tone = "dark" }: { children: React.ReactNode; onClick: () => void; tone?: "dark" | "light" }) => <button onClick={onClick} className={`rounded-full px-4 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] ${tone === "dark" ? "bg-primary text-white" : "border border-red-200 text-red-700 hover:bg-red-50"}`}>{children}</button>;
const RequestList = <T extends { id: string }>({ title, empty, items, loading, render }: { title: string; empty: string; items: T[]; loading: boolean; render: (item: T) => React.ReactNode }) => <section className="mt-8"><div className="mb-8"><p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accent">Boîte de réception</p><h2 className="mt-3 font-serif text-3xl text-primary">{title}</h2></div>{loading ? <Loading /> : items.length === 0 ? <div className="rounded-[2.5rem] border border-dashed border-black/15 bg-card p-20 text-center text-muted"><Inbox className="mx-auto h-10 w-10 text-accent" /><p className="mt-5">{empty}</p></div> : <div className="grid gap-5">{items.map((item) => <article key={item.id} className="rounded-[2rem] border border-black/8 bg-card p-6 shadow-sm sm:p-8">{render(item)}</article>)}</div>}</section>;

export default Admin;
