import { toast } from "sonner";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  token: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (cpf: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("@App:user");
    const storedExpiration = localStorage.getItem("@App:expiration");

    if (storedUser && storedExpiration) {
      const expiration = parseInt(storedExpiration);
      if (Date.now() < expiration) {
        return JSON.parse(storedUser);
      } else {
        localStorage.removeItem("@App:user");
        localStorage.removeItem("@App:expiration");
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const expiration = Date.now() + TOKEN_EXPIRATION;
      localStorage.setItem("@App:user", JSON.stringify(user));
      localStorage.setItem("@App:expiration", expiration.toString());
    } else {
      localStorage.removeItem("@App:user");
      localStorage.removeItem("@App:expiration");
    }
  }, [user]);

  const signIn = async (cpf: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://backend/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, password }),
      });
      if (!response.ok) {
        toast.error("Credenciais inválidas.");
        throw new Error("Credenciais inválidas");
      }
      const user = await response.json();
      setUser(user);
      localStorage.setItem("@App:user", JSON.stringify(user));
      localStorage.setItem("@App:token", user.token);
      const expiration = Date.now() + TOKEN_EXPIRATION;
      localStorage.setItem("@App:expiration", expiration.toString());
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
