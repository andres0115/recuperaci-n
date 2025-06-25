import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials } from '../../types/auth';
import { login as apiLogin } from '../../api/auth/token';

// Token key for localStorage
const TOKEN_KEY = 'token';

// Check if user is authenticated
const checkAuthenticated = (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
};

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuthenticated());
    const navigate = useNavigate();
    
    // Function to handle login
    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        
        try {
            // Use the API login function from token.ts
            // The token.ts file now handles the hardcoded credentials check internally
            const response = await apiLogin(credentials);
            
            // Save token to localStorage
            localStorage.setItem(TOKEN_KEY, response.token);
            setIsAuthenticated(true);
            console.log('Login successful:', response);
            
            // Redirect to dashboard after successful login
            navigate('/dashboard');
            return true;
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.message || 'Error al iniciar sesión');
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    // Function to handle logout
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setIsAuthenticated(false);
        navigate('/');
    };
    
    return {
        login,
        logout,
        loading,
        error,
        isAuthenticated
    };
};
