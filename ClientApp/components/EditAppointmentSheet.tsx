import React, { useState, useEffect } from 'react';
import { Sheet, YStack, XStack, Text, Button, Input, TextArea, Select } from 'tamagui';
import { AppointmentDto } from '@/src/constants/DTOs/appointmentdto';

interface EditAppointmentSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentDto | null;
  onSaveAndAccept: (updatedAppointment: AppointmentDto) => void;
}

export function EditAppointmentSheet({ isOpen, onOpenChange, appointment, onSaveAndAccept }: EditAppointmentSheetProps) {
  // Lokalne stany do edycji formularza
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [shape, setShape] = useState('');
  const [length, setLength] = useState('');
  const [artistNote, setArtistNote] = useState('');

  // Kiedy otwieramy modal z konkretną wizytą, uzupełniamy formularz jej obecnymi danymi
  useEffect(() => {
    if (appointment) {
      // Tu powinieneś sformatować datę z appointment.from / appointment.to
      setDate(appointment.from ? new Date(appointment.from).toLocaleDateString() : '');
      setTime(appointment.from ? new Date(appointment.from).toLocaleTimeString() : '');
      setShape(appointment.nailForm || '');
      setLength(appointment.nailSize || '');
      setArtistNote(appointment.additionalNotesArtist || '');
    }
  }, [appointment]);

  const handleSave = () => {
    if (!appointment) return;
    
    // Budujemy zaktualizowany obiekt
    const updatedData: AppointmentDto = {
      ...appointment,
      status: 'ConfirmedStatus', // Zmieniamy status na potwierdzony
      nailForm: shape,
      nailSize: length,
      additionalNotesArtist: artistNote,
      // Dodaj logikę parsowania nowej daty i czasu do ISO stringa
    };

    onSaveAndAccept(updatedData);
    onOpenChange(false); // Zamykamy modal
  };

  if (!appointment) return null;

  return (
    <Sheet modal open={isOpen} onOpenChange={onOpenChange} snapPointsMode="fit" dismissOnSnapToBottom>
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">
        
        <Text fontSize="$6" fontWeight="bold">Szczegóły wizyty</Text>
        <Text color="$gray10">{appointment.nailService}</Text>

        <YStack gap="$3" marginTop="$2">
          {/* Ustawienie daty i czasu (Tu możesz wpiąć ten sam DatePicker, który robiliśmy wcześniej!) */}
          <XStack gap="$2">
            <Input flex={1} value={date} onChangeText={setDate} placeholder="Data (DD.MM.YYYY)" />
            <Input flex={1} value={time} onChangeText={setTime} placeholder="Godzina (HH:MM)" />
          </XStack>

          {/* Kształt i długość - tutaj w przyszłości użyjesz np. Select/Dropdown z Tamagui */}
          <XStack gap="$2">
            <Input flex={1} value={shape} onChangeText={setShape} placeholder="Kształt" />
            <Input flex={1} value={length} onChangeText={setLength} placeholder="Długość" />
          </XStack>

          {/* Wiadomość od artystki / Notatka wewnętrzna */}
          <YStack gap="$1">
            <Text fontSize="$3" fontWeight="bold">Twoja notatka / Wiadomość dla klienta:</Text>
            <TextArea 
              value={artistNote} 
              onChangeText={setArtistNote} 
              placeholder="np. Zarezerwowałam dodatkowe 15 min na trudne zdobienia..." 
              minHeight={80} 
            />
          </YStack>

          {/* Wiadomość od klienta (Tylko do odczytu) */}
          {appointment.additionalNotesUser && (
            <YStack backgroundColor="$gray3" padding="$3" borderRadius="$3">
              <Text fontSize="$2" color="$gray11">Uwagi klienta:</Text>
              <Text fontStyle="italic">"{appointment.additionalNotesUser}"</Text>
            </YStack>
          )}
        </YStack>

        <XStack gap="$3" marginTop="$4" paddingBottom="$4">
          <Button flex={1} onPress={() => onOpenChange(false)} theme="alt1">Anuluj</Button>
          <Button flex={1} onPress={handleSave} theme="green">Zapisz i Akceptuj</Button>
        </XStack>

      </Sheet.Frame>
    </Sheet>
  );
}