import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCms, loadCms } from '../cms.js'

const CmsContext = createContext(null)
const KEY = 'subana:cms:v1'

export function CmsProvider({ children }) {
  const [snapshot, setSnapshot] = useState(() => getCms())

  useEffect(() => {
    const refresh = () => setSnapshot(getCms())
    loadCms().then(setSnapshot).catch(() => {})
    const onStorage = (event) => event.key === KEY && refresh()
    window.addEventListener('subana-cms-updated', refresh)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('subana-cms-updated', refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const value = useMemo(() => snapshot, [snapshot])
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  return useContext(CmsContext) || getCms()
}
