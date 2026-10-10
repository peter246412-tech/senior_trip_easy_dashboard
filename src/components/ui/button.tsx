import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
// shadcn/ui Slot-based Button pattern, adapted to this project's design tokens.
export function Button({className,variant="primary",asChild=false,...props}: React.ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"primary"|"outline"|"ghost";asChild?:boolean}) {const Comp=asChild?Slot:"button";return <Comp className={clsx("button",`button-${variant}`,className)} {...props}/>;}
