import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const GlassInput = ({ className, ...props }: InputProps) => {
  return (
    <Input
      className={cn(
        'border-glass bg-glass py-6 text-foreground placeholder:text-muted-foreground focus:border-white/20 focus:ring-1 focus:ring-primary/50',
        className,
      )}
      {...props}
    />
  )
}
