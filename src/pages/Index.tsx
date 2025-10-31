import { Github, Mail, KeyRound } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { GlassInput } from '@/components/common/GlassInput'
import { GlassButton } from '@/components/common/GlassButton'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/auth/AuthContext'
import { useNavigate } from 'react-router-dom'

const Index = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login()
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="animate-fade-in-down text-center">
        <div className="animate-float mx-auto mb-4 flex h-24 w-24 items-center justify-center">
          <img
            src="https://img.usecurling.com/i?q=3d%20tech%20cubes&color=gradient"
            alt="INOVE.AI dev Logo"
            className="h-full w-full"
          />
        </div>
        <h1 className="text-5xl font-bold text-white">iNOVE.AI dev</h1>
        <p className="mt-2 text-lg text-tertiary-foreground">
          Powered by Claude API ⚡
        </p>
      </div>

      <GlassCard className="animate-fade-in-up mt-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-primary-foreground">
          Bem-vindo(a) ao INOVE.AI dev
        </h2>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <GlassInput type="email" placeholder="Email" className="pl-12" />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <GlassInput type="password" placeholder="Senha" className="pl-12" />
          </div>
          <GlassButton type="submit" className="w-full" variant="default">
            Entrar
          </GlassButton>
          <GlassButton className="w-full" variant="secondary">
            Cadastrar
          </GlassButton>
        </form>
        <div className="my-6 flex items-center gap-4">
          <Separator className="flex-1 bg-white/10" />
          <span className="text-sm text-muted-foreground">Ou continue com</span>
          <Separator className="flex-1 bg-white/10" />
        </div>
        <div className="flex justify-center gap-4">
          <GlassButton size="icon" variant="secondary">
            <Github className="h-5 w-5" />
          </GlassButton>
          <GlassButton size="icon" variant="secondary">
            <img
              src="https://img.usecurling.com/i?q=google&color=white"
              alt="Google"
              className="h-5 w-5"
            />
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  )
}

export default Index
