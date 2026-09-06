import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { CmsProvider } from '../cms.js'
export default function Layout() { const { pathname } = useLocation(); return <CmsProvider><Header /><main className="pt-[76px]"><Outlet /></main><Footer /></CmsProvider> }
