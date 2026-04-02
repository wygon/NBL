import { XStack, Text, Button, Avatar } from 'tamagui';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const AppBar = () => {
  const insets = useSafeAreaInsets();
  
  // Symulacja stanu logowania - potem zmienisz to na dane z API/State
  const isLoggedIn = true; 
  const user = {
    name: 'Lilia',
    avatar: 'https://i.pravatar.cc/150?u=lilia'
  };

  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$3"
      paddingTop={Math.max(insets.top, 16)}
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      {...(Platform.OS === 'web' && {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      })}
    >
      <Text fontSize="$6" fontWeight="bold" color="$color">
        Nails by Lilia
      </Text>

      <XStack gap="$3" alignItems="center">
        {isLoggedIn ? (
          // WIDOK GDY ZALOGOWANY
          <XStack gap="$2" alignItems="center">
            <Text fontWeight="600" color="$color">Cześć, {user.name}!</Text>
            <Avatar circular size="$3">
              <Avatar.Image src={user.avatar} />
              <Avatar.Fallback backgroundColor="$gray5" />
            </Avatar>
          </XStack>
        ) : (
          // WIDOK GDY NIEZALOGOWANY
          <Button size="$3" theme="active" backgroundColor="#FF2A85">
             <Button.Text color="white">Zaloguj</Button.Text>
          </Button>
        )}
      </XStack>
    </XStack>
  );
};