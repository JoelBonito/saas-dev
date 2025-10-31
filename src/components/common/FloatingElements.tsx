import { cn } from '@/lib/utils'

const elements = Array.from({ length: 15 })

export const FloatingElements = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 h-full w-full bg-background">
        <div
          className={cn(
            '[--aurora:repeating-linear-gradient(100deg,hsl(var(--primary))_10%,hsl(var(--primary))_20%,hsl(var(--accent))_30%,hsl(var(--accent))_40%,hsl(var(--primary))_50%)]',
            '[--dark-gradient:repeating-linear-gradient(100deg,hsl(var(--background))_0%,hsl(var(--background))_7%,transparent_10%,transparent_12%,hsl(var(--background))_16%)]',
            '[--aurora-size:1000px]',
            'animate-aurora',
            'bg-[length:var(--aurora-size)_100%]',
            'bg-[position:50%_50%,50%_50%]',
            'bg-no-repeat',
            'after:absolute after:inset-0 after:bg-[length:200px_200px] after:bg-repeat after:content-[""] after:[background-image:var(--dark-gradient)]',
            'blur-2xl',
            'opacity-20',
            'dark:bg-[background-image:var(--aurora)]',
          )}
        />
      </div>
      {elements.map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 150 + 50}px`,
            height: `${Math.random() * 150 + 50}px`,
            animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            filter: `blur(${Math.random() * 10 + 5}px)`,
          }}
        />
      ))}
    </div>
  )
}
