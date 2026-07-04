import * as React from "react";
import { cn } from "@/lib/utils";

const inputBase =
  "h-11 w-full min-w-0 rounded-lg border border-input bg-card px-3.5 text-base text-foreground outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputBase, className)}
      {...props}
    />
  );
}

/** Money input with a leading $ adornment. Returns a number via onValueChange. */
function MoneyInput({
  className,
  value,
  onValueChange,
  ...props
}: Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
  value: number | "";
  onValueChange: (value: number) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">
        $
      </span>
      <input
        data-slot="input"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/[^0-9.]/g, ""));
          onValueChange(Number.isFinite(n) ? n : 0);
        }}
        className={cn(inputBase, "pl-7 font-semibold", className)}
        {...props}
      />
    </div>
  );
}

export { Input, MoneyInput };
