import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm text-zinc-600 dark:text-zinc-400">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2 rounded-md border transition-colors",

            "bg-white text-zinc-900 border-zinc-300 placeholder-zinc-400",

            "dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 dark:placeholder-zinc-500",

            "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",

            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
