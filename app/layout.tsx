import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Match Kora | ماتش كورة",
    template: "%s | Match Kora"
  },
  description: "نتائج المباريات وإحصائيات كرة القدم لحظة بلحظة - Résultats de foot en direct et statistiques.",
  keywords: ["كرة قدم", "نتائج مباريات", "Match Kora", "Foot en direct", "Scores live"],
  // ... باقي إعدادات الـ SEO اللي عملناها
  verification: {
    google: "6qsfV6N-QN0FQXjW7Ah7cjA_M-Dt240tCiNaNdNLC4Q" // حط الكود بالكامل هنا
  },
};

export default function RootLayout({
  children,
  params, // هناخد الـ params عشان نعرف اللغة لو إنت شغال بـ Dynamic Routing
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  
  // افتراضياً هنشيك على اللغة، لو مفيش لغة محددة في الـ URL بنخليها عربي
  // ملاحظة: لو إنت بتمرر اللغة كـ Query Parameter (?lang=fr) 
  // فالأفضل التحكم في الـ dir داخل المكونات نفسها، لكن للـ SEO العام:
  const isArabic = params?.lang !== 'fr'; 

  return (
    <html
      lang={isArabic ? "ar" : "fr"} 
      dir={isArabic ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white selection:bg-yellow-500 selection:text-black">
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}