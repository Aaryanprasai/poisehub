
// Re-export the AuthContext types and provider for backward compatibility
import { AuthContext, AuthProvider } from './AuthProvider';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types/auth';

export type { User };
export { AuthContext, AuthProvider, useAuth };
