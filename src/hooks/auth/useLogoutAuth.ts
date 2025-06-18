import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useLogoutAuth() {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    document.cookie = 'token=; path=/; max-age=0; samesite=strict';
    navigate('/iniciosesion');
  }, [navigate]);

  return { logout };
}
