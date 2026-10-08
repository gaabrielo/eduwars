import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';
import { Rubik } from 'next/font/google';

import '../components/ui/shared/sortable-list/components/SortableItem/SortableItem.css';

const rubik = Rubik({ subsets: ['latin'] });

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextPageWithLayout }) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <RecoilRoot>
      <style jsx global>{`
        html {
          font-family: ${rubik.style.fontFamily};
        }
      `}</style>
      {getLayout(<Component {...pageProps} />)}
    </RecoilRoot>
  );
}
