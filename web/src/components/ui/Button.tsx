import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref,
  ) => {
    const baseStyles = [
      "inline-flex items-center justify-center rounded-xl font-medium",
      "transition-all duration-200 ease-out",
      "focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-surface-50",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
      "active:scale-[0.98]",
    ].join(" ");

    const variants = {
      primary: [
        "bg-accent-500 text-white",
        "hover:bg-accent-600 hover:shadow-soft",
        "shadow-sm",
      ].join(" "),
      secondary: [
        "bg-surface-100 text-surface-700 border border-surface-200",
        "hover:bg-surface-200 hover:border-surface-300",
      ].join(" "),
      ghost: [
        "bg-transparent text-surface-600",
        "hover:text-surface-800 hover:bg-surface-100",
      ].join(" "),
      outline: [
        "bg-transparent text-accent-600 border-2 border-accent-500",
        "hover:bg-accent-50",
      ].join(" "),
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-base gap-2",
      lg: "px-7 py-3.5 text-lg gap-2",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
