import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Card, Button, Separator, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { AppointmentDto } from '@/src/constants/DTOs/appointmentdto'; // Upewnij się, że ścieżka jest poprawna
import axios from 'axios';
import { apiClient } from '@/src/api/apiClient';
import { ApiRoutes } from '@/src/constants/apiRoutes';
import { SERVICE_NAMES } from '@/src/constants/serviceNames';

// Sztuczne dane (Mock)
const MOCK_APPOINTMENTS: AppointmentDto[] = [
  {
    id: 1,
    status: 'Confirmed',
    from: '2026-03-25T14:30:00',
    to: '2026-03-25T16:30:00',
    nailService: 'Manicure Hybrydowy',
    nailSize: 'M',
    nailForm: 'Migdał',
    nailAddons: ['Pyłek', 'Cyrkonie'],
    additionalNotesUser: 'Proszę o delikatne piłowanie',
    additionalNotesArtist: null,
  },
  {
    id: 2,
    status: 'Requested',
    from: '2026-04-10T10:00:00',
    to: '2026-04-10T12:00:00',
    nailService: 'Przedłużanie Żelowe',
    nailSize: 'L',
    nailForm: 'Kwadrat',
    nailAddons: null,
    additionalNotesUser: null,
    additionalNotesArtist: null,
  },
];

// Helper do kolorów statusu
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed': return '$green10';
    case 'Requested': return '$orange10';
    case 'Canceled': return '$red10';
    case 'Finished': return '$gray10';
    default: return '$color';
  }
};

// Nowy helper rozdzielający datę i godzinę, aby pasował do Twojego UI
const formatDateTime = (isoString: string | null) => {
  if (!isoString) return { date: 'Brak daty', time: '--:--' };
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }), // np. 25 marca 2026
    time: d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) // np. 14:30
  };
};

export default function AppointmentsListScreen() {
  // Stan na dane z API
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Stan do rozwijania kart
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // MIEJSCE NA REQUEST DO API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        // TUTAJ ZROBISZ REQUEST, np.:
        const response = await apiClient(ApiRoutes.Appointments.Requested);
        setAppointments(response.data.appointments);
        
        // Poniżej symulacja ładowania danych z mocka (usuń to, gdy wepniesz API)
        // setTimeout(() => {
        //   setAppointments(MOCK_APPOINTMENTS);
        //   setIsLoading(false);
        // }, 800); 
        
        setIsLoading(false);
      } catch (error) {
        console.error('Błąd pobierania wizyt:', error);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <ScrollView>
      <YStack backgroundColor="$background" padding="$4" gap="$4">
        
        <Text fontSize="$8" fontWeight="bold" color="$color" marginBottom="$2">
          Moje wizyty
        </Text>

        {/* Pokazujemy spinner podczas ładowania */}
        {isLoading ? (
          <YStack padding="$4" alignItems="center">
            <Spinner size="large" color="$color" />
          </YStack>
        ) : (
          appointments.map((item) => {
            const isExpanded = expandedId === item.id;
            const { date, time } = formatDateTime(item.from);

            return (
              <Card 
                key={item.id} 
                size="$4" 
                shadowColor="black" 
                shadowRadius={5} 
                shadowOpacity={0.1} 
                elevation={2} 
                pressStyle={{ scale: 0.98 }}
                onPress={() => toggleExpand(item.id)}
              >
                <Card.Header padding="$3">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$5" fontWeight="bold" color="$color">
                      {item.nailService != null ? SERVICE_NAMES[item.nailService] : 'Usługa do ustalenia'}
                    </Text>
                    <Text fontSize="$3" color={getStatusColor(item.status)} fontWeight="bold">
                      {item.status}
                    </Text>
                  </XStack>
                </Card.Header>

                {/* Footer użyty jako pojemnik na detale (według Twojego wzoru) */}
                <Card.Footer padding="$3" paddingTop={0} flexDirection="column">
                  
                  {/* Zawsze widoczne: Data i Godzina */}
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

                  {/* Rozwijana sekcja - renderuje się tylko po kliknięciu */}
                  {isExpanded && (
                    <YStack gap="$3" marginTop="$3">
                      <Separator />
                      
                      {/* Szczegóły usługi */}
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

                      {/* Przyciski akcji z wyciszeniem Propagacji (żeby kliknięcie nie zwinęło karty) */}
                      <XStack gap="$2" marginTop="$2" flexWrap="wrap">
                        {item.status === 'Requested' && (
                          <Button size="$3" theme="green" flex={1} onPress={(e) => { e.stopPropagation(); console.log('Akceptuj', item.id); }}>
                            Akceptuj
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
          })
        )}

      </YStack>
    </ScrollView>
  );
}