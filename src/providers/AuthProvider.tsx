import { createContext, ReactNode, useEffect, useState } from "react";
import { getUserInformation } from "@/services/User/user.service";
import { User } from "@/models/User";
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
    token: string | null;
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    setTokenFromVerification: (JwtToken: string) => Promise<void>;
}

// TODO: Get this working more
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: {children: ReactNode}) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // TODO: Should probably change (JSON web token Token) in FE and BE
  async function setTokenFromVerification(JwtToken: string){
    await SecureStore.setItemAsync("JwtToken", JwtToken);

    const response = await getUserInformation(JwtToken);

    if (response.success){
      setToken(JwtToken);
      setUser(response.data as User);
    }
  }

  async function loadAuth(){
    try{
        const storedToken = await SecureStore.getItemAsync("JwtToken");

        console.log("Were in the auth provider");

        if (!storedToken){
            setLoading(false);
            return;
        }

        setToken(storedToken);

        const response = await getUserInformation(storedToken);

        if (response.success){
            setUser(response.data as User);
        } else {
            await SecureStore.deleteItemAsync("JwtToken");
            setToken(null);
            setUser(null);
        }
    } finally {
        setLoading(false);
    }
  }

  async function refreshUser(){
    if (!token){
        return;
    }

    const response = await getUserInformation(token);
    if (response.success){
        setUser(response.data as User);
    }
  }

  useEffect(() => {
    loadAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ token, user, loading, refreshUser, setTokenFromVerification }}>
      {children}
    </AuthContext.Provider>
  );
}
