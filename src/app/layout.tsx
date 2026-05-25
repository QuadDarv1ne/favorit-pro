import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { GlobalErrorBoundary } from "./global-error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://favoritpro.ru"),
  title: "ФаворитПро — Прогнозы на спорт | Аналитика и ставки",
  description: "Профессиональные прогнозы на спортивные события. Экспертная аналитика, рейтинги капперов, статистика и коэффициенты для осознанных ставок. Проходимость 68.5%.",
  keywords: ["прогнозы на спорт", "ставки", "аналитика", "капперы", "букмекер", "футбол", "хоккей", "баскетбол", "теннис", "киберспорт"],
  authors: [{ name: "ФаворитПро" }],
  creator: "ФаворитПро",
  publisher: "ФаворитПро",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "ФаворитПро — Прогнозы на спорт",
    description: "Профессиональная аналитика и прогнозы на спортивные события. Проходимость 68.5%, ROI +17.3%.",
    url: "https://favoritpro.ru",
    siteName: "ФаворитПро",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "ФаворитПро Logo",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ФаворитПро — Прогнозы на спорт",
    description: "Профессиональная аналитика и прогнозы на спортивные события.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ФаворитПро" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0d1117] text-gray-100`}
      >
        <GlobalErrorBoundary>
          <QueryProvider>
            {children}
          </QueryProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
