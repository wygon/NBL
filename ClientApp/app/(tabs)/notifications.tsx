import { Accordion, YStack, Text, Paragraph, Square, ScrollView, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

// Przykładowe dane powiadomień
const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Przypomnienie o wizycie',
    date: 'Dzisiaj, 12:00',
    content: 'Przypominamy o Twojej wizycie u Anny Marii jutro o godzinie 14:30. Prosimy o przybycie 5 minut wcześniej.',
    icon: 'calendar'
  },
  {
    id: '2',
    title: 'Nowa promocja!',
    date: 'Wczoraj',
    content: 'Tylko w tym tygodniu: -20% na wszystkie zdobienia artystyczne przy rezerwacji online!',
    icon: 'gift'
  },
  {
    id: '3',
    title: 'Status płatności',
    date: '2 dni temu',
    content: 'Twoja przedpłata za wizytę w dniu 25.03 została pomyślnie zaksięgowana. Dziękujemy!',
    icon: 'checkmark-circle'
  }
];

export default function NotificationsScreen() {
  return (
    <ScrollView backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="$color" marginBottom="$2">
          Powiadomienia
        </Text>

        {/* Komponent Accordion */}
        <Accordion overflow="hidden" width="100%" type="multiple" gap="$3">
          {NOTIFICATIONS.map((item) => (
            <Accordion.Item key={item.id} value={item.id} borderWidth={1} borderColor="$borderColor" borderRadius="$4">
              
              {/* NAGŁÓWEK (Trigger) */}
              <Accordion.Trigger flexDirection="row" justifyContent="space-between" padding="$3" focusStyle={{ backgroundColor: '$backgroundHover' }}>
                {({ open }: { open: boolean }) => (
                  <XStack gap="$3" alignItems="center" flex={1}>
                    <Square size="$3" backgroundColor="#FFF0F5" borderRadius="$2">
                      <Ionicons name={item.icon as any} size={18} color="#FF2A85" />
                    </Square>
                    <YStack flex={1}>
                      <Text fontWeight="bold" color="$color">{item.title}</Text>
                      <Text fontSize="$2" color="$gray10">{item.date}</Text>
                    </YStack>
                    <Ionicons 
                        name={open ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color="$gray10" 
                    />
                  </XStack>
                )}
              </Accordion.Trigger>

              {/* TREŚĆ (Content) */}
              <Accordion.Content backgroundColor="$background" padding="$3" borderTopWidth={1} borderTopColor="$borderColor">
                <Paragraph color="$color" fontSize="$3">
                  {item.content}
                </Paragraph>
              </Accordion.Content>
              
            </Accordion.Item>
          ))}
        </Accordion>
      </YStack>
    </ScrollView>
  );
}