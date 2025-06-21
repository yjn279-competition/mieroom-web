"use client"

import * as React from "react"
import { cn } from "~/lib/utils"

interface PopoverProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Popover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & PopoverProps
>(({ children, className, ...props }, ref) => {
  const [open, setOpen] = React.useState(props.open || false)

  React.useEffect(() => {
    if (props.open !== undefined && props.open !== open) {
      setOpen(props.open)
    }
  }, [props.open, open])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    props.onOpenChange?.(newOpen)
  }

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === PopoverTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onClick: () => handleOpenChange(!open),
            })
          }
          if (child.type === PopoverContent) {
            return open ? child : null
          }
        }
        return child
      })}
    </div>
  )
})
Popover.displayName = "Popover"

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={className}
    {...props}
  >
    {children}
  </button>
))
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80",
      className
    )}
    {...props}
  />
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
