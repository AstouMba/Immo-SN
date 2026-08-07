import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { inquiriesApi } from "@/lib/api";

const ContactForm = () => {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await inquiriesApi.create({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone || undefined,
        message: `${form.subject ? `Objet : ${form.subject}\n\n` : ""}${form.message}`,
      });
      setSent(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d'envoyer le message.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) return <div className="flex flex-col items-center justify-center py-20 text-center"><div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent"><Check className="h-8 w-8" /></div><h3 className="font-serif text-3xl text-primary">Message reçu</h3><p className="mx-auto mt-4 max-w-xs text-[1.05rem] leading-relaxed text-muted">Merci de nous avoir contactés. Notre équipe reviendra vers vous sous 24 heures.</p><button onClick={() => { setSent(false); setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" }); }} className="mt-10 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-accent">Envoyer un autre message</button></div>;

  return <form className="space-y-8" onSubmit={handleSubmit}>
    <div className="grid gap-6 md:grid-cols-2">
      <label className="space-y-2"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Prénom</span><input required className="w-full rounded-2xl border border-black/10 bg-white/70 px-5 py-4 outline-none focus:border-accent" placeholder="Jean" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></label>
      <label className="space-y-2"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Nom</span><input required className="w-full rounded-2xl border border-black/10 bg-white/70 px-5 py-4 outline-none focus:border-accent" placeholder="Dupont" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></label>
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <label className="space-y-2"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Email</span><input required type="email" className="w-full rounded-2xl border border-black/10 bg-white/70 px-5 py-4 outline-none focus:border-accent" placeholder="jean@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label className="space-y-2"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Téléphone</span><input className="w-full rounded-2xl border border-black/10 bg-white/70 px-5 py-4 outline-none focus:border-accent" placeholder="+221 ..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
    </div>
    <label className="block space-y-2"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Objet de votre demande</span><select className="w-full rounded-2xl border border-black/10 bg-white/70 px-5 py-4 outline-none focus:border-accent" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}><option value="">Sélectionnez un sujet</option><option value="Demande de visite">Demande de visite</option><option value="Estimation">Estimation</option><option value="Conseil en investissement">Conseil en investissement</option><option value="Autre demande">Autre demande</option></select></label>
    <label className="block space-y-2"><span className="ml-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Message</span><textarea required rows={5} className="w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-5 py-4 outline-none focus:border-accent" placeholder="Comment pouvons-nous vous aider ?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
    {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    <button disabled={submitting} className="flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-5 text-[0.75rem] font-bold uppercase tracking-[0.3em] text-white transition hover:bg-[#2a2a2a] disabled:opacity-60">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}Envoyer le message</button>
    <p className="text-center text-[0.7rem] italic text-muted">Vos données sont traitées avec le plus grand soin.</p>
  </form>;
};

export default ContactForm;
