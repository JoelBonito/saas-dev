import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  FolderKanban,
  FileCode,
  Settings,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Logo } from '@/components/common/Logo'

const navItems = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/dashboard/projects', icon: FolderKanban, label: 'Projetos' },
  { to: '/dashboard/templates', icon: FileCode, label: 'Modelos' },
  { to: '/dashboard/usage', icon: BarChart3, label: 'Uso' },
  { to: '/dashboard/settings', icon: Settings, label: 'Configurações' },
]

export const Sidebar = () => {
  return (
    <aside className="fixed left-4 top-1/2 hidden h-[90vh] w-60 -translate-y-1/2 flex-col justify-between rounded-2xl border-glass bg-glass p-4 shadow-lg lg:flex">
      <div>
        {/* Logo */}
        <div className="mb-6 px-2">
          <Logo size="md" showText={false} />
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all duration-300 hover:bg-white/10 hover:text-foreground',
                  isActive && 'bg-primary/20 text-foreground glow-accent-sm',
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3 rounded-lg p-2">
        <Avatar>
          <AvatarImage src="https://img.usecurling.com/ppl/medium?gender=male&seed=1" />
          <AvatarFallback>ID</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">Usuário</span>
          <span className="text-sm text-muted-foreground">
            usuario@inove.ai
          </span>
        </div>
      </div>
    </aside>
  )
}
