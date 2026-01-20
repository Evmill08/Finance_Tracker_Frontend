import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, router, Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/providers/AuthProvider';
import { useAuth } from '@/hooks/use-auth';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

function Gate(){
  const {token, user, loading} = useAuth();

  if (loading){
    return null; // Probably a splash screen later
  }

  if (!token){
    router.replace("./login")
  }

  if (!user?.hasLinkedPlaid){
    router.replace("./link-bank");
  }

  return <Slot/>
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Gate/>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
    
  );
}
