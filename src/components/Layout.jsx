import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
export default function Layout() { const { pathname } = useLocation(); return <><Header /><main className="pt-[76px]"><Outlet /></main><Footer /></> }
