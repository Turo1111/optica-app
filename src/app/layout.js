'use client'
import Alerta from '@/components/Alerta';
import { store } from '@/redux/store';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
  }
`;

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({children}) {

  return (
    <html lang="en" className={inter.className}>
      <body style={{margin: '0!important'}} >
        <Provider store={store} >
          <GlobalStyles />
          <Alerta/>
          {children}
        </Provider>
      </body>
    </html>
  );
}
