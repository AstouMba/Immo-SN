import logo from "@/assets/WhatsApp_Image_2026-06-14_at_13.12.32-removebg-preview.png";

const BrandLogo = ({ showText = true, size = "md", className = "" }: { showText?: boolean; size?: "sm" | "md" | "lg"; className?: string }) => {
  const sizeClass = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  return <div className={`flex items-center gap-3 ${className}`}><div className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white/80 shadow-sm`}><img src={logo} alt="DIASPORA IMO MATHIAM MBOW" className="h-full w-full object-contain" /></div>{showText && <div className="min-w-0 leading-tight"><p className="max-w-[200px] text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#4d4a45] sm:max-w-none sm:text-[0.72rem] sm:tracking-[0.25em]">DIASPORA IMO MATHIAM MBOW</p><p className="text-xs text-[#78715a]">Immobilier premium</p></div>}</div>;
};

export default BrandLogo;
