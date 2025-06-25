export interface LoginCredentials {
    login: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user?: {
        id: number;
        login: string;
        role?: string;
    };
    message?: string;
}
