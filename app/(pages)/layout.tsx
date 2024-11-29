'use client'
import { AppSidebar } from "@/components/structure/organisms/Sidebar/Sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

const pathname = usePathname();

  return (
      <div>
        { 
            (pathname === '/login' || pathname === '/register')
            ? <div>{children}</div> 
            : <AppSidebar>{children}</AppSidebar>
        }
      </div>
  );
}
