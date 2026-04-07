import { cn } from '@/lib/utils'

function Checkbox({ className, ...props }) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        'h-4 w-4 shrink-0 rounded border border-input bg-background text-primary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Checkbox }