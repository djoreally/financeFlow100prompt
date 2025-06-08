
import type {Metadata} from 'next';
import './globals.css';
import './print.css';
import { Toaster } from "@/components/ui/toaster";
import { MockAuthProvider } from '@/contexts/mock-auth-context'; // Added MockAuthProvider

export const metadata: Metadata = {
  title: 'Finance Flow',
  description: 'Track income, expenses, and visualize spending with interactive charts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background flex flex-col">
        <MockAuthProvider> {/* Wrapped children with MockAuthProvider */}
          {children}
          <Toaster />
        </MockAuthProvider>
      </body>
    </html>
  );
}
