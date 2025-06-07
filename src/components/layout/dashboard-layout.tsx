
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Settings, Briefcase } from 'lucide-react'; // Added Briefcase for logo placeholder
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
import { useAuth } from '@/contexts/auth-context';
import { Button } from '../ui/button';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-2 justify-center items-center group-data-[collapsible=icon]:justify-start group-data-[collapsible=icon]:px-2">
           {/* Show full logo when expanded, icon when collapsed */}
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
                <Link href="/settings"> {/* This page won't exist yet */}
                  <Settings />
                  <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        {/* Optional Footer Example
        <SidebarFooter className="p-2 justify-center group-data-[collapsible=icon]:justify-start group-data-[collapsible=icon]:px-2">
           <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-2">
            <Settings className="group-data-[collapsible=icon]:mx-auto"/>
            <span className="group-data-[collapsible=icon]:hidden">User Settings</span>
          </Button>
        </SidebarFooter>
        */}
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader showSidebarTrigger />
        <main className="flex-1">
          {children}
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} Finance Flow. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
