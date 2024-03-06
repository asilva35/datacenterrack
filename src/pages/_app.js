import '@/styles/grid.css';
import '@/styles/globals.css';

import { Josefin_Sans } from 'next/font/google';
import { NextUIProvider } from '@nextui-org/react';

const primary_font = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --primary-font: ${primary_font.style.fontFamily};
        }
      `}</style>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </>
  );
}
