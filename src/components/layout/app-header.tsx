
"use client";

import Link from 'next/link';
import { LogOut, Settings, UserCircle, Briefcase } from 'lucide-react';
import { Logo } from '@/components/logo';
import { SidebarTrigger } from '@/components/ui/sidebar'; 
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/mock-auth-context';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';


export interface AppHeaderProps {
  showSidebarTrigger?: boolean;
  className?: string;
}

export function AppHeader({ showSidebarTrigger = false, className }: AppHeaderProps) {
  const { user, isLoading, logOut } = useAuth();

  return (
    <header className={cn(
        "py-3 sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print-hide",
        className 
      )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showSidebarTrigger && <SidebarTrigger />}
          <Logo />
        </div>
        <div className="flex items-center gap-3">
          {isLoading && (
            <>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </>
          )}
          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    {/* Placeholder for user image, could be dynamic if image URLs were stored */}
                    {/* <AvatarImage src="/placeholder-user.jpg" alt={user.username} /> */}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username ? user.username.charAt(0).toUpperCase() : <UserCircle size={20}/>}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!isLoading && !user && (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
