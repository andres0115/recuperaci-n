import { useState, useEffect } from 'react';

const TOKEN_KEY = 'token';

export const getTokenFromCookie = (): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${TOKEN_KEY}=([^;]+)`));
  return match ? match[2] : null;
};

export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setTokenCookie = (token: string, maxAge = 3600) => {
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; samesite=strict`;
};

export const removeTokenCookie = () => {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=strict`;
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return exp && exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const useGetAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for token in both localStorage and cookies
        const token = getTokenFromStorage() || getTokenFromCookie();
        const isValid = isTokenValid(token);
        
        setIsAuthenticated(isValid);
        
        // If authenticated, try to get user data from localStorage
        if (isValid) {
          const storedUserData = localStorage.getItem('userData');
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading, userData };
};
