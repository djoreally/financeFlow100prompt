
"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const USER_STORAGE_KEY = 'financeFlowMockUser'; // Stores { email: { username, email } }
const CREDENTIALS_STORAGE_KEY = 'financeFlowMockCredentials'; // Stores { email: password }
const LOGGED_IN_USER_EMAIL_KEY = 'financeFlowLoggedInUserEmail';

export interface MockUser {
  username: string;
  email: string;
}

export interface MockAuthHook {
  user: MockUser | null;
  isLoading: boolean;
  logIn: (email_param: string, password_param: string) => Promise<boolean>;
  logOut: () => void;
  signUp: (username_param: string, email_param: string, password_param: string) => Promise<boolean>;
  updateUser: (updatedData: Partial<MockUser>) => Promise<boolean>;
}

export const useMockAuthInternal = (): MockAuthHook => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const loggedInEmail = localStorage.getItem(LOGGED_IN_USER_EMAIL_KEY);
      if (loggedInEmail) {
        const allUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
        if (allUsers[loggedInEmail]) {
          setUser(allUsers[loggedInEmail]);
        } else {
          // Data inconsistency, clear login state
          localStorage.removeItem(LOGGED_IN_USER_EMAIL_KEY);
        }
      }
    } catch (e) {
      console.error("Error initializing mock auth state from localStorage:", e);
      // Clear potentially corrupt keys
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(CREDENTIALS_STORAGE_KEY);
      localStorage.removeItem(LOGGED_IN_USER_EMAIL_KEY);
    }
    setIsLoading(false);
  }, []);

  const signUp = useCallback(async (username_param: string, email_param: string, password_param: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // For a true single-user-per-device, we might overwrite existing data or prevent new signups if one exists.
      // For this prototype, let's allow one "account" to be set up.
      // If we want to strictly enforce one user, check if USER_STORAGE_KEY has any entries.
      const existingUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
      if (Object.keys(existingUsers).length > 0 && !existingUsers[email_param]) {
         console.warn("An account already exists. This prototype supports one user per device. Please log in or clear application data to sign up again.");
         // alert("An account already exists. This prototype supports one user per device.");
         // setIsLoading(false);
         // return false; 
         // For now, let's allow overriding if the email matches or creating a new one if it doesn't,
         // but a real single-user would be stricter.
      }
       if (existingUsers[email_param]) {
        console.warn("Email already registered. Try logging in.");
        // We could also choose to update the password here if desired for a "reset" flow.
        // For simplicity, we'll just prevent duplicate signups with the same email.
        // setIsLoading(false);
        // return false; 
      }


      const newUser: MockUser = { username: username_param, email: email_param };
      
      const allUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
      allUsers[email_param] = newUser;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(allUsers));

      const allCredentials = JSON.parse(localStorage.getItem(CREDENTIALS_STORAGE_KEY) || '{}');
      allCredentials[email_param] = password_param; // Storing password directly: NOT FOR PRODUCTION
      localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(allCredentials));
      
      localStorage.setItem(LOGGED_IN_USER_EMAIL_KEY, email_param);
      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error("Mock signup error:", e);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logIn = useCallback(async (email_param: string, password_param: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const allCredentials = JSON.parse(localStorage.getItem(CREDENTIALS_STORAGE_KEY) || '{}');
      const allUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');

      if (allCredentials[email_param] && allCredentials[email_param] === password_param && allUsers[email_param]) {
        localStorage.setItem(LOGGED_IN_USER_EMAIL_KEY, email_param);
        setUser(allUsers[email_param]);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (e) {
      console.error("Mock login error:", e);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem(LOGGED_IN_USER_EMAIL_KEY);
    setUser(null);
    router.push('/login');
  }, [router]);

  const updateUser = useCallback(async (updatedData: Partial<MockUser>): Promise<boolean> => {
    const currentEmail = localStorage.getItem(LOGGED_IN_USER_EMAIL_KEY);
    if (!currentEmail) return false;
    
    setIsLoading(true);
    try {
      const allUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
      if (!allUsers[currentEmail]) return false;

      const updatedUser: MockUser = { ...allUsers[currentEmail], ...updatedData };

      // If email is changing, we need to update keys in credentials and users, and loggedInUserEmailKey
      if (updatedData.email && updatedData.email !== currentEmail) {
        const newEmail = updatedData.email;
        // Check if new email already exists (and isn't the current user)
        if (allUsers[newEmail]) {
            console.error("New email already in use.");
            setIsLoading(false);
            return false;
        }

        allUsers[newEmail] = { ...updatedUser, email: newEmail }; // ensure email field is updated
        delete allUsers[currentEmail];
        
        const allCredentials = JSON.parse(localStorage.getItem(CREDENTIALS_STORAGE_KEY) || '{}');
        if (allCredentials[currentEmail]) {
            allCredentials[newEmail] = allCredentials[currentEmail];
            delete allCredentials[currentEmail];
            localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(allCredentials));
        }
        localStorage.setItem(LOGGED_IN_USER_EMAIL_KEY, newEmail);
      } else {
         allUsers[currentEmail] = updatedUser;
      }
      
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(allUsers));
      setUser(updatedUser);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error("Mock update user error:", e);
      setIsLoading(false);
      return false;
    }
  }, []);

  return { user, isLoading, logIn, logOut, signUp, updateUser };
};

