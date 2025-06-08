
"use client";

import React, { createContext, useContext, type ReactNode } from 'react';
import { useMockAuthInternal, type MockAuthHook, type MockUser } from '@/hooks/use-mock-auth';

// Re-export MockUser if needed by consuming components directly for typing
export type { MockUser };

// Use MockAuthHook for the context type directly
const MockAuthContext = createContext<MockAuthHook | undefined>(undefined);

export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useMockAuthInternal();
  return <MockAuthContext.Provider value={auth}>{children}</MockAuthContext.Provider>;
};

export const useAuth = (): MockAuthHook => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
};
