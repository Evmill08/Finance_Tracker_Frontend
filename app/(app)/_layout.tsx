import { Slot, router, usePathname } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { use, useEffect } from 'react';

export default function AppLayout() {
  const { token, user, loading } = useAuth();
  const pathname = usePathname();
  console.log("Were in the app layout");

  console.log("token: ", token);
  console.log("user: ", user);
  console.log("pathname: ", pathname);

  if (loading) return null;

  if (!token){
    router.replace('/login');
    return null;
  }

  if (user && !user.hasLinkedPlaid && pathname !== '/link-bank') {
    console.log("User has not linked plaid, redirecting to link bank");
    router.replace('/link-bank');
  }

  if (user && user.hasLinkedPlaid && pathname === '/link-bank') {
    console.log("User has linked plaid, redirecting to home");
    router.replace('/');
  }

  if (!user) return null;

  return <Slot />;
}