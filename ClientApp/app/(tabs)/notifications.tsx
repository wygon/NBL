import { useNotifications } from '@/src/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Accordion, Circle, Paragraph, ScrollView, Spinner, Square, Text, XStack, YStack } from 'tamagui';

// Konfiguracja dat
dayjs.extend(relativeTime);
dayjs.locale('pl');

export default function NotificationsScreen() {
  // 1. Pobieramy dane z API
  const { data: notifications, isLoading, isError } = useNotifications();

  // Obsługa ładowania
  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color="#FF2A85" />
      </YStack>
    );
  }

  // Obsługa błędu lub braku danych
  if (isError || !notifications) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text>Nie udało się załadować powiadomień.</Text>
      </YStack>
    );
  }

  return (
    <ScrollView backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="$color" marginBottom="$2">
          Powiadomienia
        </Text>

        <Accordion overflow="hidden" width="100%" type="multiple" gap="$3">
          {notifications.map((item) => (
            <Accordion.Item 
              key={item.id} 
              value={item.id.toString()} 
              borderWidth={1} 
              // 2. Dynamiczne stylowanie: jeśli nieprzeczytane, obramowanie jest różowe
              borderColor={item.isRead ? "$borderColor" : "#FF2A85"} 
              borderRadius="$4"
            >
              <Accordion.Trigger 
                flexDirection="row" 
                justifyContent="space-between" 
                padding="$3" 
                focusStyle={{ backgroundColor: '$backgroundHover' }}
              >
                {({ open }: { open: boolean }) => (
                  <XStack gap="$3" alignItems="center" flex={1}>
                    <Square 
                      size="$3" 
                      // 3. Ikona zmienia tło jeśli wiadomość jest nowa
                      backgroundColor={item.isRead ? "$gray3" : "#FFF0F5"} 
                      borderRadius="$2"
                    >
                      <Ionicons 
                        // Wybieramy ikonę (możesz dodać logikę ikony na podstawie treści)
                        name={item.isRead ? "mail-open-outline" : "mail"} 
                        size={18} 
                        color="#FF2A85" 
                      />
                    </Square>
                    
                    <YStack flex={1}>
                      <XStack alignItems="center" gap="$2">
                        <Text fontWeight="bold" color="$color">{item.title}</Text>
                        {/* 4. Kropka sygnalizująca nową wiadomość */}
                        {!item.isRead && <Circle size={8} backgroundColor="#FF2A85" />}
                      </XStack>
                      {/* 5. Formatowanie daty na "X minut temu" */}
                      <Text fontSize="$2" color="$gray10">
                        {dayjs(item.created).fromNow()}
                      </Text>
                    </YStack>

                    <Ionicons 
                      name={open ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="$gray10" 
                    />
                  </XStack>
                )}
              </Accordion.Trigger>

              <Accordion.Content backgroundColor="$background" padding="$3" borderTopWidth={1} borderTopColor="$borderColor">
                <Paragraph color="$color" fontSize="$3">
                  {/* Mapujemy Message z Twojego Entity */}
                  {item.message}
                </Paragraph>
                
                {item.redirectUrl && (
                    <Text 
                      marginTop="$2" 
                      color="#FF2A85" 
                      fontWeight="bold" 
                      fontSize="$2"
                    >
                      Kliknij, aby przejść do szczegółów →
                    </Text>
                )}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>

        {/* Jeśli lista jest pusta */}
        {notifications.length === 0 && (
          <YStack alignItems="center" marginTop="$10" opacity={0.5}>
            <Ionicons name="notifications-off-outline" size={48} color="$gray10" />
            <Text marginTop="$2">Brak powiadomień</Text>
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}