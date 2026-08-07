import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-luxury-apartment.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate("/admin");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Connexion impossible");
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="min-h-screen bg-background p-4 sm:p-8"><div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2.75rem] border border-black/8 bg-card shadow-premium lg:grid-cols-2"><div className="relative hidden min-h-[640px] lg:block"><img src={heroImage} alt="Intérieur immobilier lumineux" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-primary/45" /><div className="absolute bottom-12 left-12 right-12 text-white"><BrandLogo showText className="text-white" size="lg" /><p className="mt-8 max-w-md font-serif text-4xl italic leading-tight">L'essentiel de l'immobilier, présenté avec clarté.</p></div></div><div className="flex flex-col justify-center p-8 sm:p-16"><Link to="/" className="mb-16 inline-flex items-center gap-2 self-start text-[0.65rem] font-bold uppercase tracking-[0.24em] text-muted hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" />Retour au site</Link><div className="mx-auto w-full max-w-md"><p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accent">Espace sécurisé</p><h1 className="mt-5 font-serif text-5xl leading-none text-primary">Connexion admin.</h1><p className="mt-6 leading-7 text-muted">Accédez à la gestion des biens et au suivi des demandes.</p><form onSubmit={handleSubmit} className="mt-12 space-y-7"><label className="block"><span className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/70">Email</span><div className="relative mt-3"><Mail className="absolute left-4 top-4 h-4 w-4 text-accent" /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@diaspora-imo-mathiam-mbow.com" className="w-full rounded-2xl border border-black/10 bg-white/70 py-4 pl-11 pr-4 outline-none focus:border-accent" /></div></label><label className="block"><span className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-muted-foreground/70">Mot de passe</span><div className="relative mt-3"><Lock className="absolute left-4 top-4 h-4 w-4 text-accent" /><input required minLength={6} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" className="w-full rounded-2xl border border-black/10 bg-white/70 py-4 pl-11 pr-12 outline-none focus:border-accent" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-2.5 rounded-xl p-2 text-muted hover:text-primary" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>{error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}<button disabled={submitting} className="flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-5 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-white transition hover:bg-[#2a2a2a] disabled:opacity-60">{submitting && <Loader2 className="h-4 w-4 animate-spin" />}Se connecter</button></form></div></div></div></main>;
};

export default Login;
