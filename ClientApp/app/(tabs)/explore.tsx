import { YStack, XStack, Text, Card, ScrollView } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

// Sztuczne dane na potrzeby layoutu
const MOCK_APPOINTMENTS = [
  { id: 1, service: 'Manicure Hybrydowy', date: '25 Marca 2026', time: '14:30', status: 'Potwierdzona' },
  { id: 2, service: 'Przedłużanie Żelowe', date: '10 Kwietnia 2026', time: '10:00', status: 'Oczekująca' },
];

export default function AppointmentsListScreen() {
  return (
    <ScrollView backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        
        <Text fontSize="$8" fontWeight="bold" color="$color" marginBottom="$2">
          Moje wizyty
        </Text>

        {/* Mapowanie po naszej sztucznej liście */}
        {MOCK_APPOINTMENTS.map((item) => (
          <Card key={item.id} size="$4" shadowColor="black" shadowRadius={5} shadowOpacity={0.1} elevation={2} animationName="bouncy" pressStyle={{ scale: 0.98 }}>
            <Card.Header padding="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$5" fontWeight="bold" color="$color">
                  {item.service}
                </Text>
                {/* Znaczek statusu */}
                <Text fontSize="$2" color={item.status === 'Potwierdzona' ? 'green' : 'orange'} fontWeight="bold">
                  {item.status}
                </Text>
              </XStack>
            </Card.Header>

            <Card.Footer padding="$3" paddingTop={0}>
              <YStack gap="$1">
                <XStack gap="$2" alignItems="center">
                  <Ionicons name="calendar-outline" size={16} color="gray" />
                  <Text color="$gray10">{item.date}</Text>
                </XStack>
                <XStack gap="$2" alignItems="center">
                  <Ionicons name="time-outline" size={16} color="gray" />
                  <Text color="$gray10">{item.time}</Text>
                </XStack>
              </YStack>
            </Card.Footer>
          </Card>
        ))}

      </YStack>
    </ScrollView>
  );
}