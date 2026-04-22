import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        neonCyan: "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]",
        neonFuchsia: "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 hover:border-fuchsia-400 transition-all shadow-[0_0_10px_rgba(217,70,239,0.2)]",
        neonBlue: "border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
