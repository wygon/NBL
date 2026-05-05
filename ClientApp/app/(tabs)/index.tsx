import { useAuth } from '@/src/contexts/AuthContext';
import { UserRole } from '@/src/hooks/useArtists';
import { useNotifications } from '@/src/hooks/useNotifications';
import { useUsers } from '@/src/hooks/useUsers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Avatar, Button, Card, H4, Image, Paragraph, ScrollView, Spinner, Text, XStack, YStack } from 'tamagui';

const RECOMMENDED_NAILS = [
  { id: 1, title: 'Czerwony Klasyk', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=300&q=80' },
  { id: 2, title: 'Wiosenny French', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80' },
  { id: 3, title: 'Babyboomer', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80' },
];

const FAVORITE_NAILS = [
  { id: 1, stylist: 'Anna Maria', service: 'Manicure Hybrydowy', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=300&q=80' },
  { id: 2, stylist: 'Julia Nowak', service: 'Zdobienia 3D', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80' },
];

export default function DashboardScreen() {
  const router = useRouter();
  
  const { isAuthenticated, user } = useAuth();
  const { data: users, isLoading: isLoadingUsers } = useUsers();
  const { data: notifications } = useNotifications();

  const notificationsCount = notifications?.length || 0;

  const artists = users?.filter(
    (u) => u.role === UserRole.Artist || u.role === ('Artist' as any) || u.role === UserRole.Manager || u.role === ('Manager' as any)
  ) || [];

  return (
    <ScrollView backgroundColor="$background">
      <YStack padding="$4" gap="$5">

        {/* 1. SEKCJA: SZYBKA NAWIGACJA */}
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold" color="$color">
            {isAuthenticated ? `Cześć, ${user?.name}! Co robimy?` : 'Co chcesz dzisiaj zrobić?'}
          </Text>

          <XStack gap="$3" flexWrap="wrap">
            {/* Przycisk: Nowa Wizyta (Widoczny dla wszystkich) */}
            <Button
              flex={1}
              height={100}
              backgroundColor="#FF2A85"
              flexDirection="column"
              onPress={() => router.push('/new-appointment')}
            >
              <Ionicons name="add-circle-outline" size={28} color="white" />
              <Button.Text color="white" marginTop="$2" fontSize="$3">Nowa wizyta</Button.Text>
            </Button>

            {/* Przycisk warunkowy: Historia dla zalogowanych, Zaloguj dla gości */}
            {isAuthenticated ? (
              <Button
                flex={1}
                height={100}
                theme="alt1"
                flexDirection="column"
                onPress={() => router.push('/visits')}
              >
                <Ionicons name="time-outline" size={28} color="$color" />
                <Button.Text marginTop="$2" fontSize="$3">Historia</Button.Text>
              </Button>
            ) : (
              <Button
                flex={1}
                height={100}
                theme="alt1"
                flexDirection="column"
                onPress={() => router.push('/visits')} 
              >
                <Ionicons name="person-circle-outline" size={28} color="$color" />
                <Button.Text marginTop="$2" fontSize="$3">Zaloguj się</Button.Text>
              </Button>
            )}
          </XStack>

          {/* Przycisk: Powiadomienia (TYLKO ZALOGOWANI) */}
          {isAuthenticated && (
            <XStack gap="$3">
              <Button
                flex={1}
                theme="alt2"
                iconAfter={<Ionicons name="notifications-outline" size={20} color="$color" />}
                onPress={() => router.push('/notifications')}
              >
                <Button.Text>Powiadomienia ({notificationsCount})</Button.Text>
              </Button>
            </XStack>
          )}
        </YStack>

        {/* --- PROGRAM LOJALNOŚCIOWY: TYLKO ZALOGOWANI --- */}
        {isAuthenticated && (
          <Card backgroundColor="$color.pink2Light" borderWidth={1} borderColor="#FF2A85" padding="$4" borderRadius="$4">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <H4 color="#FF2A85">Twój status lojalnościowy</H4>
              <Ionicons name="star" size={24} color="#FF2A85" />
            </XStack>
            <Text color="$gray10" fontSize="$3" marginBottom="$3">
              Brakuje Ci tylko 1 wizyty do zniżki -15% na wybraną usługę!
            </Text>
            <XStack height={10} backgroundColor="$gray5" borderRadius="$4" overflow="hidden">
              <XStack width="80%" backgroundColor="#FF2A85" height="100%" />
            </XStack>
            <XStack justifyContent="space-between" marginTop="$2">
              <Text fontSize="$2" color="$gray10">0</Text>
              <Text fontSize="$2" color="$gray10">5 wizyt</Text>
            </XStack>
          </Card>
        )}

        {/* --- SEKCJA: POLECANE INSPIRACJE (Dla wszystkich) --- */}
        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="bold" color="$color">Polecane dla Ciebie</Text>
            <Button size="$2" chromeless><Button.Text color="#FF2A85">Zobacz więcej</Button.Text></Button>
          </XStack>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$3" paddingBottom="$2">
              {RECOMMENDED_NAILS.map((item) => (
                <Card key={item.id} width={140} borderRadius="$4" overflow="hidden" pressStyle={{ scale: 0.98 }}>
                  <Image src={item.img} width={140} height={140} />
                  <Button
                    circular
                    size="$3"
                    position="absolute"
                    top="$2"
                    right="$2"
                    backgroundColor="rgba(255, 255, 255, 0.8)"
                    icon={<Ionicons name="heart-outline" size={20} color="#FF2A85" />}
                  />
                  <YStack padding="$2" backgroundColor="$background" borderWidth={1} borderTopWidth={0} borderColor="$borderColor" borderBottomLeftRadius="$4" borderBottomRightRadius="$4">
                    <Text fontSize="$3" fontWeight="bold" textAlign="center" numberOfLines={1}>{item.title}</Text>
                  </YStack>
                </Card>
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        {/* --- SEKCJA: MOJE ULUBIONE ZDOBIENIA (TYLKO ZALOGOWANI) --- */}
        {isAuthenticated && FAVORITE_NAILS.length > 0 && (
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="bold" color="$color">Zapisane inspiracje</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$3" paddingBottom="$2">
                {FAVORITE_NAILS.map((item) => (
                  <Card key={item.id} width={200} borderRadius="$4" overflow="hidden" borderWidth={1} borderColor="$borderColor">
                    <XStack>
                      <Image src={item.img} width={80} height={80} />
                      <YStack padding="$2" justifyContent="center" flex={1}>
                        <Text fontSize="$3" fontWeight="bold" numberOfLines={1}>{item.service}</Text>
                        <XStack alignItems="center" gap="$1" marginTop="$1">
                          <Ionicons name="person-outline" size={14} color="$gray10" />
                          <Text fontSize="$2" color="$gray10" numberOfLines={1}>{item.stylist}</Text>
                        </XStack>
                      </YStack>
                    </XStack>
                  </Card>
                ))}
              </XStack>
            </ScrollView>
          </YStack>
        )}

        {/* 2. SEKCJA: NASZE STYLISTKI (Z API) */}
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold" color="$color">Nasze Stylistki</Text>

          {isLoadingUsers ? (
            <YStack padding="$4" alignItems="center">
               <Spinner size="large" color="#FF2A85" />
            </YStack>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$4">
                {artists.map((stylist) => (
                  <Card
                    key={stylist.id}
                    width={160}
                    borderWidth={1}
                    borderColor="$borderColor"
                    padding="$3"
                    alignItems="center"
                    gap="$2"
                    pressStyle={{ scale: 0.95 }}
                  >
                    <Avatar circular size="$8">
                      {/* Jeśli nie ma zdjęcia w bazie, generujemy fallback z pravatar */}
                      <Avatar.Image src={stylist.photoUrl || `https://i.pravatar.cc/150?u=${stylist.id}`} />
                      <Avatar.Fallback backgroundColor="$gray5" />
                    </Avatar>
                    <YStack alignItems="center">
                      <Text textAlign="center" fontWeight="bold" fontSize="$3" numberOfLines={1}>{stylist.name}</Text>
                      {/* Zamiast roli 'Artist' można pokazywać np. Instagram */}
                      <Text textAlign="center" fontSize="$2" color="$gray10" numberOfLines={1}>
                        @{stylist.instagramName || 'stylistka'}
                      </Text>
                    </YStack>
                    <Button size="$2" marginTop="$2" chromeless borderBottomWidth={1} borderColor="$pink10">
                      <Button.Text color="#FF2A85">Zobacz profil</Button.Text>
                    </Button>
                  </Card>
                ))}
              </XStack>
            </ScrollView>
          )}
        </YStack>

        {/* 3. SEKCJA: PROMOCJA / INFO */}
        <Card backgroundColor="#FFF0F5" borderWidth={1} borderColor="$borderColor" padding="$4" borderLeftWidth={5} borderLeftColor="#FF2A85">
          <YStack gap="$1">
            <H4 color="#FF2A85">Promocja wiosenna!</H4>
            <Paragraph color="black" fontSize="$3">
              Zrób manicure i pedicure w jednym terminie, a otrzymasz -20% na zdobienia!
            </Paragraph>
          </YStack>
        </Card>

        {/* --- SEKCJA: PORADY --- */}
        <Card theme="alt2" padding="$4" borderRadius="$4">
          <XStack alignItems="center" gap="$3">
            <YStack backgroundColor="$background" padding="$2" borderRadius={100}>
              <Ionicons name="sparkles" size={24} color="#FF2A85" />
            </YStack>
            <YStack flex={1}>
              <Text fontWeight="bold" fontSize="$4">Wskazówka na dziś</Text>
              <Text color="$gray10" fontSize="$3" marginTop="$1">
                Pamiętaj o codziennym oliwkowaniu skórek! Przedłuży to trwałość Twojego manicure.
              </Text>
            </YStack>
          </XStack>
        </Card>

      </YStack>
    </ScrollView>
  );
}