import { cn } from "@/_lib/utils";
import type { HTMLAttributes } from "react";
import React from "react";

const MainTitle = React.forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, children }, ref) => {
  return (
    <h1
      className={cn(
        "relative overflow-hidden pb-4 font-wurth text-3xl text-brand-primary after:absolute after:top-[calc(50%-0.4rem)] after:block after:h-px after:w-full after:bg-brand-primary after:pl-5",
        className,
      )}
      ref={ref}
    >
      <span className="relative z-10 inline-block max-w-[80%] bg-white pr-4">
        {children}
      </span>
    </h1>
  );
});
MainTitle.displayName = "MainTitle";

export { MainTitle };
