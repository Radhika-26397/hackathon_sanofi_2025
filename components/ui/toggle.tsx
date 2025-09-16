"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "./utils";

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>>(
  ({ className, pressed, defaultPressed, ...props }, ref) => (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        className
      )}
      pressed={pressed}
      defaultPressed={defaultPressed}
      {...props}
    />
  )
);
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
