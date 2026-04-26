import { useArtists, UserRole } from '@/src/hooks/useArtists';
import { AppointmentDto } from '@/src/types/appointment';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Button, Input, Label, ScrollView, Sheet, Spinner, Text, TextArea, XStack, YStack } from 'tamagui';

interface EditAppointmentSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentDto | null;
  onSaveAndAccept: (updatedAppointment: AppointmentDto) => void;
  isManager?: boolean; // Dodane, aby wiedzieć, czy pokazać wybór artysty
}

export function EditAppointmentSheet({
  isOpen,
  onOpenChange,
  appointment,
  onSaveAndAccept,
  isManager = false
}: EditAppointmentSheetProps) {
  // Lokalne stany do edycji
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [artistNote, setArtistNote] = useState('');

  // Nowe stany dla Managera i Statusu
  const [status, setStatus] = useState('');
  const [artistId, setArtistId] = useState<number | null>(null);

  const { data: artists, isLoading: artistsLoading } = useArtists();

  // Synchronizacja po otwarciu
  useEffect(() => {
    if (appointment) {
      setDate(appointment.from ? dayjs(appointment.from).format('DD.MM.YYYY') : dayjs().format('DD.MM.YYYY'));
      setTime(appointment.from ? dayjs(appointment.from).format('HH:mm') : '12:00');

      setPrice(appointment.totalPrice?.toString() || '0');
      setDuration(appointment.totalDurationInMinutes?.toString() || '60');
      setArtistNote(appointment.additionalNotesArtist || '');

      // Inicjalizacja nowych pól
      setStatus(appointment.status || 'Requested'); // Zależnie jak u Ciebie nazywają się statusy
      setArtistId(appointment.artistId || null);
    }
  }, [appointment, isOpen]);

  const handleSave = () => {
    if (!appointment) return;

    // Próba parsowania daty
    const [day, month, year] = date.split('.');
    const [hour, minute] = time.split(':');
    const finalFrom = dayjs(`${year}-${month}-${day}T${hour}:${minute}:00`).toISOString();
    const finalTo = dayjs(finalFrom).add(parseInt(duration), 'minute').toISOString();

    const updatedData: AppointmentDto = {
      ...appointment,
      status: status, // Używamy statusu wybranego z przycisków
      from: finalFrom,
      to: finalTo,
      totalPrice: parseFloat(price),
      totalDurationInMinutes: parseInt(duration),
      additionalNotesArtist: artistNote,
      artistId: artistId, // Przypisanie artysty
    };

    onSaveAndAccept(updatedData);
    onOpenChange(false);
  };

  if (!appointment) return null;

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onOpenChange}
      snapPoints={[85]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" backgroundColor="$background">
        <ScrollView>
          <YStack gap="$4">
            <Text fontSize="$6" fontWeight="bold">Ustalanie szczegółów wizyty</Text>

            <YStack>
              <Text color="$gray10" fontSize="$3">Usługa:</Text>
              <Text fontWeight="bold" fontSize="$5">{appointment.service?.name}</Text>
            </YStack>

            {/* SEKCJA STATUSU */}
            <YStack gap="$2">
              <Label fontSize="$3" fontWeight="bold">Status wizyty:</Label>
              <XStack flexWrap="wrap" gap="$2">
                {/* Zmień te stringi, aby pasowały do tego, czego oczekuje Twój backend (np. 'ConfirmedStatus') */}
                {['Requested', 'Confirmed', 'Completed', 'Cancelled'].map((statusOption) => (
                  <Button
                    key={statusOption}
                    size="$2"
                    theme={status === statusOption ? 'active' : undefined}
                    onPress={() => setStatus(statusOption)}
                    backgroundColor={status === statusOption ? '#FF2A85' : '$gray5'}
                  >
                    <Button.Text color={status === statusOption ? 'white' : '$color'}>
                      {statusOption === 'Requested' && 'Prośba'}
                      {statusOption === 'Confirmed' && 'Potwierdzona'}
                      {statusOption === 'Completed' && 'Zakończona'}
                      {statusOption === 'Cancelled' && 'Anulowana'}
                    </Button.Text>
                  </Button>
                ))}
              </XStack>
            </YStack>

            {/* SEKCJA PRZYPISANIA ARTYSTY (Tylko dla Managera) */}
            {/* {isManager && (
              <YStack gap="$2" marginTop="$2">
                <Label fontSize="$3" fontWeight="bold">Przypisz do artysty:</Label>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap="$2" paddingBottom="$2">
                    <Button
                      size="$3"
                      onPress={() => setArtistId(null)}
                      theme={artistId === null ? 'active' : undefined}
                      backgroundColor={artistId === null ? '#38B2AC' : '$gray5'}
                    >
                      <Button.Text color={artistId === null ? 'white' : '$color'}>
                        Brak (Do wzięcia)
                      </Button.Text>
                    </Button>

                    {mockArtists.map((artist) => (
                      <Button
                        key={artist.id}
                        size="$3"
                        onPress={() => setArtistId(artist.id)}
                        theme={artistId === artist.id ? 'active' : undefined}
                        backgroundColor={artistId === artist.id ? '#FF2A85' : '$gray5'}
                      >
                        <Button.Text color={artistId === artist.id ? 'white' : '$color'}>
                          {artist.name}
                        </Button.Text>
                      </Button>
                    ))}
                  </XStack>
                </ScrollView>
              </YStack>
            )} */}
            {isManager && (
              <YStack gap="$2" marginTop="$2">
                <Label fontSize="$3" fontWeight="bold">Przypisz do artysty:</Label>

                {artistsLoading ? (
                  <Spinner color="#FF2A85" />
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <XStack gap="$2" paddingBottom="$2">

                      {/* Przycisk resetu przypisania */}
                      <Button
                        size="$3"
                        onPress={() => setArtistId(null)}
                        backgroundColor={artistId === null ? '#38B2AC' : '$gray5'}
                      >
                        <Text color={artistId === null ? 'white' : '$color'}>
                          Brak (Do wzięcia)
                        </Text>
                      </Button>

                      {/* Dynamiczna lista artystów z Twojego API */}
                      {artists?.map((artist) => {
                        const isSelected = artistId === artist.id;

                        // Przykład logiki opartej na roli:
                        const roleLabel = artist.role === UserRole.Manager ? " (Manager)" : "";

                        return (
                          <Button
                            key={artist.id}
                            size="$3"
                            onPress={() => setArtistId(artist.id)}
                            backgroundColor={isSelected ? '#FF2A85' : '$gray5'}
                            // Możesz dodać ikonkę jeśli to manager
                            icon={artist.role === UserRole.Manager ? <Ionicons name="star" size={12} color="gold" /> : undefined}
                          >
                            <Text color={isSelected ? 'white' : '$color'}>
                              {artist.name}{roleLabel}
                            </Text>
                          </Button>
                        );
                      })}
                    </XStack>
                  </ScrollView>
                )}
              </YStack>
            )}
            {/* SEKTA PROPOZYCJI KLIENTA */}
            {appointment.requestedDates && appointment.requestedDates.length > 0 && (
              <YStack backgroundColor="$gray2" padding="$3" borderRadius="$3" gap="$2">
                <Text fontSize="$2" fontWeight="bold" color="$gray11">Klient prosił o (proponowane zakresy):</Text>
                <YStack gap="$1.5">
                  {appointment.requestedDates.map((rd, i) => (
                    <XStack key={i} alignItems="center" gap="$2">
                      <Ionicons name="calendar-outline" size={14} color="#FF2A85" />
                      <Text fontSize="$3" color="#FF2A85" fontWeight="bold">
                        {dayjs(rd.from).format('DD.MM')}
                      </Text>
                      <Text fontSize="$3" color="$color">
                        w godzinach: {dayjs(rd.from).format('HH:mm')} – {dayjs(rd.to).format('HH:mm')}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </YStack>
            )}

            {/* RĘCZNE WPISYWANIE DATY I GODZINY */}
            <YStack gap="$2">
              <Label>Termin wizyty (ustalony z klientem):</Label>
              <XStack gap="$2">
                <Input
                  flex={1}
                  value={date}
                  onChangeText={setDate}
                  placeholder="DD.MM.YYYY"
                  keyboardType="numeric"
                />
                <Input
                  flex={1}
                  value={time}
                  onChangeText={setTime}
                  placeholder="HH:MM"
                  keyboardType="numeric"
                />
              </XStack>
            </YStack>

            {/* KWOTA I CZAS */}
            <XStack gap="$2">
              <YStack flex={1} gap="$2">
                <Label>Cena (zł):</Label>
                <Input value={price} onChangeText={setPrice} keyboardType="numeric" />
              </YStack>
              <YStack flex={1} gap="$2">
                <Label>Czas (min):</Label>
                <Input value={duration} onChangeText={setDuration} keyboardType="numeric" />
              </YStack>
            </XStack>

            {/* NOTATKA */}
            <YStack gap="$2">
              <Label>Notatka dla klienta / wewnętrzna:</Label>
              <TextArea
                value={artistNote}
                onChangeText={setArtistNote}
                placeholder="Dodatkowe informacje o wizycie..."
                minHeight={80}
              />
            </YStack>

            {/* UWAGI KLIENTA */}
            {appointment.additionalNotesUser && (
              <YStack backgroundColor="$gray3" padding="$3" borderRadius="$3" gap="$1">
                <Text fontSize="$2" color="$gray11">Pierwotne uwagi klienta:</Text>
                <Text fontStyle="italic">"{appointment.additionalNotesUser}"</Text>
              </YStack>
            )}

            {/* PRZYCISKI */}
            <XStack gap="$3" marginTop="$4" paddingBottom="$8">
              <Button flex={1} onPress={() => onOpenChange(false)} backgroundColor="$gray5">
                Anuluj
              </Button>
              <Button flex={1} onPress={handleSave} backgroundColor="#FF2A85">
                <Text color="white" fontWeight="bold">Zapisz i Akceptuj</Text>
              </Button>
            </XStack>

          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}