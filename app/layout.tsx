import type {Metadata} from 'next';
import { Inter, Playfair_Display, Noto_Serif_Ethiopic, Noto_Sans_Ethiopic } from 'next/font/google';
import './globals.css'; // Global styles
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const notoSerifEthiopic = Noto_Serif_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-noto-serif-ethiopic',
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-noto-sans-ethiopic',
});

export const metadata: Metadata = {
  title: 'Holistic Specialty Dental Clinic | Best Dentist in Addis Ababa',
  description: 'Trusted by 5,100+ patients. Holistic dental care in Addis Ababa — teeth whitening, implants, braces & more. Book your appointment today!',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${notoSerifEthiopic.variable} ${notoSansEthiopic.variable}`}>
      <head>
        <link rel="stylesheet" href="/language_toggle.css" />
        <script src="/language_toggle.js" defer></script>
      </head>
      <body className="font-sans antialiased bg-brand-bg text-brand-text selection:bg-brand-primary/30 overflow-x-hidden" suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
