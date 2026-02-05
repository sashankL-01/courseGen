import { Link, NavLink, Outlet } from 'react-router-dom'
import {
    BookOpen,
    ChevronLeft,
    LayoutDashboard,
    LifeBuoy,
    LogOut,
    Settings,
    SunMoon,
    User,
} from 'lucide-react'
import useStore from '../store/index.js'
import { Toaster } from '../components/ui/sonner.jsx'
import Footer from '../components/Footer.jsx'
import logo from '../assets/logo.png'

const primaryNavItems = [
    { label: 'Dashboard', to: '/app', icon: LayoutDashboard },
    { label: 'Courses', to: '/app/courses', icon: BookOpen },
    { label: 'Profile', to: '/app/profile', icon: User },
    { label: 'Settings', to: '/app/settings', icon: Settings },
]

const secondaryNavItems = [
    { label: 'Help', to: '/app/help', icon: LifeBuoy },
]

function SidebarItem({ to, label, icon: Icon, collapsed, onClick }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
                `
                group relative flex h-10 items-center rounded-md text-sm transition
                ${collapsed ? 'mx-auto w-10 justify-center' : 'w-full px-3'}
                ${isActive
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }
                `
            }
        >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-3 truncate">{label}</span>}

            {collapsed && (
                <span className="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background shadow group-hover:block">
                    {label}
                </span>
            )}
        </NavLink>
    )
}

export default function AppLayout() {
    const sidebarOpen = useStore((s) => s.ui.sidebarOpen)
    const sidebarCollapsed = useStore((s) => s.ui.sidebarCollapsed)
    const setSidebarOpen = useStore((s) => s.setSidebarOpen)
    const toggleSidebarCollapsed = useStore((s) => s.toggleSidebarCollapsed)
    const theme = useStore((s) => s.ui.theme)
    const setTheme = useStore((s) => s.setTheme)
    const logout = useStore((s) => s.logout)

    const isDesktop = typeof window !== 'undefined'
        && window.matchMedia('(min-width: 768px)').matches

    const handleSidebarToggle = () => {
        if (isDesktop) toggleSidebarCollapsed()
        else setSidebarOpen(!sidebarOpen)
    }

    const handleNavClick = () => {
        if (!isDesktop) setSidebarOpen(false)
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Overlay (mobile) */}
            {sidebarOpen && !isDesktop && (
                <div
                    className="fixed inset-0 z-40 bg-black/40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                id="app-sidebar"
                className={`
                    fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border bg-background
                    transition-all duration-200
                    ${sidebarCollapsed ? 'w-16' : 'w-64'}
                    ${sidebarOpen || isDesktop ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Brand */}
                <div className="flex h-16 items-center gap-3 border-b border-border px-4">
                    {sidebarCollapsed &&
                        <button
                            className="rounded-md p-2 hover:bg-accent"
                            onClick={handleSidebarToggle}
                            aria-label="Toggle sidebar"
                        >
                            ≡
                        </button>
                    }
                    {!sidebarCollapsed && (
                        <img src={logo} alt="CourseGen Logo" className="h-8" />


                    )}

                    {isDesktop && !sidebarCollapsed && (
                        <button
                            className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-accent"
                            onClick={toggleSidebarCollapsed}
                            aria-label="Collapse sidebar"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
                    {primaryNavItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            collapsed={sidebarCollapsed}
                            onClick={handleNavClick}
                        />
                    ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-border px-2 py-3 space-y-1">
                    {secondaryNavItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            collapsed={sidebarCollapsed}
                            onClick={handleNavClick}
                        />
                    ))}

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`
                            flex h-10 items-center rounded-md text-sm transition
                            ${sidebarCollapsed ? 'mx-auto w-10 justify-center' : 'w-full px-3'}
                            text-muted-foreground hover:bg-accent hover:text-accent-foreground
                        `}
                    >
                        <SunMoon className="h-4 w-4" />
                        {!sidebarCollapsed && <span className="ml-3">Theme</span>}
                    </button>

                    {/* Logout */}
                    <button
                        onClick={() => logout?.()}
                        className={`
                            flex h-10 items-center rounded-md text-sm transition
                            ${sidebarCollapsed ? 'mx-auto w-10 justify-center' : 'w-full px-3'}
                            text-muted-foreground hover:bg-accent hover:text-accent-foreground
                        `}
                    >
                        <LogOut className="h-4 w-4" />
                        {!sidebarCollapsed && <span className="ml-3">Log out</span>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div
                className={`
                    transition-[padding-left] duration-200
                    ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}
                `}
            >
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background px-4">
                    <span className="truncate text-sm font-semibold">
                        CourseGen
                    </span>
                </header>

                {/* Content */}
                <main className="mx-auto max-w-7xl px-6 py-8">
                    <Outlet />
                </main>

                {/* Footer */}
                <Footer />
            </div>

            <Toaster richColors />
        </div>
    )
}
