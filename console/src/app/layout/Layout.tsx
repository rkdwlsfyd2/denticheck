import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Building, Package, Shield } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const sidebarItems = [
    { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
    { name: '회원 관리', href: '/users', icon: Users },
    { name: '제휴 치과 관리', href: '/dentists', icon: Building },
    { name: '제휴 상품 관리', href: '/products', icon: Package },
    { name: '제휴 보험 상품 관리', href: '/insurances', icon: Shield },
]

export function Layout() {
    const location = useLocation()

    return (
        <div className="flex h-screen w-full bg-slate-50">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-white sm:flex">
                <div className="p-6 font-bold text-xl text-slate-800">관리자 시스템</div>
                <nav className="flex-1 px-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            <main className="flex flex-1 flex-col overflow-y-auto">
                <header className="flex h-16 items-center gap-4 bg-white px-8 border-b border-slate-100/50">
                    <h1 className="font-bold text-xl text-slate-800">
                        {sidebarItems.find(item => location.pathname.startsWith(item.href))?.name || '대시보드'}
                    </h1>
                </header>
                <div className="flex-1 p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

