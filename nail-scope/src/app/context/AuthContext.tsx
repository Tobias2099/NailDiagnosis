import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useRouter } from "next/navigation";

export interface ProfileProps {
  username: string;
  email: string;
  birthDate: Date | null;
  sex: 'Male' | 'Female' | null;
  height: number | null;
  weight: number | null;
  medicalHistory: string | null;
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: (profileData: ProfileProps) => void;
  logout: () => void;
  profile: ProfileProps | null;
  setProfile: (profile: ProfileProps | null) => void;
  updateProfile: (updates: Partial<ProfileProps>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : {children: ReactNode}) => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = (profileData: ProfileProps) => {
    setIsLoggedIn(true);
    setProfile(profileData);
  };
  const logout = () => {
    setIsLoggedIn(false);
    setProfile(null);
    router.push('/');
  };

  const updateProfile = (updates: Partial<ProfileProps>) => {
    setProfile((prevProfile) => {
      if (!prevProfile) return null;
      return { ...prevProfile, ...updates};
    });
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, login, logout, profile, setProfile, updateProfile}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context;
}