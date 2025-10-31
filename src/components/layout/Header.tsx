import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Settings, User, LogOut, LayoutGrid } from 'lucide-react'
import { GlassButton } from '@/components/common/GlassButton'
import { GlassInput } from '@/components/common/GlassInput'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/components/auth/AuthContext'
import { NewProjectDialog } from '@/components/NewProjectDialog'

export const Header = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-screen-xl -translate-x-1/2">
      <div className="flex items-center justify-between rounded-2xl border-glass bg-glass p-3 shadow-lg">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src="https://img.usecurling.com/i?q=cube&color=gradient"
            alt="INOVE.AI dev Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-white">iNOVE.AI dev</span>
        </Link>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <GlassInput placeholder="Buscar projetos..." className="pl-12 h-12" />
        </div>

        <div className="flex items-center gap-3">
          <NewProjectDialog>
            <GlassButton variant="default" className="gap-2">
              <Plus className="h-5 w-5" />
              <span className="hidden md:inline">Novo</span>
            </GlassButton>
          </NewProjectDialog>

          <Link to="/dashboard/settings">
            <GlassButton variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </GlassButton>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full transition-all duration-300 hover:ring-2 hover:ring-primary/50">
                <Avatar>
                  <AvatarImage src="https://img.usecurling.com/ppl/medium?gender=male&seed=1" />
                  <AvatarFallback>ID</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-glass bg-glass text-foreground"
            >
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <LayoutGrid className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate('/dashboard/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="cursor-pointer focus:bg-destructive/30"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
