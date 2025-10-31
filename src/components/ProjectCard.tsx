import { GlassCard } from '@/components/common/GlassCard'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

interface ProjectCardProps {
  id: string
  name: string
  description: string
  techStack: string[]
  template: string
}

export const ProjectCard = ({
  id,
  name,
  description,
  techStack,
  template,
}: ProjectCardProps) => {
  const navigate = useNavigate()

  return (
    <GlassCard
      className="cursor-pointer"
      onClick={() => navigate(`/dashboard/projects/${id}`)}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-bold text-foreground">{name}</h3>
        <Badge className="bg-primary/20 text-primary-foreground">
          {template}
        </Badge>
      </div>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <Badge key={tech} variant="secondary" className="bg-white/10">
            {tech}
          </Badge>
        ))}
      </div>
    </GlassCard>
  )
}
