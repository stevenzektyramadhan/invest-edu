import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvestEdu - Edukasi & Rekomendasi Investasi Multi-Aset",
  description:
    "Platform edukasi investasi Saham, Reksa Dana, Emas, dan Kripto dengan rekomendasi portofolio berbasis profil risiko & kondisi makroekonomi serta pantauan pasar live.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "InvestEdu",
  },
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#090a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} dark min-h-screen bg-background antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground pb-20 md:pb-8">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=[];if('serviceWorker' in navigator){p.push(navigator.serviceWorker.getRegistrations().then(function(rs){if(!rs||!rs.length)return false;return Promise.all(rs.map(function(r){return r.update().catch(function(){}).then(function(){return r.unregister();});})).then(function(){return true;});}));}if('caches' in window){p.push(caches.keys().then(function(ks){if(!ks||!ks.length)return false;return Promise.all(ks.map(function(k){return caches.delete(k);})).then(function(){return true;});}));}if(p.length){Promise.all(p).then(function(res){if(res.some(Boolean)){var c=Number(sessionStorage.getItem('__ie_sw_clean')||'0');if(c<2){sessionStorage.setItem('__ie_sw_clean',String(c+1));window.location.reload();}}else{sessionStorage.removeItem('__ie_sw_clean');}});}}catch(e){}})();`,
          }}
        />
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
          <div className="mx-auto max-w-6xl px-4">
            <p>
              InvestEdu PWA: Aplikasi Edukasi & Simulasi Alokasi Aset. Bukan
              ajakan jual/beli instrumen keuangan. Keputusan investasi sepenuhnya
              tanggung jawab pengguna.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
