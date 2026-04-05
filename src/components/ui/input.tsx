import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-8 text-sm px-2",
  md: "h-10 text-sm px-3",
  lg: "h-12 text-base px-4",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error,
      leftIcon,
      rightIcon,
      inputSize = "md",
      ...props
    },
    ref,
  ) => {
    const hasLeft = !!leftIcon;
    const hasRight = !!rightIcon;

    const paddingClass =
      hasLeft && hasRight
        ? "pl-10 pr-10"
        : hasLeft
          ? "pl-10"
          : hasRight
            ? "pr-10"
            : "";

    const isDate = type === "date";

    return (
      <div className="relative w-full">
        {hasLeft && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          type={type}
          aria-invalid={error ? "true" : "false"}
          className={cn(
            "w-full rounded-md border bg-transparent shadow-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",

            sizeStyles[inputSize],
            paddingClass,

            isDate && "appearance-none pr-2",

            error
              ? "border-destructive text-destructive placeholder:text-destructive/70 focus-visible:ring-destructive"
              : "border-input focus-visible:ring-1 focus-visible:ring-ring",

            className,
          )}
          {...props}
        />

        {hasRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
