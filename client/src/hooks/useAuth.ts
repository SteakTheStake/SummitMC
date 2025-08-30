import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isAdmin: boolean;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 0, // Always check authentication status
  });

  // If there's an error (like 401), user is not authenticated
  const isAuthenticated = !!user && !error;
  
  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin: user?.isAdmin || false,
  };
}