import './globals.css';
import FloatingHeader from '../components/FloatingHeader';
import ScrollToTop from '../components/ScrollToTop';
import { dir } from 'i18next';
import { languages } from '@/i18n/settings';

export const metadata = {
  title: 'Three Step Global',
  description: '회사소개 사이트',
};

// Static Params 생성 (라우팅 쓸 경우만 사용, 안 써도 됨)
export async function generateStaticParams() {
  return languages.map((lng) => ({ locale: lng }));
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultLocale = 'ko'; // 기본 언어

  return (
    <html lang={defaultLocale} dir={dir(defaultLocale)}>
      <body style={{ scrollBehavior: 'auto' }}>
        <ScrollToTop />
        <FloatingHeader />
        {children}
      </body>
    </html>
  );
}
