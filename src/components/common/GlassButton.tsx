import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GlassButtonProps extends ButtonProps {}

export const GlassButton = ({
  className,
  variant,
  ...props
}: GlassButtonProps) => {
  return (
    <Button
      className={cn(
        'border-glass bg-glass text-foreground transition-all duration-300 hover:bg-white/10 hover:shadow-lg',
        {
          'bg-primary/20 text-primary-foreground hover:bg-primary/30':
            variant === 'default',
          'bg-secondary/20 text-secondary-foreground hover:bg-secondary/30':
            variant === 'secondary',
        },
        className,
      )}
      variant={variant}
      {...props}
    />
  )
}
