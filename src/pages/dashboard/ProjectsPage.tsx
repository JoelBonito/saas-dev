import { Plus } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { GlassCard } from '@/components/common/GlassCard'
import { NewProjectDialog } from '@/components/NewProjectDialog'

const mockProjects = [
  {
    id: '1',
    name: 'E-Commerce MVP',
    description: 'Plataforma de e-commerce para venda de produtos artesanais.',
    techStack: ['React', 'TypeScript', 'Supabase', 'TailwindCSS'],
    template: 'Web App',
  },
  {
    id: '2',
    name: 'API de Pagamentos',
    description: 'API REST para processamento de pagamentos online.',
    techStack: ['Node.js', 'Express', 'PostgreSQL'],
    template: 'API',
  },
  {
    id: '3',
    name: 'Dashboard Analítico',
    description: 'Dashboard para visualização de métricas de vendas.',
    techStack: ['Next.js', 'Recharts', 'Vercel'],
    template: 'Dashboard',
  },
]

const ProjectsPage = () => {
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold text-foreground">Seus Projetos</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NewProjectDialog>
          <GlassCard className="flex h-full cursor-pointer flex-col items-center justify-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
              <Plus className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-foreground">
              Criar Novo Projeto
            </h3>
          </GlassCard>
        </NewProjectDialog>
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage
