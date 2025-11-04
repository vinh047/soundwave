import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = ({ className, ...props }: any) => (
  <TabsPrimitive.List
    className={cn("inline-flex h-10 items-center justify-center rounded-md bg-gray-800 p-1 text-gray-400", className)}
    {...props}
  />
);

const TabsTrigger = ({ className, ...props }: any) => (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-900 data-[state=active]:text-white",
      className
    )}
    {...props}
  />
);

const TabsContent = ({ className, ...props }: any) => (
  <TabsPrimitive.Content className={cn("mt-4", className)} {...props} />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };