import './globals.css'
export const metadata = { title: 'सैनिक कैंटीन जायाल', description: 'Jayal ka grocery store' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="hi"><body className="bg-[#FFF8E7]">{children}</body></html>
}
