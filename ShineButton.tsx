import React from "react";
import { cn } from "@/lib/utils";

interface ShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  bgColor?: string; // Can be hex or gradient
}

const sizeStyles: Record<
  NonNullable<ShineButtonProps["size"]>,
  { padding: string; fontSize: string }
> = {
  sm: { padding: "0.5rem 1rem", fontSize: "0.875rem" },
  md: { padding: "0.6rem 1.4rem", fontSize: "1rem" },
  lg: { padding: "0.8rem 1.8rem", fontSize: "1.125rem" },
};

export const ShineButton: React.FC<ShineButtonProps> = ({
  children,
  className = "",
  size = "md",
  bgColor = "linear-gradient(110deg, #8b5cf6 0%, #6366f1 55%, #8b5cf6 90%)",
  ...props
}) => {
  const { padding, fontSize } = sizeStyles[size];

  const backgroundImage = bgColor.startsWith("linear-gradient")
    ? bgColor
    : `linear-gradient(to right, ${bgColor}, ${bgColor})`;

  return (
    <>
      <style>
        {`
        @keyframes shine {
          from {
            transform: translateX(-100%) skewX(-20deg);
          }
          to {
            transform: translateX(100%) skewX(-20deg);
          }
        }
        .animate-shine {
          animation: shine 1.5s ease-out infinite;
        }
        .group:hover .shiny-text {
          background: linear-gradient(90deg, #c7d2fe, #ffffff, #c7d2fe);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine-text-anim 1.5s ease-in-out infinite;
          background-size: 200% auto;
        }
        @keyframes shine-text-anim {
          to { background-position: -200% center; }
        }
        `}
      </style>
      <button
        {...props}
        className={cn(
          `group relative inline-flex items-center justify-center text-white font-semibold rounded-xl min-h-[44px] transition-all duration-300 ease-in-out
          border-none cursor-pointer overflow-hidden
          shadow-[0px_0px_20px_rgba(139,92,246,0.5),0px_5px_5px_-1px_rgba(109,40,217,0.25),inset_4px_4px_8px_rgba(165,180,252,0.5),inset_-4px_-4px_8px_rgba(139,92,246,0.35)]
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-violet-500
          hover:scale-105 hover:bg-[length:280%_auto] active:scale-95`,
          className
        )}
        style={{
          backgroundImage,
          backgroundSize: "280% auto",
          backgroundPosition: "initial",
          color: "hsl(0 0% 100%)",
          fontSize,
          padding,
          transition: "0.8s",
        }}
        onMouseEnter={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundPosition = "right center")
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundPosition = "initial")
        }
      >
        <span className="shiny-text z-10 flex items-center gap-2 transition-colors">{children || "Shine now"}</span>

        {/* Shine effect */}
        <div className="absolute top-0 left-[-75%] w-[200%] h-full bg-white/40 skew-x-[-20deg] opacity-0 group-hover:opacity-100 animate-shine pointer-events-none z-0" />
      </button>
    </>
  );
};

export default ShineButton;