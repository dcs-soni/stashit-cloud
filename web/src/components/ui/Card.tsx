import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "elevated" | "bordered";
}

const Card = ({
  children,
  className,
  onClick,
  variant = "default",
}: CardProps) => {
  const variants = {
    default: ["bg-white border border-surface-200", "shadow-soft"].join(" "),
    elevated: [
      "bg-white border border-surface-100",
      "shadow-soft-lg hover:shadow-glow",
    ].join(" "),
    bordered: [
      "bg-surface-50 border border-surface-200",
      "hover:border-surface-300",
    ].join(" "),
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl p-6",
        "backdrop-blur-sm transition-all duration-300",
        variants[variant],
        onClick && "cursor-pointer hover:border-accent-300",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
