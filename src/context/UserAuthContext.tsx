import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Address = {
  phone: string;
  state: string;
  city: string;
  pincode: string;
  address: string;
};

export type UserSession = {
  email: string;
  name: string;
  picture: string;
  address?: Address | null;
  token?: string;
};

type UserCtx = {
  user: UserSession | null;
  loading: boolean;
  login: (credential: string) => void;
  logout: () => void;
  saveAddress: (address: Address) => void;
};

const UserAuthContext = createContext<UserCtx | undefined>(undefined);

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to decode JWT without a library
  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("swapna_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Load address specifically from address_<email> key on init
        const storedAddress = localStorage.getItem(`address_${parsedUser.email}`);
        if (storedAddress) {
          parsedUser.address = JSON.parse(storedAddress);
        }
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem("swapna_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (credential: string) => {
    const payload = decodeJwt(credential);
    if (!payload) return;

    const newUser: UserSession = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      token: credential,
    };
    
    // Check localStorage: localStorage.getItem("address_<email>")
    const storedAddress = localStorage.getItem(`address_${newUser.email}`);
    if (storedAddress) {
      try {
        newUser.address = JSON.parse(storedAddress);
      } catch (e) {
        console.error("Failed to parse stored address");
      }
    }

    setUser(newUser);
    localStorage.setItem("swapna_user", JSON.stringify({
      email: newUser.email,
      name: newUser.name,
      picture: newUser.picture,
      token: newUser.token
    }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("swapna_user");
  };

  const saveAddress = (address: Address) => {
    if (!user) return;
    const updatedUser = { ...user, address };
    setUser(updatedUser);
    
    // Save address locally using localStorage key
    localStorage.setItem(`address_${user.email}`, JSON.stringify(address));
  };

  return (
    <UserAuthContext.Provider value={{ user, loading, login, logout, saveAddress }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used within UserAuthProvider");
  return ctx;
};
