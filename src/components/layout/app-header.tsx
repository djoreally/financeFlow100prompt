import { Logo } from '@/components/logo';

export function AppHeader() {
  return (
    <header className="py-4 px-4 md:px-6 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        {/* Future elements like user profile or theme toggle can go here */}
      </div>
    </header>
  );
}
