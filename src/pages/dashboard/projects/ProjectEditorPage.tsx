import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { GlassCard } from '@/components/common/GlassCard'
import { ArrowLeft, Github, Database, Zap } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { TaskRecommendationBanner } from '@/components/recommendations/TaskRecommendationBanner'
import { ChatContainer } from '@/components/chat'

const ProjectEditorPage = () => {
  const { id } = useParams()

  return (
    <div className="animate-fade-in-up flex h-[calc(100vh-10rem)] flex-col gap-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/projects">
            <GlassCard className="p-2">
              <ArrowLeft />
            </GlassCard>
          </Link>
          <h1 className="text-2xl font-bold">E-Commerce MVP (ID: {id})</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="gap-2 border-none bg-green-500/20 text-green-300">
            <Zap className="h-4 w-4" /> Conectado
          </Badge>
          <Badge className="gap-2 border-none bg-blue-500/20 text-blue-300">
            <Github className="h-4 w-4" /> Conectado
          </Badge>
          <Badge className="gap-2 border-none bg-yellow-500/20 text-yellow-300">
            <Database className="h-4 w-4" /> Sincronizando
          </Badge>
        </div>
      </header>

      <TaskRecommendationBanner />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={30}>
          <GlassCard className="h-full overflow-hidden">
            <ChatContainer projectId={id} />
          </GlassCard>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <GlassCard className="h-full">
            <p>Preview do Código</p>
          </GlassCard>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default ProjectEditorPage
