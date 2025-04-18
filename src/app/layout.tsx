import './globals.css'
import FloatingHeader from '../components/FloatingHeader'
import ScrollToTop from '../components/ScrollToTop' // ✅ 추가

export const metadata = {
  title: 'Three Step Global',
  description: '회사소개 사이트',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ scrollBehavior: "auto" }}>
        <ScrollToTop /> {/* ✅ 여기에 삽입 */}
        <FloatingHeader />
        {children}
      </body>
    </html>
  )
}
