import { confirmAppointment, finishAppointment } from '@/src/api/appointments';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAppointments } from '@/src/hooks/useAppointments';
import { AppointmentDto } from '@/src/types/appointment';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Button, Card, ScrollView, Spinner, Text, View, XStack, YStack } from 'tamagui';
import { EditAppointmentSheet } from './EditAppointmentSheet';

export default function ArtistAppointmentsView() {
  const { user, isManager } = useAuth();
  
  const artistId = user?.id || 0;

  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'unassigned' | 'all_artists'>('mine');
  const [selectedForEdit, setSelectedForEdit] = useState<AppointmentDto | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const queryFilters = {
    artistId: filterMode === 'all_artists' || filterMode === 'unassigned' ? null : artistId,
    includeUnassigned: filterMode === 'mine' ? false : true,
    page: 1,
    count: 20,
  };

  const handleEditPress = (appointment: AppointmentDto) => {
    setSelectedForEdit(appointment);
    setIsSheetOpen(true);
  };

  const handleSaveUpdatedAppointment = async (updatedFields: Partial<AppointmentDto>) => {
    if(!isManager) updatedFields.artistId = artistId;
    
    if (!updatedFields.id) return;

    try {
      await confirmAppointment(updatedFields.id, updatedFields);
      setIsSheetOpen(false);
      refetch();
    } catch (error) {
      console.error("Błąd podczas zapisywania wizyty:", error);
      alert("Nie udało się zapisać zmian. Sprawdź połączenie.");
    }
  };

  const handleFinishAppointment = async (appointmentId: number) => {
    try {
      await finishAppointment(appointmentId);
      refetch();
    } catch (error) {
      console.error("Błąd podczas kończenia wizyty:", error);
      alert("Nie udało się zakończyć wizyty. Sprawdź połączenie.");
    }
  };

  const { data, isLoading, isFetching, refetch } = useAppointments(queryFilters);

  const renderAppointment = ({ item }: { item: AppointmentDto }) => {
    const isUnassigned = item.artistId == null;
    const nailSizeLabels = ['S', 'M', 'L', 'XL', 'Mega'];
    const sizeLabel = item.nailSize !== null ? nailSizeLabels[item.nailSize] : '-';

    return (
      <Card
        elevation="$2"
        borderWidth={1}
        marginVertical="$2"
        backgroundColor={isUnassigned ? '#FFF0F5' : '$background'}
        borderColor={isUnassigned ? '#FF2A85' : '$borderColor'}
      >
        <Card.Header padding="$4" paddingBottom="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Text fontSize="$3" color="$gray10">Klient: {item.customerName || 'Anonim'} {isManager && item.artistId != user?.id ? `Artysta:` +  item.artistName : ""}</Text>
              <Text fontWeight="bold" fontSize="$5">
                {item.service?.name} {item.variant ? `(${item.variant.name})` : ''}
              </Text>
            </YStack>

            <YStack alignItems="flex-end">
              <Text fontWeight="bold" color="#FF2A85" fontSize="$5">
                {item.totalPrice} zł
              </Text>
              <XStack alignItems="center" gap="$1">
                <Ionicons name="time-outline" size={12} color="$gray10" />
                <Text fontSize="$2" color="$gray10">
                  {item.totalDurationInMinutes} min
                </Text>
              </XStack>
            </YStack>
          </XStack>
        </Card.Header>

        <Card.Footer flexDirection="column" gap="$3" marginTop="$2" paddingHorizontal="$4" paddingBottom="$4">
          <YStack gap="$1">
            <Text fontSize="$2" color="$gray10">Prośby o termin:</Text>
            <YStack gap="$1">
              {item.requestedDates?.map((d, i) => (
                <XStack key={i} gap="$2" alignItems="center">
                  <View backgroundColor="$gray3" paddingHorizontal="$2" paddingVertical="$0.5" borderRadius="$2">
                    <Text fontSize="$2" fontWeight="bold">
                      {dayjs(d.from).format('DD.MM')}
                    </Text>
                  </View>
                  <Text fontSize="$2" color="$gray11">
                    {dayjs(d.from).format('HH:mm')} - {dayjs(d.to).format('HH:mm')}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </YStack>

          <XStack gap="$2">
            {!item.artistId ? (
              <Button
                flex={1}
                backgroundColor="#FF2A85"
                onPress={(e) => {
                  e.stopPropagation();
                  handleEditPress(item);
                }}
              >
                {isManager ? "Przypisz / Edytuj" : "Przyjmij"}
              </Button>
            ) : (
              (item.artistId === artistId || isManager) ? (
                <XStack flex={1} gap="$2">
                  {item.status !== 'Completed' && item.status !== 'Cancelled' && (
                     <Button
                       flex={1}
                       backgroundColor="#38B2AC"
                       onPress={(e) => {
                         e.stopPropagation();
                         handleFinishAppointment(item.id);
                       }}
                     >
                       <Text color="white" fontWeight="bold">Zakończ</Text>
                     </Button>
                  )}
                  
                  <Button
                    flex={1}
                    backgroundColor="transparent"
                    borderWidth={1}
                    borderColor="#FF2A85"
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditPress(item);
                    }}
                  >
                    <Text color="#FF2A85" fontWeight="bold">Edytuj</Text>
                  </Button>
                </XStack>
              ) : (
                <View flex={1} alignItems="center" paddingVertical="$2" backgroundColor="$gray3" borderRadius="$4">
                  <Text color="$gray10" fontSize="$2">Przypisane do innego artysty</Text>
                </View>
              )
            )}
          </XStack>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <Text fontSize="$6" fontWeight="bold" marginBottom="$4">Panel {isManager ? 'Managera' : 'Stylistki'}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} marginBottom="$4">
        <XStack gap="$2" paddingBottom="$2" paddingHorizontal="$1">
          {isManager && (
            <Button
              size="$3"
              theme={filterMode === 'all_artists' ? 'active' : undefined}
              onPress={() => setFilterMode('all_artists')}
            >
              Cały Salon
            </Button>
          )}
          <Button size="$3" theme={filterMode === 'all' ? 'active' : undefined} onPress={() => setFilterMode('all')}>
            Wszystkie (Moje i Puste)
          </Button>
          <Button size="$3" theme={filterMode === 'mine' ? 'active' : undefined} onPress={() => setFilterMode('mine')}>
            Tylko moje
          </Button>
          <Button size="$3" theme={filterMode === 'unassigned' ? 'active' : undefined} onPress={() => setFilterMode('unassigned')}>
            Do wzięcia
          </Button>
        </XStack>
      </ScrollView>

      {isLoading ? (
        <Spinner size="large" color="#FF2A85" />
      ) : (
        <FlatList
          data={data?.appointments || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAppointment}
          refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />}
          ListEmptyComponent={<Text textAlign="center" color="$gray10" marginTop="$4">Brak wizyt.</Text>}
        />
      )}

      <EditAppointmentSheet
        appointment={selectedForEdit}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSaveAndAccept={handleSaveUpdatedAppointment}
        isManager={isManager} 
      />
    </YStack>
  );
}