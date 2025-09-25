import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

// Define the types for the component's props.
export interface TrialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The text to display inside the button.
   */
  children: React.ReactNode;
  asChild?: boolean;
}

/**
 * A reusable button component with a shiny, animated gradient effect.
 */
export const TrialButton = forwardRef<HTMLButtonElement, TrialButtonProps>(({
  children,
  className,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <>
      {/* Global styles for custom properties and keyframes */}
      <style>
        {`
        /* Custom CSS properties for animation */
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-percent {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }

        @property --gradient-shine {
          syntax: "<color>";
          initial-value: white;
          inherits: false;
        }

        /* Base styles for the button, handling the conic gradient border and pseudo-elements */
        .shiny-custom-styles {
          /* Custom properties */
          --animation: gradient-angle linear infinite;
          --duration: 3s;
          --shadow-size: 2px; /* Used by ::before */
          --accent-color: #8A2BE2; /* A purple color to match the 'electric' theme */
          --accent-color-light: #9370DB;

          /* Conic gradient border background */
          border: 1px solid transparent; /* Required for border-box background-clip */
          background: conic-gradient(
              from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
              transparent,
              var(--accent-color) var(--gradient-percent),
              var(--gradient-shine) calc(var(--gradient-percent) * 2),
              var(--accent-color) calc(var(--gradient-percent) * 3),
              transparent calc(var(--gradient-percent) * 4)
            )
            border-box;
          box-shadow: inset 0 0 0 1px #1a1818; /* Inner shadow */

          /* Transitions for custom properties on hover/focus */
          transition: --gradient-angle-offset 800ms cubic-bezier(0.25, 1, 0.5, 1),
                      --gradient-percent 800ms cubic-bezier(0.25, 1, 0.5, 1),
                      --gradient-shine 800ms cubic-bezier(0.25, 1, 0.5, 1);

          /* Apply base animation */
          animation: var(--animation) var(--duration);
          animation-composition: add; /* Allows multiple animations to combine */
        }

        /* Pseudo-elements common styles */
        .shiny-custom-styles::before,
        .shiny-custom-styles::after,
        .shiny-custom-styles .button-content::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: 0;
        }

        /* Dots pattern for ::before */
        .shiny-custom-styles::before {
          --size: calc(100% - var(--shadow-size) * 3);
          --position: 2px;
          --space: calc(var(--position) * 2);
          width: var(--size);
          height: var(--size);
          background: radial-gradient(
              circle at var(--position) var(--position),
              white calc(var(--position) / 4),
              transparent 0
            )
            padding-box;
          background-size: var(--space) var(--space);
          background-repeat: space;
          mask-image: conic-gradient(
            from calc(var(--gradient-angle) + 45deg),
            black,
            transparent 10% 90%,
            black
          );
          border-radius: inherit;
          opacity: 0.8;
          animation: var(--animation) var(--duration);
          animation-composition: add;
        }

        /* Inner shimmer for ::after */
        .shiny-custom-styles::after {
          --animation: shimmer linear infinite;
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(-50deg, transparent, var(--accent-color), transparent);
          mask-image: radial-gradient(circle at bottom, transparent 40%, black);
          opacity: 0.6;
          animation: var(--animation) var(--duration),
                     var(--animation) calc(var(--duration) / 0.4) reverse paused;
          animation-composition: add;
        }

        /* Span's ::before for an additional glow effect */
        .shiny-custom-styles .button-content::before {
          --size: calc(100% + 1rem);
          width: var(--size);
          height: var(--size);
          box-shadow: inset 0 -1ex 2rem 4px var(--accent-color);
          opacity: 0;
          transition: opacity 800ms cubic-bezier(0.25, 1, 0.5, 1);
          animation: calc(var(--duration) * 1.5) breathe linear infinite;
        }

        /* Hover/Focus states for animations and custom properties */
        .shiny-custom-styles:is(:hover, :focus-visible) {
          --gradient-percent: 20%;
          --gradient-angle-offset: 95deg;
          --gradient-shine: var(--accent-color-light);
          animation-play-state: running;
        }

        .shiny-custom-styles:is(:hover, :focus-visible)::before,
        .shiny-custom-styles:is(:hover, :focus-visible)::after {
          animation-play-state: running;
        }

        .shiny-custom-styles:is(:hover, :focus-visible) .button-content::before {
          opacity: 1;
        }

        /* Keyframe animations */
        @keyframes gradient-angle { to { --gradient-angle: 360deg; } }
        @keyframes shimmer { to { rotate: 360deg; } }
        @keyframes breathe { from, to { scale: 1; } 50% { scale: 1.2; } }
        `}
      </style>

      <Comp
        ref={ref}
        className={cn(
          `shiny-custom-styles group relative isolate flex items-center justify-center gap-2 overflow-hidden rounded-full
           bg-black/80 text-white backdrop-blur-md outline-offset-4 active:translate-y-px`,
          className
        )}
        {...props}
      >
        <span className="button-content z-10 flex items-center gap-2">{children}</span>
      </Comp>
    </>
  );
});

TrialButton.displayName = "TrialButton";

export default TrialButton;