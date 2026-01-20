import { Slot, router } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export default function AppLayout() {
  const { token, user, loading } = useAuth();

  console.log("Were are in app layout");

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.replace('./login');
      } else if (!user?.hasLinkedPlaid) {
        router.replace('./link-bank');
      }
    }
  }, [loading, token, user]);

  if (loading || !token || !user?.hasLinkedPlaid) {
    return null; 
  }

  return <Slot />;
}