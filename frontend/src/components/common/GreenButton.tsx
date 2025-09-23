"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const GreenButton = ({
  className,
  children,
  href,
  ...props
}: React.ComponentProps<typeof Button> & { href?: string }) => {
  return (
    <Button
      asChild={!!href}
      className={cn(
        "bg-[#62A744] text-white font-[400] text-[20px] rounded-[20px] px-[15px] py-[10px] gap-[10px] flex items-center justify-center text-center whitespace-nowrap",
        "max-sm:h-auto max-sm:whitespace-normal max-sm:break-words",
        className
      )}
      {...props}
    >
      {href ? <Link href={href}>{children}</Link> : children}
    </Button>
  );
};
