import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border-glass bg-glass p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-white/20',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
GlassCard.displayName = 'GlassCard'
