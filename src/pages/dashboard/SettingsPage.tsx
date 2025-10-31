import { GlassCard } from '@/components/common/GlassCard'
import { GlassInput } from '@/components/common/GlassInput'
import { GlassButton } from '@/components/common/GlassButton'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SettingsPage = () => {
  return (
    <div className="animate-fade-in-up space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Configurações</h1>

      <GlassCard>
        <h2 className="text-xl font-bold">Perfil</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <GlassInput id="name" defaultValue="Usuário INOVE" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <GlassInput
              id="email"
              type="email"
              defaultValue="usuario@inove.ai"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-xl font-bold">Integrações</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="github">Token GitHub</Label>
            <GlassInput id="github" type="password" />
          </div>
          <div>
            <Label htmlFor="supabase">Token Supabase</Label>
            <GlassInput id="supabase" type="password" />
          </div>
          <div>
            <Label htmlFor="anthropic">Chave API Anthropic</Label>
            <GlassInput id="anthropic" type="password" />
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-xl font-bold">Preferências</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label>Modelo de IA Preferido</Label>
            <Select defaultValue="claude-3-opus">
              <SelectTrigger className="border-glass bg-glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-glass bg-glass text-foreground">
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Notificações</Label>
            <Switch defaultChecked />
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <GlassButton variant="default">Salvar Alterações</GlassButton>
      </div>
    </div>
  )
}

export default SettingsPage
