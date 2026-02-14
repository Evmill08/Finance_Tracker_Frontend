import { Slot, router, usePathname } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { use, useEffect } from 'react';

export default function AppLayout() {
  const { token, user, loading } = useAuth();
  const pathname = usePathname();
  console.log("Were in the app layout");

  useEffect(() => {
    if (loading) return;
    console.log("token: ", token);
    console.log("user: ", user);
    console.log("pathname: ", pathname);

    if (!token && pathname !== '/login') {
      router.replace('/login');
      return;
    }

    if (user && !user.hasLinkedPlaid && pathname !== '/link-bank') {
      console.log("User has not linked plaid, redirecting to link bank");
      router.replace('/link-bank');
    }
  }, [loading, user, token, pathname]);

  if (loading) return null;
  if (!token) return null;
  if (!user) return null;

  return <Slot />;
}