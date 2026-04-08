import React, { useState } from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl } from 'react-native';
import { YStack, XStack, Text, Card, Button, Separator, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query'; // <--- IMPORT TANSTACK
import { AppointmentDto } from '@/src/constants/DTOs/appointmentdto';
import { apiClient } from '@/src/api/apiClient';
import { ApiRoutes } from '@/src/constants/apiRoutes';
import { SERVICE_NAMES } from '@/src/constants/serviceNames';
import { EditAppointmentSheet } from '@/components/EditAppointmentSheet';

const handleSaveAndAccept = async (updatedData: AppointmentDto) => {
  try {
    // 1. Wyślij request typu PUT/PATCH do API, np.:
    // await apiClient.put(`/api/appointments/${updatedData.id}`, updatedData);

    // 2. Odśwież listę wizyt (jeśli używasz TanStack Query, wywołaj refetch)
    // await refetch();

    console.log('Zapisano zaktualizowaną wizytę:', updatedData);
  } catch (error) {
    console.error('Błąd podczas akceptacji wizyty', error);
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed': return '$green10';
    case 'Requested': return '$orange10';
    case 'Canceled': return '$red10';
    case 'Finished': return '$gray10';
    default: return '$color';
  }
};

const formatDateTime = (isoString: string | null) => {
  if (!isoString) return { date: 'Brak daty', time: '--:--' };
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }),
    time: d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
  };
};

// 1. Zewnętrzna funkcja fetchująca dla React Query
const fetchAppointmentsPage = async ({ pageParam = 1 }) => {
  // Przekazujemy pageParam (stronę) i limit (Count) do zapytania GET
  const response = await apiClient.get(ApiRoutes.Appointments.GetAll, {
    params: {
      Page: pageParam,
      Count: 10 // Pobieramy po 10 wizyt naraz
    }
  });
  return response.data; // Zwraca np. { appointments: [...] }
};

export default function AppointmentsListScreen() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // <--- NOWY STAN

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);

  const openEditModal = (appointment: AppointmentDto) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  // 2. Konfiguracja useInfiniteQuery
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,       // Funkcja ładująca kolejną stronę
    hasNextPage,         // Czy jest coś jeszcze do załadowania?
    isFetchingNextPage,  // Czy aktualnie pobiera kolejną stronę?
    refetch
  } = useInfiniteQuery({
    queryKey: ['appointments', 'all'], // Klucz w cache
    queryFn: fetchAppointmentsPage,
    initialPageParam: 1, // Zaczynamy od strony 1
    getNextPageParam: (lastPage, allPages) => {
      // Jeśli backend zwrócił mniej niż 10 elementów, to znaczy, że to ostatnia strona
      // Dostosuj ten warunek, jeśli Twój backend zwraca np. { hasNextPage: boolean }
      if (lastPage.appointments?.length === 10) {
        return allPages.length + 1; // Zwróć numer następnej strony
      }
      return undefined; // Zwróć undefined, jeśli nie ma więcej stron (zatrzymuje scrollowanie)
    },
  });

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true); // Pokaż kółeczko
    await refetch();       // Wymuś pobranie danych z API od nowa
    setIsRefreshing(false); // Schowaj kółeczko po zakończeniu
  };

  // 3. React Query zwraca "strony", musimy je spłaszczyć do jednej tablicy
  const allAppointments = data?.pages.flatMap(page => page.appointments) || [];

  // 4. Komponent renderujący pojedynczy element listy (dla FlatList)
  const renderItem = ({ item }: ListRenderItemInfo<AppointmentDto>) => {
    const isExpanded = expandedId === item.id;
    const { date, time } = formatDateTime(item.from);

    return (
      <Card
        size="$4"
        shadowColor="black"
        shadowRadius={5}
        shadowOpacity={0.1}
        elevation={2}
        pressStyle={{ scale: 0.98 }}
        onPress={() => toggleExpand(item.id)}
        marginBottom="$3" // Odstęp między kartami
      >
        <Card.Header padding="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="bold" color="$color">
              {item.nailService != null ? SERVICE_NAMES[item.nailService as any] : 'Usługa do ustalenia'}
            </Text>
            <Text fontSize="$3" color={getStatusColor(item.status)} fontWeight="bold">
              {item.status}
            </Text>
          </XStack>
        </Card.Header>

        <Card.Footer padding="$3" paddingTop={0} flexDirection="column">
          <YStack gap="$1">
            <XStack gap="$2" alignItems="center">
              <Ionicons name="calendar-outline" size={16} color="gray" />
              <Text color="$gray10">{date}</Text>
            </XStack>
            <XStack gap="$2" alignItems="center">
              <Ionicons name="time-outline" size={16} color="gray" />
              <Text color="$gray10">{time}</Text>
            </XStack>
          </YStack>

          {isExpanded && (
            <YStack gap="$3" marginTop="$3">
              <Separator />
              <YStack gap="$1">
                {item.nailForm && <Text fontSize="$3" color="$gray11">Kształt: <Text fontWeight="bold">{item.nailForm}</Text></Text>}
                {item.nailSize && <Text fontSize="$3" color="$gray11">Długość: <Text fontWeight="bold">{item.nailSize}</Text></Text>}
                {item.nailAddons && item.nailAddons.length > 0 && (
                  <Text fontSize="$3" color="$gray11">Dodatki: <Text fontWeight="bold">{item.nailAddons.join(', ')}</Text></Text>
                )}
                {item.additionalNotesUser && (
                  <YStack backgroundColor="$gray3" padding="$2" borderRadius="$2" marginTop="$2">
                    <Text fontSize="$3" fontStyle="italic" color="$gray11">"{item.additionalNotesUser}"</Text>
                  </YStack>
                )}
              </YStack>

              <XStack gap="$2" marginTop="$2" flexWrap="wrap">
                {item.status === 'Requested' && (
                  <Button
                    size="$3"
                    theme="active" // Jakiś wyraźny kolor, np. niebieski/fioletowy
                    flex={1}
                    onPress={(e) => {
                      e.stopPropagation();
                      openEditModal(item); // Otwieramy nasze nowe okno, przekazując dane wizyty
                    }}
                  >
                    Rozpatrz
                  </Button>
                )}
                {['Requested', 'Confirmed'].includes(item.status) && (
                  <Button size="$3" theme="red" flex={1} onPress={(e) => { e.stopPropagation(); console.log('Anuluj', item.id); }}>
                    Anuluj
                  </Button>
                )}
                {item.status === 'Confirmed' && (
                  <Button size="$3" theme="active" flex={1} onPress={(e) => { e.stopPropagation(); console.log('Zakończ', item.id); }}>
                    Zakończ
                  </Button>
                )}
              </XStack>
            </YStack>
          )}
        </Card.Footer>
      </Card>
    );
  };

  if (isError) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
        <Text color="$red10">Wystąpił błąd podczas pobierania wizyt.</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">

      {isLoading ? (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="#FF2A85" />
        </YStack>
      ) : (
        <FlatList
          data={allAppointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}

          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FF2A85" // Kolor kółeczka na iOS
              colors={['#FF2A85']} // Kolor kółeczka na Androidzie
            />
          }

          // HEADER (Tytuł "Moje wizyty")
          ListHeaderComponent={
            <Text fontSize="$8" fontWeight="bold" color="$color" marginBottom="$4">
              Moje wizyty
            </Text>
          }

          // INFINITE SCROLL LOGIC
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5} // Uruchom pobieranie, gdy zostanie 50% wysokości do końca listy

          // FOOTER (Spinner pokazujący się na dole podczas doczytywania)
          ListFooterComponent={
            isFetchingNextPage ? (
              <YStack padding="$4" alignItems="center">
                <Spinner size="small" color="#FF2A85" />
              </YStack>
            ) : !hasNextPage && allAppointments.length > 0 ? (
              // Pokazujemy tekst tylko wtedy, gdy nie ma więcej stron 
              // i lista nie jest całkowicie pusta
              <YStack padding="$6" alignItems="center">
                <Text color="$gray10" fontSize="$3" fontStyle="italic">
                  To już wszystko! 💅
                </Text>
              </YStack>
            ) : null
          }
        />
      )}
      <EditAppointmentSheet
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        appointment={selectedAppointment}
        onSaveAndAccept={handleSaveAndAccept}
      />
    </YStack>
  );
}