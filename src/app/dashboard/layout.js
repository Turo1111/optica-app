'use client'
import Alerta from '@/components/Alerta';
import Dashboard from '@/components/Dashboard';
import { store } from '@/redux/store';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({children}) {

  return (
    <html lang="en" className={inter.className}>
      <body style={{margin: 0}} >
        <Provider store={store} >
          <Alerta/>
          <Dashboard>
            {children}
          </Dashboard>
        </Provider>
      </body>
    </html>
  );
}
