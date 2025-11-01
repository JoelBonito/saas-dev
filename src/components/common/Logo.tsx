import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LogoProps {
  /**
   * Size variant for the logo
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Show/hide the text label
   * @default true
   */
  showText?: boolean
  /**
   * Custom className for styling
   */
  className?: string
  /**
   * Link destination (if null, renders without Link wrapper)
   * @default '/dashboard'
   */
  to?: string | null
  /**
   * Custom text to display
   * @default 'INOVE.AI dev'
   */
  text?: string
}

const sizeClasses = {
  sm: {
    container: 'gap-1.5',
    image: 'h-6 w-6',
    text: 'text-base',
  },
  md: {
    container: 'gap-2',
    image: 'h-8 w-8',
    text: 'text-xl',
  },
  lg: {
    container: 'gap-3',
    image: 'h-12 w-12',
    text: 'text-2xl',
  },
  xl: {
    container: 'gap-4',
    image: 'h-16 w-16',
    text: 'text-4xl',
  },
}

export function Logo({
  size = 'md',
  showText = true,
  className,
  to = '/dashboard',
  text = 'INOVE.AI dev',
}: LogoProps) {
  const sizes = sizeClasses[size]

  const LogoContent = () => (
    <div className={cn('flex items-center', sizes.container, className)}>
      {/* Logo Image */}
      <img
        src="/logos/inove-ai-logo.svg"
        alt="INOVE.AI dev Logo"
        className={cn(sizes.image, 'transition-transform duration-300 hover:scale-110')}
      />

      {/* Logo Text */}
      {showText && (
        <span
          className={cn(
            'font-bold text-white',
            sizes.text,
            'bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent',
          )}
        >
          {text}
        </span>
      )}
    </div>
  )

  // If 'to' is null, render without Link wrapper
  if (to === null) {
    return <LogoContent />
  }

  // Render with Link wrapper
  return (
    <Link to={to} className="transition-opacity hover:opacity-80">
      <LogoContent />
    </Link>
  )
}
