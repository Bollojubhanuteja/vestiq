import type { Metadata } from 'next';
import './globals.css';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Vestiq | Investment Opportunity Discovery & Research Platform',
    template: '%s | Vestiq',
  },
  description:
    'Discover, compare, and organize research on private business investment opportunities. Transparent preference matching, source-audited metrics, and diligence inquiry tools.',
  keywords: [
    'investment research',
    'opportunity discovery',
    'startup discovery',
    'angel investing research',
    'due diligence tools',
    'deal flow management',
  ],
  authors: [{ name: 'Vestiq Team' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Vestiq | Investment Opportunity Discovery & Research',
    description:
      'Explore businesses and startups, compare opportunities, and organize your investment research in one place.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Vestiq',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
