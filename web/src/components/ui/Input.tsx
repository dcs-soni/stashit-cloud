import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "default" | "filled";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, variant = "default", ...props }, ref) => {
    const variants = {
      default: [
        "bg-white border-surface-200 text-surface-700 placeholder-surface-400",
        "focus:ring-accent-500 focus:border-accent-500",
        "hover:border-surface-300",
      ].join(" "),
      filled: [
        "bg-surface-100 border-surface-200 text-surface-700 placeholder-surface-400",
        "focus:ring-accent-500 focus:border-accent-500 focus:bg-white",
        "hover:bg-surface-50",
      ].join(" "),
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-600 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 border rounded-xl text-base",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "transition-all duration-200",
            variants[variant],
            error && "border-red-400 focus:ring-red-400",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
