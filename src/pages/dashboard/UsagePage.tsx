import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { GlassCard } from '@/components/common/GlassCard'

const chartData = [
  { month: 'Janeiro', claude: 186, gemini: 80, chatgpt: 40 },
  { month: 'Fevereiro', claude: 305, gemini: 200, chatgpt: 90 },
  { month: 'Março', claude: 237, gemini: 120, chatgpt: 60 },
  { month: 'Abril', claude: 73, gemini: 190, chatgpt: 110 },
  { month: 'Maio', claude: 209, gemini: 130, chatgpt: 70 },
  { month: 'Junho', claude: 214, gemini: 140, chatgpt: 80 },
]

const chartConfig = {
  claude: { label: 'Claude', color: 'hsl(var(--chart-1))' },
  gemini: { label: 'Gemini', color: 'hsl(var(--chart-2))' },
  chatgpt: { label: 'ChatGPT', color: 'hsl(var(--chart-3))' },
}

const UsagePage = () => {
  return (
    <div className="animate-fade-in-up space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Uso da API</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <GlassCard>
          <h3 className="text-lg font-semibold text-muted-foreground">
            Tokens Consumidos (Total)
          </h3>
          <p className="text-3xl font-bold">1,234,567</p>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-muted-foreground">
            Custo Total Estimado
          </h3>
          <p className="text-3xl font-bold">$12.34</p>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-muted-foreground">
            Projetos Ativos
          </h3>
          <p className="text-3xl font-bold">3</p>
        </GlassCard>
      </div>
      <GlassCard>
        <h2 className="mb-4 text-xl font-bold">Consumo de Tokens por Modelo</h2>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="hsl(var(--border) / 0.5)"
              />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: 'hsl(var(--accent) / 0.5)' }}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="claude" fill="var(--color-claude)" radius={4} />
              <Bar dataKey="gemini" fill="var(--color-gemini)" radius={4} />
              <Bar dataKey="chatgpt" fill="var(--color-chatgpt)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </GlassCard>
    </div>
  )
}

export default UsagePage
