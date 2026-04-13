'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  PlusCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Scale,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggle: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

interface SidebarProps {
  children: ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => setIsOpen(!isOpen)

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/query/new', icon: PlusCircle, label: 'New Query' },
    { href: '/lawyers', icon: Users, label: 'Lawyers' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <div className="min-h-screen bg-background">
        <aside
          className={cn(
            'fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-primary">Legality</span>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              {session?.user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2">
                    <p className="font-medium text-slate-800 truncate">
                      {(session.user as any)?.name || session.user?.email}
                    </p>
                    <p className="text-sm text-slate-500">
                      {(session.user as any)?.subscription === 'PREMIUM' ? (
                        <span className="text-secondary font-medium">Premium</span>
                      ) : (
                        'Free Plan'
                      )}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </aside>

        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={toggle}
                className="p-2 rounded-lg hover:bg-slate-100 lg:hidden"
              >
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
              <div className="flex-1 lg:hidden" />
              <Link href="/query/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Query</span>
              </Link>
            </div>
          </header>
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

interface MobileNavProps {
  currentPath: string
}

export function MobileNav({ currentPath }: MobileNavProps) {
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/query/new', icon: PlusCircle, label: 'Query' },
    { href: '/lawyers', icon: Users, label: 'Lawyers' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                isActive ? 'text-primary' : 'text-slate-500'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
