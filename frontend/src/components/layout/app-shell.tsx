'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { useI18n } from '@/contexts/i18n-context'
import { farmAPI } from '@/lib/api'
import { getInitials } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/language-switcher'
import {
  Tractor,
  LayoutDashboard,
  Building2,
  Leaf,
  Calendar,
  Bug,
  Wrench,
  Users,
  FileImage,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react'

interface NavItem {
  title: string // translation key
  href: string
  icon: React.ElementType
  roles?: string[]
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: 'navigation.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'navigation.farms',
    href: '/farms',
    icon: Building2,
  },
  {
    title: 'navigation.paddy',
    href: '/paddy',
    icon: Leaf,
    children: [
      { title: 'navigation.seasonPlans', href: '/season-plans', icon: Calendar },
      { title: 'navigation.paddyVarieties', href: '/paddy/varieties', icon: Leaf },
      { title: 'navigation.diseaseDetection', href: '/paddy/disease-detection', icon: Bug },
    ],
  },
  {
    title: 'navigation.machinery',
    href: '/machinery',
    icon: Wrench,
    children: [
      { title: 'navigation.searchMachinery', href: '/machinery/search', icon: Wrench },
      { title: 'navigation.myMachinery', href: '/machinery/my-machinery', icon: Wrench },
      { title: 'navigation.myRequests', href: '/machinery/my-requests', icon: Wrench },
    ],
  },
  {
    title: 'navigation.admin',
    href: '/admin',
    icon: Users,
    roles: ['admin'],
    children: [
      { title: 'navigation.userManagement', href: '/admin/users', icon: Users },
      { title: 'navigation.diseaseReferences', href: '/admin/disease-references', icon: FileImage },
    ],
  },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hasFarms, setHasFarms] = useState(false)
  const [checkingFarms, setCheckingFarms] = useState(true)
  const pathname = usePathname()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const { t } = useI18n()

  // Fetch user's farms on mount
  useEffect(() => {
    if (!isAuthenticated || isLoading) return

    const fetchFarms = async () => {
      try {
        const response = await farmAPI.getFarms()
        const farms = response.data?.data || []
        setHasFarms(farms.length > 0)
      } catch (error) {
        console.error('Error fetching farms:', error)
        setHasFarms(false)
      } finally {
        setCheckingFarms(false)
      }
    }

    fetchFarms()
  }, [isAuthenticated, isLoading])

  const hasRole = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true
    if (!user) return false
    const userRoles = user.roles || [user.role]
    return roles.some((role) => userRoles?.includes(role))
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const userName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : 'User'
  const avatarUrl = user?.profile?.avatar || null
// console.log('Avatar URL in AppShell:', avatarUrl)
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r shadow-sm transition-all duration-300 lg:relative',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Tractor className="h-8 w-8 text-primary" />
            {sidebarOpen && (
              <span className="text-xl font-bold text-primary">FarmMS</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              if (!hasRole(item.roles)) return null

              // Disable Paddy menu if user has no farms
              const isPaddyMenu = item.title === 'navigation.paddy'
              const isPaddyDisabled = isPaddyMenu && !hasFarms && !checkingFarms

              if (item.children) {
                return (
                  <li key={item.href}>
                    <div
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
                        isPaddyDisabled
                          ? 'text-muted-foreground/50 cursor-not-allowed'
                          : 'text-muted-foreground',
                        !sidebarOpen && 'justify-center'
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {sidebarOpen && <span>{t(item.title)}</span>}
                    </div>
                    {sidebarOpen && !isPaddyDisabled && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                isActive(child.href)
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              )}
                            >
                              <child.icon className="h-4 w-4 shrink-0" />
                              <span>{t(child.title)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      !sidebarOpen && 'justify-center'
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && <span>{t(item.title)}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl || undefined} alt={userName} />
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || user?.phone}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('navigation.profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('navigation.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
