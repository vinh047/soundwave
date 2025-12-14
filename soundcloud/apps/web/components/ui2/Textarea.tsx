import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm text-zinc-600 dark:text-zinc-400">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-md px-4 py-2 text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
            "resize-none",

            "bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-300",
            "hover:border-zinc-400",

            "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:border-zinc-700",
            "dark:hover:border-zinc-600",

            "disabled:cursor-not-allowed disabled:opacity-50",

            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
