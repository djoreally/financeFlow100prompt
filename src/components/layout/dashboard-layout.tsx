
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Settings, Briefcase, LogOut, UserCircle } from 'lucide-react'; 
import { AppHeader } from '@/components/layout/app-header';
import { Logo } from '@/components/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/mock-auth-context';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logOut } = useAuth();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r print-hide">
        <SidebarHeader className="p-2 justify-center items-center group-data-[collapsible=icon]:justify-start group-data-[collapsible=icon]:px-2">
          <div className="group-data-[collapsible=icon]:hidden flex items-center justify-center w-full">
            <Logo />
          </div>
          <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
             <Briefcase className="h-7 w-7 text-primary" />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/">
                  <Home />
                  <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="/settings"> 
                  <Settings />
                  <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t">
          {isLoading && (
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-20 group-data-[collapsible=icon]:hidden" />
            </div>
          )}
          {!isLoading && user && (
            <div className="flex flex-col items-start gap-2 group-data-[collapsible=icon]:items-center">
                <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full">
                    <Avatar className="h-8 w-8">
                         <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                           {user.username ? user.username.charAt(0).toUpperCase() : <UserCircle size={16}/>}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-medium truncate">{user.username}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                </div>
                 <Button variant="ghost" size="sm" onClick={logOut} className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0">
                    <LogOut className="h-4 w-4 group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                    <span className="group-data-[collapsible=icon]:hidden ml-2">Logout</span>
                 </Button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader showSidebarTrigger className="print-hide dashboard-layout-header" />
        <main className="flex-1">
          {children}
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t print-hide">
          © {new Date().getFullYear()} Finance Flow. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
