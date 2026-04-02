import { YStack, XStack, Text, Card, ScrollView, Button, Avatar, H4, Paragraph } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Dane naszych stylistek
const STYLISTS = [
  { id: 1, name: 'Anna Maria', role: 'Top Stylistka', img: 'https://i.pravatar.cc/150?u=anna' },
  { id: 2, name: 'Katarzyna Brzezińska', role: 'Manicure Hybrydowy', img: 'https://i.pravatar.cc/150?u=kate' },
  { id: 3, name: 'Julia Nowak', role: 'Zdobienia Artystyczne', img: 'https://i.pravatar.cc/150?u=julia' },
];

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <ScrollView backgroundColor="$background">
      <YStack padding="$4" gap="$5">
        
        {/* 1. SEKCJA: SZYBKA NAWIGACJA (Menu kaflowe) */}
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold" color="$color">Co chcesz dzisiaj zrobić?</Text>
          
          <XStack gap="$3" flexWrap="wrap">
            {/* Przycisk: Nowa Wizyta */}
            <Button 
              flex={1} 
              height={100} 
              backgroundColor="#FF2A85" 
              flexDirection="column"
              onPress={() => router.push('/')} // Zmień na ścieżkę do formularza jeśli masz osobno
            >
              <Ionicons name="add-circle-outline" size={28} color="white" />
              <Button.Text color="white" marginTop="$2" fontSize="$3">Nowa wizyta</Button.Text>
            </Button>

            {/* Przycisk: Historia */}
            <Button 
              flex={1} 
              height={100} 
              theme="alt1" 
              flexDirection="column"
              onPress={() => router.push('/explore')}
            >
              <Ionicons name="time-outline" size={28} color="$color" />
              <Button.Text marginTop="$2" fontSize="$3">Historia</Button.Text>
            </Button>
          </XStack>

          <XStack gap="$3">
             {/* Przycisk: Powiadomienia */}
             <Button 
              flex={1} 
              theme="alt2" 
              iconAfter={<Ionicons name="notifications-outline" size={20} color="$color" />}
            >
              <Button.Text>Powiadomienia (2)</Button.Text>
            </Button>
          </XStack>
        </YStack>

        {/* 2. SEKCJA: NASZE STYLISTKI (Pozioma lista) */}
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="bold" color="$color">Nasze Stylistki</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$4">
              {STYLISTS.map((stylist) => (
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
                    <Avatar.Image src={stylist.img} />
                    <Avatar.Fallback backgroundColor="$gray5" />
                  </Avatar>
                  <YStack alignItems="center">
                    <Text textAlign="center" fontWeight="bold" fontSize="$3">{stylist.name}</Text>
                    <Text textAlign="center" fontSize="$2" color="$gray10">{stylist.role}</Text>
                  </YStack>
                  <Button size="$2" marginTop="$2" chromeless borderBottomWidth={1} borderColor="$pink10">
                    <Button.Text color="#FF2A85">Zobacz profil</Button.Text>
                  </Button>
                </Card>
              ))}
            </XStack>
          </ScrollView>
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

      </YStack>
    </ScrollView>
  );
}