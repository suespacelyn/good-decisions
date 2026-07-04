import * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-bold leading-none select-none text-foreground group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
