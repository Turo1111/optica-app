'use client'
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({children}) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{margin: 0}} >
        {children}
      </body>
    </html>
  );
}
