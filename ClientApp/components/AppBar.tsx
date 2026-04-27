import { useAuth } from '@/src/contexts/AuthContext';
import { UserRole } from '@/src/hooks/useArtists';
import { useUsers } from '@/src/hooks/useUsers';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Button, ListItem, ScrollView, Sheet, Spinner, Text, XStack, YStack } from 'tamagui';

export const AppBar = () => {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, logout, loginAs } = useAuth();
  const [isUsersSheetOpen, setIsUsersSheetOpen] = useState(false);

  const { data: allUsers, isLoading: isLoadingUsers } = useUsers();

const getRoleBadge = (role: any) => {
  const isManager = role === UserRole.Manager || role === 'Manager' || role === 2;
  const isArtist = role === UserRole.Artist || role === 'Artist' || role === 1;

  if (isManager) return { color: '#FF2A85', label: 'MGR' };
  if (isArtist) return { color: '#4CAF50', label: 'ART' };
  return { color: '#808080', label: 'USER' };
};

  return (
    <>
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$3"
        paddingTop={Math.max(insets.top, 16)}
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        {...(Platform.OS === 'web' && { position: 'sticky', top: 0, zIndex: 1000 })}
      >
        {/* LOGO jako przycisk otwierający listę użytkowników */}
        <XStack 
          onPress={() => setIsUsersSheetOpen(true)} 
          pressStyle={{ opacity: 0.7 }} 
          alignItems="center" 
          gap="$2"
        >
          <Text fontSize="$6" fontWeight="bold" color="$color">Nails by Lilia</Text>
          <Ionicons name="chevron-down" size={16} color="$color" />
        </XStack>

        <XStack gap="$3" alignItems="center">
          {isAuthenticated && user ? (
            <XStack gap="$2" alignItems="center" onPress={logout} pressStyle={{ opacity: 0.6 }}>
              <YStack alignItems="flex-end">
                <Text fontWeight="600" fontSize="$3">{user.name}</Text>
                <Text fontSize="$1" color="$gray10">{user.instagramName}</Text>
              </YStack>
              <Avatar circular size="$3">
                <Avatar.Image src={user.photoUrl || `https://i.pravatar.cc/150?u=${user.id}`} />
                <Avatar.Fallback backgroundColor="$gray5" />
              </Avatar>
            </XStack>
          ) : (
            <Button size="$3" theme="active" backgroundColor="#FF2A85" onPress={() => setIsUsersSheetOpen(true)}>
               <Button.Text color="white">Zaloguj</Button.Text>
            </Button>
          )}
        </XStack>
      </XStack>

      <Sheet
        modal
        open={isUsersSheetOpen}
        onOpenChange={setIsUsersSheetOpen}
        snapPoints={[50, 80]} 
        dismissOnSnapToBottom
      >
        <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" backgroundColor="$background">
          <YStack gap="$4" flex={1}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$6" fontWeight="bold">Przełącz konto (Dev)</Text>
              <Button size="$2" circular icon={<Ionicons name="close" size={20} />} onPress={() => setIsUsersSheetOpen(false)} />
            </XStack>

            {isLoadingUsers ? (
              <YStack padding="$8" alignItems="center"><Spinner size="large" color="#FF2A85" /></YStack>
            ) : (
              <ScrollView>
                <YStack gap="$2">
                  {allUsers?.map((u) => {
                    const badge = getRoleBadge(u.role);
                    return (
                      <ListItem
                        key={u.id}
                        title={u.name}
                        subTitle={`@${u.instagramName}`}
                        onPress={() => {
                          loginAs(u.name); // Twoja funkcja logująca z useAuth
                          setIsUsersSheetOpen(false);
                        }}
                        icon={
                          <Avatar circular size="$4">
                            {/* <Avatar.Image src={u.photoUrl || `https://i.pravatar.cc/150?u=${u.id}`} /> */}
                            <Avatar.Image src={`https://i.pravatar.cc/150?u=${u.id}`} />
                            <Avatar.Fallback backgroundColor="$gray4" />
                          </Avatar>
                        }
                        iconAfter={
                          <XStack backgroundColor={badge.color as any} paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                            <Text color="white" fontSize="$1" fontWeight="800">{badge.label}</Text>
                          </XStack>
                        }
                      />
                    );
                  })}
                </YStack>
              </ScrollView>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};