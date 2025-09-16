"use client";

import * as React from "react";
import { PanelGroup as PanelGroupPrimitive, Panel as PanelPrimitive, PanelResizeHandle } from "react-resizable-panels";
import { cn } from "./utils";

const PanelGroup = ({ className, ...props }: React.ComponentProps<typeof PanelGroupPrimitive>) => (
  <PanelGroupPrimitive className={cn("flex h-full w-full", className)} {...props} />
);

const Panel = PanelPrimitive;

interface PanelHandleProps extends React.ComponentProps<typeof PanelResizeHandle> {
  withHandle?: boolean;
}

const PanelHandle = ({ className, withHandle, ...props }: PanelHandleProps) => (
  <PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border transition data-[resize-handle-active]:bg-primary data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:flex-col data-[panel-group-direction=vertical]:py-1 data-[panel-group-direction=horizontal]:px-1",
      withHandle && "data-[panel-group-direction=horizontal]:w-2 data-[panel-group-direction=vertical]:h-2",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-1 items-center justify-center rounded-full border border-border bg-border data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=vertical]:w-4" />
    )}
  </PanelResizeHandle>
);

export { PanelGroup, Panel, PanelHandle };
