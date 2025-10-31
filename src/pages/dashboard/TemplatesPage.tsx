import { GlassCard } from '@/components/common/GlassCard'

const templates = [
  {
    name: 'Web App',
    description: 'Ideal para aplicações web ricas e interativas.',
    icon: 'https://img.usecurling.com/i?q=web%20app&color=gradient',
  },
  {
    name: 'Mobile',
    description: 'Crie aplicações nativas para iOS e Android.',
    icon: 'https://img.usecurling.com/i?q=mobile&color=gradient',
  },
  {
    name: 'Dashboard',
    description: 'Perfeito para painéis de administração e análise de dados.',
    icon: 'https://img.usecurling.com/i?q=dashboard&color=gradient',
  },
  {
    name: 'API',
    description: 'Desenvolva APIs RESTful robustas e escaláveis.',
    icon: 'https://img.usecurling.com/i?q=api&color=gradient',
  },
  {
    name: 'Landing Page',
    description: 'Páginas de marketing otimizadas para conversão.',
    icon: 'https://img.usecurling.com/i?q=landing%20page&color=gradient',
  },
  {
    name: 'Fullstack',
    description: 'Solução completa com frontend e backend integrados.',
    icon: 'https://img.usecurling.com/i?q=server&color=gradient',
  },
]

const TemplatesPage = () => {
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold text-foreground">Modelos de Projeto</h1>
      <p className="mt-2 text-muted-foreground">
        Comece seu próximo projeto com um de nossos modelos pré-configurados.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <GlassCard key={template.name} className="cursor-pointer">
            <div className="flex items-center gap-4">
              <img
                src={template.icon}
                alt={template.name}
                className="h-16 w-16"
              />
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {template.name}
                </h3>
                <p className="mt-1 text-muted-foreground">
                  {template.description}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export default TemplatesPage
