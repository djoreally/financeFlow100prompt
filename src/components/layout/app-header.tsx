
"use client";

import { Logo } from '@/components/logo';
import { SidebarTrigger } from '@/components/ui/sidebar'; 
import { cn } from '@/lib/utils';

export interface AppHeaderProps {
  showSidebarTrigger?: boolean;
  className?: string;
}

export function AppHeader({ showSidebarTrigger = false, className }: AppHeaderProps) {
  return (
    <header className={cn(
        "py-4 sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className 
      )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showSidebarTrigger && <SidebarTrigger />}
          <Logo />
        </div>
        {/* Navigation items (like user profile, login/signup) removed */}
      </div>
    </header>
  );
}
