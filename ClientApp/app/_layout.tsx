import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { config } from '@tamagui/config/v3';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { createTamagui, TamaguiProvider, YStack } from 'tamagui'; // Dodaj YStack

const queryClient = new QueryClient();
const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          
          {/* Główny kontener centrujący dla wersji Web */}
          <YStack flex={1} backgroundColor="$background">
            <YStack 
              flex={1}
              width="100%" 
              maxWidth={500} // Szerokość "mobilna"
              alignSelf="center"
              backgroundColor="$background"
              // Opcjonalne: cień lub obramowanie, żeby odróżnić apkę od tła na dużym ekranie
              shadowColor="$shadowColor"
              shadowRadius={20}
              shadowOpacity={0.1}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
            </YStack>
          </YStack>

          <StatusBar style="auto" />
        </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </TamaguiProvider>
  );
}