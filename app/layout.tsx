import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import StructuredData from '@/components/StructuredData';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'ShineSmile Dental Care - Expert Smile Transformations',
  description: 'ShineSmile Dental Care offers expert dentistry, including restorative care, oral cancer screenings, and smile transformations. Book your appointment today for a brighter, healthier smile.',
  keywords: ['dental care', 'dentist', 'smile transformation', 'restorative dentistry', 'oral cancer screening', 'ShineSmile', 'dental clinic', 'Bangalore dentist'],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#050505] text-white" suppressHydrationWarning>
        {GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
