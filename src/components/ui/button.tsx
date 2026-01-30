import * as React from "react";
// import { cn } from "@/lib/utils"
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 active:scale-95":
              variant === "default",
            "bg-slate-800/50 text-slate-100 backdrop-blur-sm hover:bg-slate-800 border border-slate-700/50":
              variant === "secondary",
            "border border-blue-500/30 bg-transparent text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50":
              variant === "outline",
            "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100":
              variant === "ghost",
            "text-blue-400 underline-offset-4 hover:underline":
              variant === "link",
          },
          {
            "h-10 px-6 py-2": size === "default",
            "h-9 px-4 text-xs": size === "sm",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
