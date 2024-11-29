'use client'
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const font = Poppins({
    subsets:["latin"],
    weight:['600']
})

interface HeaderProps {
    label: string
}

export const Header = ({label} : HeaderProps) =>{

    const pathname = usePathname();
return(
    <div className="w-ful flex flex-col gap-y-5 items-center justify-center">
        <h1 className={cn(
            'text-2xl font-semibold',
            font.className
        )}>
           {pathname === "/login" 
           ? "Login" 
           : "Sign Up"}
        </h1>
        <p className="text-muted-foreground text-sm">{label}</p>
    </div>
)
}