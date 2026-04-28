import { useUser } from '@clerk/clerk-react';

// Restituisce true se l'utente Clerk loggato ha role === 'admin' nei publicMetadata.
// Mentre Clerk carica (isLoaded === false) ritorna false: nessun layer admin viene montato.
export function useIsAdmin(): boolean {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) return false;
  return user?.publicMetadata?.role === 'admin';
}
