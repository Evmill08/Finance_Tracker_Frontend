import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/providers/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();

  console.log("were in root layout");

  // return (
  //   <AuthProvider>
  //     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  //       {children}
  //       <StatusBar style="auto" />
  //     </ThemeProvider>
  //   </AuthProvider>
  // );
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );  
}