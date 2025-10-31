import { useState } from 'react'
import { GlassCard } from '@/components/common/GlassCard'
import { cn } from '@/lib/utils'

const templates = [
  {
    name: 'Web App',
    icon: 'https://img.usecurling.com/i?q=web%20app&color=gradient',
  },
  {
    name: 'Mobile',
    icon: 'https://img.usecurling.com/i?q=mobile&color=gradient',
  },
  {
    name: 'Dashboard',
    icon: 'https://img.usecurling.com/i?q=dashboard&color=gradient',
  },
  { name: 'API', icon: 'https://img.usecurling.com/i?q=api&color=gradient' },
  {
    name: 'Landing Page',
    icon: 'https://img.usecurling.com/i?q=landing%20page&color=gradient',
  },
  {
    name: 'Fullstack',
    icon: 'https://img.usecurling.com/i?q=server&color=gradient',
  },
]

export const TemplateSelector = () => {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {templates.map((template) => (
        <GlassCard
          key={template.name}
          className={cn(
            'cursor-pointer p-4 text-center transition-all duration-300',
            selected === template.name && 'border-primary glow-accent-sm',
          )}
          onClick={() => setSelected(template.name)}
        >
          <img
            src={template.icon}
            alt={template.name}
            className="mx-auto h-12 w-12"
          />
          <p className="mt-2 font-semibold text-foreground">{template.name}</p>
        </GlassCard>
      ))}
    </div>
  )
}
