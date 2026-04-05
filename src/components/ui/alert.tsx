import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "./button"
import Heading from "./typography/Heading"

interface AlertActionProps extends ButtonProps {
  hasDescription?: boolean
}

const alertVariants = cva(
  "w-full rounded-lg border px-4 py-3 text-sm flex items-start gap-3",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground [&>svg]:text-primary",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <Heading
    level={5}
    ref={ref}
    className={cn("font-medium leading-none tracking-tight", className)}
    {...props}
  />
))

AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground [&_p]:leading-relaxed", className)}
    {...props}
  />
))

AlertDescription.displayName = "AlertDescription"

const AlertAction = React.forwardRef<HTMLButtonElement, AlertActionProps>(
  ({ className, hasDescription, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "w-auto",
        hasDescription ? "mt-2 self-start" : "ml-auto mt-0 self-center",
        className
      )}
      {...props}
    />
  )
)

AlertAction.displayName = "AlertAction"

export { Alert, AlertTitle, AlertDescription, AlertAction }
