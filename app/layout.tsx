import type { Metadata } from "next";
import Script from "next/script";
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
    template: "%s | Match Kora",
  },
  description:
    "نتائج المباريات وإحصائيات كرة القدم لحظة بلحظة - Résultats de foot en direct et statistiques.",
  keywords: [
    "كرة قدم",
    "نتائج مباريات",
    "Match Kora",
    "Foot en direct",
    "Scores live",
  ],
  verification: {
    google: "e5Rp6fB7IvZbsY5Q9_OAIa-J0U09LV9o_iMMGvzOMQk",
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: any;
}) {
  const isArabic = params?.lang !== "fr";

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

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZBD5XNJ0ED"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZBD5XNJ0ED');
          `}
        </Script>

      </body>
    </html>
  );
}
