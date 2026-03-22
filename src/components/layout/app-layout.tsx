import { AppSidebar } from './app-sidebar'
import { MobileNav } from './mobile-nav'

interface AppLayoutProps {
  children: React.ReactNode
  isAdmin?: boolean
}

export function AppLayout({ children, isAdmin }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <MobileNav isAdmin={isAdmin} />
      <div className="flex">
        <AppSidebar isAdmin={isAdmin} className="hidden lg:flex" />
        <main className="flex-1 min-h-screen">
          <div className="max-w-5xl mx-auto px-5 py-8 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
