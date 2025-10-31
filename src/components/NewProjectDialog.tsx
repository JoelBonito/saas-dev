import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { GlassButton } from '@/components/common/GlassButton'
import { GlassInput } from '@/components/common/GlassInput'
import { Textarea } from '@/components/ui/textarea'
import { TemplateSelector } from './TemplateSelector'
import { Badge } from './ui/badge'
import { X } from 'lucide-react'
import { useState } from 'react'

export const NewProjectDialog = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [techStack, setTechStack] = useState([
    'React',
    'TypeScript',
    'Tailwind',
  ])
  const [techInput, setTechInput] = useState('')

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim() !== '') {
      e.preventDefault()
      if (!techStack.includes(techInput.trim())) {
        setTechStack([...techStack, techInput.trim()])
      }
      setTechInput('')
    }
  }

  const removeTech = (techToRemove: string) => {
    setTechStack(techStack.filter((tech) => tech !== techToRemove))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl border-glass bg-glass text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Criar Novo Projeto
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
          <div className="space-y-4">
            <GlassInput placeholder="Nome do Projeto" />
            <Textarea
              placeholder="Breve descrição do projeto"
              className="h-32 border-glass bg-glass"
            />
            <div>
              <GlassInput
                placeholder="Adicionar tecnologia e pressionar Enter"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge
                    key={tech}
                    className="bg-primary/20 text-primary-foreground"
                  >
                    {tech}
                    <button
                      onClick={() => removeTech(tech)}
                      className="ml-2 rounded-full hover:bg-white/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Selecione um Modelo</h4>
            <TemplateSelector />
          </div>
        </div>
        <DialogFooter>
          <GlassButton variant="secondary">Cancelar</GlassButton>
          <GlassButton variant="default">Criar Projeto</GlassButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
