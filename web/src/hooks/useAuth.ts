import { useState, useEffect, useCallback } from "react";

interface JwtPayload {
  id: string;
  username?: string;
  iat?: number;
  exp?: number;
}

const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeJwt(token);
      setIsAuthenticated(true);
      setUsername(payload?.username ?? null);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem("token", token);
    const payload = decodeJwt(token);
    setUsername(payload?.username ?? null);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  return { isAuthenticated, isLoading, username, login, logout };
};
