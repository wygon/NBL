import { confirmAppointment, finishAppointment, takeAppointment } from '@/src/api/appointments';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAppointments } from '@/src/hooks/useAppointments';
import { useArtists } from '@/src/hooks/useArtists';
import { useCancelAppointment } from '@/src/hooks/useCancelAppointment';
import { useChangeAppointmentArtist } from '@/src/hooks/useChangeAppointmentArtist';
import { AppointmentDto } from '@/src/types/appointment';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl } from 'react-native';
import { Button, Card, ScrollView, Sheet, Spinner, Text, View, XStack, YStack } from 'tamagui';
import { EditAppointmentSheet } from './EditAppointmentSheet';

export default function ArtistAppointmentsView() {
  const { user, isManager } = useAuth();

  const artistId = user?.id || 0;

  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'unassigned' | 'all_artists'>('mine');
  const [selectedForEdit, setSelectedForEdit] = useState<AppointmentDto | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [isAssignSheetOpen, setIsAssignSheetOpen] = useState(false);
  const [appointmentToAssign, setAppointmentToAssign] = useState<number | null>(null);
  const { mutateAsync: changeArtist } = useChangeAppointmentArtist(() => {
    setIsAssignSheetOpen(false);
  });
  const { mutateAsync: cancelAppointment } = useCancelAppointment();

  const { data: artists } = useArtists();

  const queryFilters = {
    artistId: (filterMode === 'mine' || filterMode === 'all') ? artistId : null,
    nullArtist: (filterMode === 'unassigned' || filterMode === 'all') ? true : false,
    page: 1,
    count: 20,
  };

  const { data, isLoading, isFetching, refetch } = useAppointments(queryFilters);
  const appointmentsList = Array.isArray(data) ? data : (data?.appointments || []);

  const handleEditPress = (appointment: AppointmentDto) => {
    setSelectedForEdit(appointment);
    setIsSheetOpen(true);
  };

  const handleSaveUpdatedAppointment = async (updatedFields: Partial<AppointmentDto>) => {
    const payload = { ...updatedFields }
    if (!isManager) updatedFields.artistId = artistId;
    if (!updatedFields.id) return;
    if (!payload.id) return;

    try {
      await confirmAppointment(updatedFields.id, updatedFields);
      setIsSheetOpen(false);
      refetch();
    } catch (error) {
      console.error("Błąd podczas zapisywania wizyty:", error);
      alert("Nie udało się zapisać zmian. Sprawdź połączenie.");
    }
  };

  const handleQuickConfirm = async (appointment: AppointmentDto) => {
    if (!appointment.requestedDates || appointment.requestedDates.length === 0) {
      alert("Brak proponowanych dat. Użyj edycji, aby ustalić termin ręcznie.");
      return;
    }
    const firstDate = appointment.requestedDates[0];
    const payload: Partial<AppointmentDto> = {
      ...appointment,
      status: 'Confirmed',
      from: firstDate.from,
      to: firstDate.to,
    };
    if (!isManager) payload.artistId = artistId;
    await handleSaveUpdatedAppointment(payload);
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

  const handleCancelAppointment = (appointmentId: number) => {
    Alert.alert(
      "Odrzuć wizytę",
      "Czy na pewno chcesz anulować tę prośbę/wizytę?",
      [
        { text: "Wróć", style: "cancel" },
        {
          text: "Anuluj wizytę",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelAppointment(appointmentId);
            } catch (error) {
              console.error("Przechwycono błąd anulowania:", error);
            }
          }
        }
      ]
    );
  };

  const handleAssignArtist = async (selectedArtistId: number) => {
    if (!appointmentToAssign) return;

    try {
      await changeArtist({
        appointmentId: appointmentToAssign,
        newArtistId: selectedArtistId
      });
    } catch (error) {
      console.error("Przechwycono błąd przypisania:", error);
    }
  };

  const handleTakeAppointment = async (appointmentId: number) => {
    try {
      await takeAppointment(appointmentId);
      refetch();
    } catch (error) {
      console.error("Błąd podczas przypisywania wizyty:", error);
      alert("Nie udało się przypisać wizyty do Ciebie. Może ktoś inny już ją wziął?");
    }
  };

  const openAssignSheet = (appointmentId: number) => {
    setAppointmentToAssign(appointmentId);
    setIsAssignSheetOpen(true);
  };

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
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack flex={1} gap="$1">
              {/* STATUS BADGE */}
              <XStack>
                <View
                  backgroundColor={
                    item.status === 'Confirmed' ? '$green5' :
                      item.status === 'Requested' ? '$orange5' :
                        item.status === 'Completed' ? '$blue5' : '$gray5'
                  }
                  paddingHorizontal="$2"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                  borderWidth={1}
                  borderColor={
                    item.status === 'Confirmed' ? '$green8' :
                      item.status === 'Requested' ? '$orange8' :
                        item.status === 'Completed' ? '$blue8' : '$gray8'
                  }
                >
                  <Text
                    fontSize="$1"
                    fontWeight="bold"
                    color={
                      item.status === 'Confirmed' ? '$green10' :
                        item.status === 'Requested' ? '$orange10' :
                          item.status === 'Completed' ? '$blue10' : '$gray10'
                    }
                  >
                    {item.status?.toUpperCase()}
                  </Text>
                </View>
              </XStack>

              <Text fontSize="$3" color="$gray10">
                Klient: {item.customerName || 'Anonim'}
                {isManager && item.artistId != user?.id ? ` • Artysta: ${item.artistName}` : ""}
              </Text>

              <Text fontWeight="bold" fontSize="$5" lineHeight="$5">
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


          {/* DYNAMICZNY PASEK PRZYCISKÓW */}
          <XStack gap="$2" marginTop="$2">
            {!item.artistId ? (
              // --- WIZYTA NIEPRZYPISANA ---
              <XStack flex={1} gap="$2">
                {/* 1. ODRZUĆ / ANULUJ */}
                <Button
                  backgroundColor="#FFE5E5"
                  onPress={(e) => { e.stopPropagation(); handleCancelAppointment(item.id); }}
                  icon={<Ionicons name="trash-outline" size={18} color="#FF3B30" />}
                />

                {/* 2. WEŹ DLA SIEBIE (NOWY PRZYCISK) */}
                <Button
                  flex={1.5}
                  backgroundColor="$blue8" // Wyróżniający się niebieski kolor
                  onPress={(e) => { e.stopPropagation(); handleTakeAppointment(item.id); }}
                  icon={<Ionicons name="hand-right-outline" size={18} color="white" />}
                >
                  <Text color="white" fontWeight="bold" fontSize="$2" numberOfLines={1}>
                    Weź wizytę
                  </Text>
                </Button>

                {/* 3. ZATWIERDŹ PROPOZYCJĘ (Opcjonalne, zostawione dla managera) */}
                {isManager && item.requestedDates && item.requestedDates.length > 0 && (
                  <Button
                    flex={1.5}
                    backgroundColor="#38B2AC"
                    onPress={(e) => { e.stopPropagation(); handleQuickConfirm(item); }}
                    icon={<Ionicons name="checkmark-outline" size={18} color="white" />}
                  >
                    <Text color="white" fontWeight="bold" fontSize="$2" numberOfLines={1}>
                      Zatwierdź
                    </Text>
                  </Button>
                )}

                {/* 4. PRZYPISZ ARTYSTĘ (Szybka akcja Managera) */}
                {isManager && (
                  <Button
                    flex={1}
                    backgroundColor="$gray5"
                    onPress={(e) => { e.stopPropagation(); openAssignSheet(item.id); }}
                    icon={<Ionicons name="person-add-outline" size={16} color="$color" />}
                  >
                    <Text color="$color" fontWeight="bold" fontSize="$2" numberOfLines={1}>Przypisz</Text>
                  </Button>
                )}

                {/* 5. SZCZEGÓŁY / EDYCJA */}
                <Button
                  backgroundColor="transparent"
                  borderWidth={1}
                  borderColor="#FF2A85"
                  paddingHorizontal="$3"
                  onPress={(e) => { e.stopPropagation(); handleEditPress(item); }}
                  icon={<Ionicons name="create-outline" size={18} color="#FF2A85" />}
                />
              </XStack>
            ) : (
              // --- WIZYTA PRZYPISANA ---
              (item.artistId === artistId || isManager) ? (
                <XStack flex={1} gap="$2">
                  <Button
                    backgroundColor="#FFE5E5"
                    onPress={(e) => { e.stopPropagation(); handleCancelAppointment(item.id); }}
                    icon={<Ionicons name="trash-outline" size={18} color="#FF3B30" />}
                  />
                  {item.status === 'Confirmed' && (
                    <Button flex={1} backgroundColor="#38B2AC" onPress={(e) => { e.stopPropagation(); handleFinishAppointment(item.id); }}>
                      <Text color="white" fontWeight="bold">Zakończ</Text>
                    </Button>
                  )}

                  {item.status !== 'Confirmed' && item.status !== 'Completed' && item.status !== 'Cancelled' && (
                    <Button flex={1} backgroundColor="#38B2AC" onPress={(e) => { e.stopPropagation(); handleQuickConfirm(item); }}>
                      <Text color="white" fontWeight="bold" numberOfLines={1}>Potwierdź</Text>
                    </Button>
                  )}

                  <Button flex={1} backgroundColor="transparent" borderWidth={1} borderColor="#FF2A85" onPress={(e) => { e.stopPropagation(); handleEditPress(item); }}>
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
            <Button size="$3" theme={filterMode === 'all_artists' ? 'active' : undefined} onPress={() => setFilterMode('all_artists')}>
              Cały Salon
            </Button>
          )}
          <Button size="$3" theme={filterMode === 'all' ? 'active' : undefined} onPress={() => setFilterMode('all')}>Wszystkie</Button>
          <Button size="$3" theme={filterMode === 'mine' ? 'active' : undefined} onPress={() => setFilterMode('mine')}>Tylko moje</Button>
          <Button size="$3" theme={filterMode === 'unassigned' ? 'active' : undefined} onPress={() => setFilterMode('unassigned')}>Do wzięcia</Button>
        </XStack>
      </ScrollView>

      {isLoading ? (
        <Spinner size="large" color="#FF2A85" />
      ) : (
        <FlatList
          data={appointmentsList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAppointment}
          refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />}
          ListEmptyComponent={<Text textAlign="center" color="$gray10" marginTop="$4">Brak wizyt dla wybranych filtrów.</Text>}
        />
      )}

      {/* SZYBKI PANEL PRZYPISANIA ARTYSTY (Tylko Manager) */}
      <Sheet
        modal={true} // <-- TO JEST KLUCZOWE: Renderuje panel nad wszystkim (nawet TabBarem)
        zIndex={100000} // <-- Upewnia się, że nic go nie przysłoni
        open={isAssignSheetOpen}
        onOpenChange={setIsAssignSheetOpen}
        snapPoints={[40]}
        dismissOnSnapToBottom
      ><Sheet.Overlay backgroundColor="rgba(0,0,0,0.4)" />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" backgroundColor="$background">
          <YStack gap="$4">
            <Text fontSize="$5" fontWeight="bold">Komu przypisać wizytę?</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack gap="$2">
                {artists?.map(artist => (
                  <Button
                    key={artist.id}
                    size="$4"
                    justifyContent="flex-start"
                    backgroundColor="$gray3"
                    onPress={() => handleAssignArtist(artist.id)}
                  >
                    <Ionicons name="person-circle-outline" size={24} color="#FF2A85" />
                    <Text fontWeight="bold" marginLeft="$2">{artist.name}</Text>
                  </Button>
                ))}
              </YStack>
            </ScrollView>
          </YStack>
        </Sheet.Frame>
      </Sheet>

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