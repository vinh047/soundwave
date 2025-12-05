"use client";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderCustomProps {
  value?: number;
  onValueChange?: (value: number) => void;
  className?: string;
}

type SliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value" | "onValueChange" | "className"
> &
  SliderCustomProps;
export const Slider = ({
  value = 0,
  onValueChange,
  className,
  ...props
}: SliderProps) => {
  return (
    <SliderPrimitive.Root
      {...props}
      value={[value]}
      onValueChange={(val) => onValueChange?.(val[0] ?? 0)}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-gray-800">
        <SliderPrimitive.Range className="absolute h-full bg-orange-600" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-orange-600 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500" />
    </SliderPrimitive.Root>
  );
};
