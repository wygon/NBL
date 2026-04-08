// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { TamaguiProvider, createTamagui } from 'tamagui';
// import { config } from '@tamagui/config/v3';

// const queryClient = new QueryClient();
// const tamaguiConfig = createTamagui(config);
// type Conf = typeof tamaguiConfig;

// declare module 'tamagui' {
//   interface TamaguiCustomConfig extends Conf {}
// }

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
//       <QueryClientProvider client={queryClient}>
//         <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//           <Stack>
//             <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//             <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
//           </Stack>
//           <StatusBar style="auto" />
//         </ThemeProvider>
//       </QueryClientProvider>
//     </TamaguiProvider>
//   );
// }

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TamaguiProvider, createTamagui, YStack, PortalProvider } from 'tamagui'; // Dodaj YStack
import { config } from '@tamagui/config/v3';

const queryClient = new QueryClient();
const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <PortalProvider shouldAddRootHost>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}