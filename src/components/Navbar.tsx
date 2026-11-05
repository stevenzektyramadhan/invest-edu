"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Compass,
  Database,
  Home,
  LogOut,
  ShieldCheck,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import {
  applyCloudStateToLocal,
  readLocalUserState,
  type AuthUser,
  type UserStateData,
} from "@/lib/user-sync";

const navItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/education", label: "Edukasi", icon: BookOpen },
  { href: "/recommendation", label: "Rekomendasi", icon: Compass },
  { href: "/market", label: "Pasar Live", icon: BarChart3 },
];

type AuthMode = "login" | "register";
type StorageMode = "turso-cloud" | "turso-local";

interface AuthResponse {
  user?: AuthUser;
  state?: UserStateData | null;
  storageMode?: StorageMode;
  error?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [storageMode, setStorageMode] = useState<StorageMode>("turso-local");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth")
      .then(async (response) => (response.ok ? (await response.json()) as AuthResponse : null))
      .then((data) => {
        if (cancelled || !data?.user) return;
        setUser(data.user);
        setStorageMode(data.storageMode ?? (data.state ? "turso-cloud" : "turso-local"));
        if (data.state) applyCloudStateToLocal(data.state);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          email,
          password,
          name: mode === "register" ? name : undefined,
          initialState: readLocalUserState(),
        }),
      });
      const data = (await response.json()) as AuthResponse;
      if (!response.ok || !data.user) {
        setError(data.error ?? "Autentikasi gagal. Silakan coba lagi.");
        return;
      }
      setUser(data.user);
      setStorageMode(data.storageMode ?? "turso-cloud");
      if (data.state) applyCloudStateToLocal(data.state);
      setIsAuthOpen(false);
      setPassword("");
    } catch {
      setError("Tidak dapat terhubung ke layanan akun.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => undefined);
    setUser(null);
    setStorageMode("turso-local");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950 font-bold shadow-sm transition-transform duration-200 motion-reduce:transform-none">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-neutral-100">InvestEdu</span>
                  <span className="hidden items-center gap-1.5 rounded border border-neutral-800 bg-neutral-900/80 px-2 py-0.5 text-[10px] font-medium text-neutral-300 sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                    Pasar Live
                  </span>
                </div>
                <span className="hidden text-[11px] text-neutral-400 sm:block -mt-0.5">Terminal Alokasi Multi-Aset</span>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "border border-neutral-700 bg-neutral-800/80 text-neutral-100 shadow-sm"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/recommendation"
              className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-white transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Simulasi Portofolio</span>
            </Link>

            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/90 px-2.5 py-1.5 text-xs text-neutral-200">
                  <span className="font-medium">{user.name}</span>
                  <span className="inline-flex items-center gap-1 rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    {storageMode === "turso-cloud" ? "Cloud" : "Lokal"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:border-neutral-700 hover:text-white transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  Keluar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setIsAuthOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <User className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                <span className="hidden sm:inline">Sinkronisasi Cloud</span>
                <span className="sm:hidden">Akun</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-800 bg-background/95 backdrop-blur-md md:hidden"><div className="grid h-16 grid-cols-4">{navItems.map((item) => { const Icon = item.icon; const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${isActive ? "text-neutral-100" : "text-neutral-400 hover:text-neutral-200"}`}><div className={`flex h-7 w-12 items-center justify-center rounded-full ${isActive ? "bg-neutral-800" : ""}`}><Icon className="h-4 w-4" /></div><span className="text-[11px]">{item.label}</span></Link>; })}</div></nav>

      {isAuthOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAuthOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="w-full max-w-md rounded-2xl border border-neutral-800 bg-panel p-5 shadow-2xl sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-neutral-300"><Database className="h-4 w-4" /><span className="text-xs font-medium">InvestEdu Cloud</span></div><h2 id="auth-title" className="mt-1 text-xl font-bold text-white">{mode === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}</h2></div><button type="button" onClick={() => setIsAuthOpen(false)} aria-label="Tutup modal" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-5 w-5" /></button></div>
          <div className="mt-4 grid grid-cols-2 rounded-lg bg-neutral-900 p-1"><button type="button" onClick={() => { setMode("login"); setError(""); }} className={`rounded-md px-3 py-2 text-xs font-semibold ${mode === "login" ? "bg-neutral-100 text-neutral-950" : "text-neutral-400"}`}>Masuk</button><button type="button" onClick={() => { setMode("register"); setError(""); }} className={`rounded-md px-3 py-2 text-xs font-semibold ${mode === "register" ? "bg-neutral-100 text-neutral-950" : "text-neutral-400"}`}>Daftar Akun</button></div>
          <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs leading-relaxed text-emerald-200">Data progres modul, profil risiko, dan alarm harga Anda disinkronkan otomatis ke database Turso (multi-device &amp; multi-user).</div>
          <form onSubmit={submitAuth} className="mt-5 space-y-3">{mode === "register" && <label className="block text-xs font-medium text-slate-300">Nama Lengkap<input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500" /></label>}<label className="block text-xs font-medium text-slate-300">Email<input required maxLength={254} type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500" /></label><label className="block text-xs font-medium text-slate-300">Password<input required minLength={6} maxLength={128} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500" /><span className="mt-1 block text-[11px] text-slate-500">Minimal 6 karakter</span></label>{error && <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}<button disabled={isSubmitting} type="submit" className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sky-400 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar dan Sinkronkan"}</button></form>
        </section>
      </div>}
    </>
  );
}
