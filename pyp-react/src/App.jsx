import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './router/routes.jsx'
import useStore from './store/index.js'

function App() {
  const theme = useStore((state) => state.ui.theme)

  useEffect(() => {
    const root = document.documentElement
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    const shouldUseDark = theme === 'dark' || (theme === 'system' && systemDark)

    root.classList.toggle('dark', shouldUseDark)
  }, [theme])

  return <RouterProvider router={router} />
}

export default App
