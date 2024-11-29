'use client'
import React from 'react'
import { Home, LayoutDashboard, Settings, ShoppingBasket, Users, CircleUser } from "lucide-react";
import { destroyCookie } from "nookies";
import {
  BadgeCheck,
  CreditCard,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/shadcn/sidebar";
import { Separator } from "@/components/ui/shadcn/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/shadcn/dropdown-menu";
import { Button } from "@/components/ui/shadcn/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/shadcn/breadcrumb";
import { ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Customer",
    url: "/customer",
    icon: Users,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/products",
    icon: ShoppingBasket,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  const handleLogout = () => {
    setIsLoggedIn(true)
    destroyCookie(null, "isLoggedIn")
    router.push("/login")
    setIsLoggedIn(false)
  }



  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Fatmug Designs</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`${
                          pathname === item.url
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : ""
                        } flex items-center space-x-2`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-4">
            {!isLoggedIn && (
             <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="secondary" size="icon" className="rounded-full">
               <CircleUser style={{ width: '20px', height: '20px' }} size={24} className="w-8px"/>
                 <span className="sr-only">Toggle user menu</span>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end">
               <DropdownMenuLabel>My Account</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem>
                <BadgeCheck />
                  Account
                </DropdownMenuItem>
               <DropdownMenuItem>
               <CreditCard />
                  Setting
                </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem>
               <Button onClick={() => {
                     handleLogout()
                    }}>
                      Logout
                      <LogOut />
                    </Button>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
            )}
          </div>
        </header>

        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
