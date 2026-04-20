// import React, { useState, useEffect } from 'react';
// import { Sheet, YStack, XStack, Text, Button, Input, TextArea, Select } from 'tamagui';
// import { AppointmentDto } from '@/src/constants/DTOs/appointmentdto';

// interface EditAppointmentSheetProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   appointment: AppointmentDto | null;
//   onSaveAndAccept: (updatedAppointment: AppointmentDto) => void;
// }

// export function EditAppointmentSheet({ isOpen, onOpenChange, appointment, onSaveAndAccept }: EditAppointmentSheetProps) {
//   // Lokalne stany do edycji formularza
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [shape, setShape] = useState('');
//   const [length, setLength] = useState('');
//   const [artistNote, setArtistNote] = useState('');

//   // Kiedy otwieramy modal z konkretną wizytą, uzupełniamy formularz jej obecnymi danymi
//   useEffect(() => {
//     if (appointment) {
//       // Tu powinieneś sformatować datę z appointment.from / appointment.to
//       setDate(appointment.from ? new Date(appointment.from).toLocaleDateString() : '');
//       setTime(appointment.from ? new Date(appointment.from).toLocaleTimeString() : '');
//       setShape(appointment.nailForm || '');
//       setLength(appointment.nailSize || '');
//       setArtistNote(appointment.additionalNotesArtist || '');
//     }
//   }, [appointment]);

//   const handleSave = () => {
//     if (!appointment) return;

//     // Budujemy zaktualizowany obiekt
//     const updatedData: AppointmentDto = {
//       ...appointment,
//       status: 'ConfirmedStatus', // Zmieniamy status na potwierdzony
//       nailForm: shape,
//       nailSize: length,
//       additionalNotesArtist: artistNote,
//       // Dodaj logikę parsowania nowej daty i czasu do ISO stringa
//     };

//     onSaveAndAccept(updatedData);
//     onOpenChange(false); // Zamykamy modal
//   };

//   if (!appointment) return null;

//   return (
//     <Sheet modal open={isOpen} onOpenChange={onOpenChange} snapPointsMode="fit" dismissOnSnapToBottom>
//       <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
//       <Sheet.Handle />
//       <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">

//         <Text fontSize="$6" fontWeight="bold">Szczegóły wizyty</Text>
//         <Text color="$gray10">{appointment.nailService}</Text>

//         <YStack gap="$3" marginTop="$2">
//           {/* Ustawienie daty i czasu (Tu możesz wpiąć ten sam DatePicker, który robiliśmy wcześniej!) */}
//           <XStack gap="$2">
//             <Input flex={1} value={date} onChangeText={setDate} placeholder="Data (DD.MM.YYYY)" />
//             <Input flex={1} value={time} onChangeText={setTime} placeholder="Godzina (HH:MM)" />
//           </XStack>

//           {/* Kształt i długość - tutaj w przyszłości użyjesz np. Select/Dropdown z Tamagui */}
//           <XStack gap="$2">
//             <Input flex={1} value={shape} onChangeText={setShape} placeholder="Kształt" />
//             <Input flex={1} value={length} onChangeText={setLength} placeholder="Długość" />
//           </XStack>

//           {/* Wiadomość od artystki / Notatka wewnętrzna */}
//           <YStack gap="$1">
//             <Text fontSize="$3" fontWeight="bold">Twoja notatka / Wiadomość dla klienta:</Text>
//             <TextArea 
//               value={artistNote} 
//               onChangeText={setArtistNote} 
//               placeholder="np. Zarezerwowałam dodatkowe 15 min na trudne zdobienia..." 
//               minHeight={80} 
//             />
//           </YStack>

//           {/* Wiadomość od klienta (Tylko do odczytu) */}
//           {appointment.additionalNotesUser && (
//             <YStack backgroundColor="$gray3" padding="$3" borderRadius="$3">
//               <Text fontSize="$2" color="$gray11">Uwagi klienta:</Text>
//               <Text fontStyle="italic">"{appointment.additionalNotesUser}"</Text>
//             </YStack>
//           )}
//         </YStack>

//         <XStack gap="$3" marginTop="$4" paddingBottom="$4">
//           <Button flex={1} onPress={() => onOpenChange(false)} theme="alt1">Anuluj</Button>
//           <Button flex={1} onPress={handleSave} theme="green">Zapisz i Akceptuj</Button>
//         </XStack>

//       </Sheet.Frame>
//     </Sheet>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import { Sheet, YStack, XStack, Text, Button, Input, TextArea, Label, ScrollView } from 'tamagui';
// import { AppointmentDto } from '@/src/types/appointment';
// import dayjs from 'dayjs';
// import { Ionicons } from '@expo/vector-icons';

// interface EditAppointmentSheetProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   appointment: AppointmentDto | null;
//   onSaveAndAccept: (updatedAppointment: AppointmentDto) => void;
// }

// export function EditAppointmentSheet({ isOpen, onOpenChange, appointment, onSaveAndAccept }: EditAppointmentSheetProps) {
//   // Lokalne stany do edycji
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [price, setPrice] = useState('');
//   const [duration, setDuration] = useState('');
//   const [artistNote, setArtistNote] = useState('');

//   // Synchronizacja po otwarciu
//   useEffect(() => {
//     if (appointment) {
//       // Jeśli wizyta ma już przypisany termin (from), parsujemy go
//       setDate(appointment.from ? dayjs(appointment.from).format('DD.MM.YYYY') : dayjs().format('DD.MM.YYYY'));
//       setTime(appointment.from ? dayjs(appointment.from).format('HH:mm') : '12:00');

//       setPrice(appointment.totalPrice?.toString() || '0');
//       setDuration(appointment.totalDurationInMinutes?.toString() || '60');
//       setArtistNote(appointment.additionalNotesArtist || '');
//     }
//   }, [appointment]);

//   const handleSave = () => {
//     if (!appointment) return;

//     // Próba parsowania daty (Zakładamy format DD.MM.YYYY HH:mm)
//     const [day, month, year] = date.split('.');
//     const [hour, minute] = time.split(':');
//     const finalFrom = dayjs(`${year}-${month}-${day}T${hour}:${minute}:00`).toISOString();
//     const finalTo = dayjs(finalFrom).add(parseInt(duration), 'minute').toISOString();

//     const updatedData: AppointmentDto = {
//       ...appointment,
//       status: 'ConfirmedStatus', // Potwierdzamy wizytę przy zapisie
//       from: finalFrom,
//       to: finalTo,
//       totalPrice: parseFloat(price),
//       totalDurationInMinutes: parseInt(duration),
//       additionalNotesArtist: artistNote,
//     };

//     onSaveAndAccept(updatedData);
//     onOpenChange(false);
//   };

//   if (!appointment) return null;

//   return (
//     <Sheet
//       modal
//       open={isOpen}
//       onOpenChange={onOpenChange}
//       snapPoints={[85]}
//       dismissOnSnapToBottom
//     >
//       <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
//       <Sheet.Handle />
//       <Sheet.Frame padding="$4" backgroundColor="$background">
//         <ScrollView>
//           <YStack gap="$4">
//             <Text fontSize="$6" fontWeight="bold">Ustalanie szczegółów wizyty</Text>

//             <YStack>
//               <Text color="$gray10" fontSize="$3">Usługa:</Text>
//               <Text fontWeight="bold" fontSize="$5">{appointment.service?.name}</Text>
//             </YStack>

//             {/* SEKCJA STATUSU (Widoczna dla wszystkich z uprawnieniami) */}
//             <YStack gap="$2">
//               <Label fontSize="$3" fontWeight="bold">Status wizyty:</Label>
//               <XStack flexWrap="wrap" gap="$2">
//                 {['requested', 'confirmed', 'completed', 'cancelled'].map((status) => (
//                   <Button
//                     key={status}
//                     size="$2"
//                     theme={editedFields.status === status ? 'active' : 'alt1'}
//                     onPress={() => setEditedFields({ ...editedFields, status })}
//                     backgroundColor={editedFields.status === status ? '$pink10' : '$gray5'}
//                   >
//                     {status === 'requested' && 'Prośba'}
//                     {status === 'confirmed' && 'Potwierdzona'}
//                     {status === 'completed' && 'Zakończona'}
//                     {status === 'cancelled' && 'Anulowana'}
//                   </Button>
//                 ))}
//               </XStack>
//             </YStack>

//             {/* SEKCJA PRZYPISANIA ARTYSTY (Tylko dla Managera) */}
//             {isManager && (
//               <YStack gap="$2" marginTop="$2">
//                 <Label fontSize="$3" fontWeight="bold">Przypisz do:</Label>
//                 {/* Tutaj najlepiej użyć Select z Tamagui lub prostego mapowania po artystach */}
//                 <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                   <XStack gap="$2">
//                     {allArtists?.map((artist) => (
//                       <Button
//                         key={artist.id}
//                         size="$2"
//                         onPress={() => setEditedFields({ ...editedFields, artistId: artist.id })}
//                         theme={editedFields.artistId === artist.id ? 'active' : undefined}
//                       >
//                         {artist.name}
//                       </Button>
//                     ))}
//                   </XStack>
//                 </ScrollView>
//               </YStack>
//             )}

//             {/* SEKTA PROPOZYCJI KLIENTA - wyświetlamy pełne zakresy */}
//             {appointment.requestedDates && appointment.requestedDates.length > 0 && (
//               <YStack backgroundColor="$gray2" padding="$3" borderRadius="$3" gap="$2">
//                 <Text fontSize="$2" fontWeight="bold" color="$gray11">Klient prosił o (proponowane zakresy):</Text>
//                 <YStack gap="$1.5">
//                   {appointment.requestedDates.map((rd, i) => (
//                     <XStack key={i} alignItems="center" gap="$2">
//                       <Ionicons name="calendar-outline" size={14} color="$pink10" />
//                       <Text fontSize="$3" color="$pink10" fontWeight="bold">
//                         {dayjs(rd.from).format('DD.MM')}
//                       </Text>
//                       <Text fontSize="$3" color="$color">
//                         w godzinach: {dayjs(rd.from).format('HH:mm')} – {dayjs(rd.to).format('HH:mm')}
//                       </Text>
//                     </XStack>
//                   ))}
//                 </YStack>
//               </YStack>
//             )}

//             {/* RĘCZNE WPISYWANIE DATY I GODZINY */}
//             <YStack gap="$2">
//               <Label>Termin wizyty (ustalony z klientem):</Label>
//               <XStack gap="$2">
//                 <Input
//                   flex={1}
//                   value={date}
//                   onChangeText={setDate}
//                   placeholder="DD.MM.YYYY"
//                   keyboardType="numeric"
//                 />
//                 <Input
//                   flex={1}
//                   value={time}
//                   onChangeText={setTime}
//                   placeholder="HH:MM"
//                   keyboardType="numeric"
//                 />
//               </XStack>
//             </YStack>

//             {/* KWOTA I CZAS */}
//             <XStack gap="$2">
//               <YStack flex={1} gap="$2">
//                 <Label>Cena (zł):</Label>
//                 <Input value={price} onChangeText={setPrice} keyboardType="numeric" />
//               </YStack>
//               <YStack flex={1} gap="$2">
//                 <Label>Czas (min):</Label>
//                 <Input value={duration} onChangeText={setDuration} keyboardType="numeric" />
//               </YStack>
//             </XStack>

//             {/* NOTATKA */}
//             <YStack gap="$2">
//               <Label>Notatka dla klienta / wewnętrzna:</Label>
//               <TextArea
//                 value={artistNote}
//                 onChangeText={setArtistNote}
//                 placeholder="Dodatkowe informacje o wizycie..."
//                 minHeight={80}
//               />
//             </YStack>

//             {/* UWAGI KLIENTA */}
//             {appointment.additionalNotesUser && (
//               <YStack backgroundColor="$gray3" padding="$3" borderRadius="$3" gap="$1">
//                 <Text fontSize="$2" color="$gray11">Pierwotne uwagi klienta:</Text>
//                 <Text fontStyle="italic">"{appointment.additionalNotesUser}"</Text>
//               </YStack>
//             )}

//             {/* PRZYCISKI */}
//             <XStack gap="$3" marginTop="$4" paddingBottom="$8">
//               <Button flex={1} onPress={() => onOpenChange(false)} backgroundColor="$gray5">
//                 Anuluj
//               </Button>
//               <Button flex={1} onPress={handleSave} backgroundColor="#FF2A85">
//                 <Text color="white" fontWeight="bold">Zapisz i Akceptuj</Text>
//               </Button>
//             </XStack>
//           </YStack>
//         </ScrollView>
//       </Sheet.Frame>
//     </Sheet>
//   );
// }
import React, { useState, useEffect } from 'react';
import { Sheet, YStack, XStack, Text, Button, Input, TextArea, Label, ScrollView } from 'tamagui';
import { AppointmentDto } from '@/src/types/appointment';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';

interface EditAppointmentSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentDto | null;
  onSaveAndAccept: (updatedAppointment: AppointmentDto) => void;
  isManager?: boolean; // Dodane, aby wiedzieć, czy pokazać wybór artysty
}

// Przykładowe dane - docelowo pobierzesz je z backendu
const mockArtists = [
  { id: 1, name: 'Anna (Ty)' },
  { id: 2, name: 'Kasia' },
  { id: 3, name: 'Marta' },
];

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
            {isManager && (
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