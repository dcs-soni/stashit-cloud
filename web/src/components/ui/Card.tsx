import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, className, onClick }: CardProps) => (
  <div
    onClick={onClick}
    className={cn(
      "bg-dark-800/50 border border-dark-700 rounded-xl p-5",
      "backdrop-blur-sm transition-all duration-200",
      onClick && "cursor-pointer hover:border-dark-600 hover:bg-dark-800/70",
      className,
    )}
  >
    {children}
  </div>
);

export default Card;
