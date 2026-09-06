import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { CmsProvider, useCms } from '../hooks/useCms.jsx'

function CmsContent() {
  const cms = useCms()
  return <><Header /><main key={cms._revision || 'seed'} className="pt-[76px]"><Outlet /></main><Footer /></>
}

export default function Layout() { return <CmsProvider><CmsContent /></CmsProvider> }
