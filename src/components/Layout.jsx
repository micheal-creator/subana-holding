import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Seo from './Seo.jsx'
import { CmsProvider, useCms } from '../hooks/useCms.jsx'

function CmsContent() {
  const cms = useCms()
  return (
    <>
      <Seo />
      <Header />
      <main key={cms._revision || 'seed'} className="pt-[76px]">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function Layout() {
  return (
    <CmsProvider>
      <CmsContent />
    </CmsProvider>
  )
}
