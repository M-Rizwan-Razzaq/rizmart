import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#193B63] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#193B63] text-white shadow-sm hover:bg-[#132D4C] active:bg-[#0E223B]",
        gold: "bg-[#193B63] text-white shadow-sm hover:bg-[#132D4C]",
        amber: "bg-[#E3A34D] text-white shadow-sm hover:bg-[#CC8E39]",
        cognac: "bg-[#E3A34D] text-white shadow-sm hover:bg-[#CC8E39]",
        destructive: "bg-[#D9383A] text-white shadow-sm hover:bg-[#B72729]",
        outline:
          "border border-[#E6E8EC] bg-white text-[#263445] shadow-sm hover:bg-[#FAF9F6] hover:border-[#193B63]/40",
        secondary:
          "bg-[#FAF9F6] text-[#193B63] border border-[#E6E8EC] shadow-sm hover:bg-[#F2EFE8]",
        ghost: "hover:bg-[#FAF9F6] hover:text-[#193B63] text-[#627184]",
        link: "text-[#193B63] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
