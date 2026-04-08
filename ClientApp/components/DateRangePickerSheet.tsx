// components/DateRangePickerSheet.tsx
import React, { useState } from 'react';
import { Sheet, YStack, XStack, Text, Button, H4 } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pl'; // Polski język w kalendarzu
import { DateTimeFromTo } from '@/src/types/appointment';

interface DateRangePickerSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dateRange: DateTimeFromTo) => void;
}

export function DateRangePickerSheet({ isOpen, onOpenChange, onSave }: DateRangePickerSheetProps) {
  // Domyślne wartości za pomocą dayjs
  const defaultFrom = dayjs().add(1, 'day').hour(10).minute(0).second(0);
  const defaultTo = defaultFrom.add(1.5, 'hour');

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);

  // Zamiast modalnych pop-upów, będziemy renderować kalendarz inline
  const [activePicker, setActivePicker] = useState<'from' | 'to' | null>(null);

  const handleSave = () => {
    onSave({
      from: fromDate.toISOString(),
      to: toDate.toISOString()
    });
    // Reset po zapisie
    setActivePicker(null);
    onOpenChange(false);
  };

  const handleDateChange = (date: any) => {
    if (activePicker === 'from') {
      const newFrom = dayjs(date);
      setFromDate(newFrom);
      // Jeśli data 'do' jest wcześniejsza niż nowa data 'od', przesuń 'do' do przodu
      if (newFrom.isAfter(toDate) || newFrom.isSame(toDate)) {
        setToDate(newFrom.add(1.5, 'hour'));
      }
    } else if (activePicker === 'to') {
      setToDate(dayjs(date));
    }
  };

  return (
<Sheet 
  modal 
  open={isOpen} 
  onOpenChange={(open: boolean) => { // <--- DODANY TYP BOOLEAN
    if (!open) setActivePicker(null); 
    onOpenChange(open);
  }} 
  snapPointsMode="fit" 
  dismissOnSnapToBottom
>
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" gap="$5" backgroundColor="$background" paddingBottom="$8">
        
        <YStack gap="$2">
          <H4 color="$color" textAlign="center">Wybierz ramy czasowe</H4>
          <Text color="$gray10" textAlign="center" fontSize="$3">Kiedy chciałabyś odbyć wizytę?</Text>
        </YStack>

        <YStack gap="$4" marginTop="$2">
          {/* SEKCJA: OD KIEDY */}
          <YStack gap="$2">
            <Text fontWeight="bold" color="$color">Od (Start wizyty):</Text>
            <Button 
              icon={<Ionicons name="calendar-outline" size={20} />} 
              onPress={() => setActivePicker(activePicker === 'from' ? null : 'from')}
              borderColor={activePicker === 'from' ? '#FF2A85' : '$borderColor'}
              borderWidth={1}
            >
              <Button.Text>{fromDate.format('DD.MM.YYYY - HH:mm')}</Button.Text>
            </Button>
          </YStack>

          {/* SEKCJA: DO KIEDY */}
          <YStack gap="$2">
            <Text fontWeight="bold" color="$color">Do (Koniec wizyty):</Text>
            <Button 
              icon={<Ionicons name="time-outline" size={20} />} 
              onPress={() => setActivePicker(activePicker === 'to' ? null : 'to')}
              borderColor={activePicker === 'to' ? '#FF2A85' : '$borderColor'}
              borderWidth={1}
            >
              <Button.Text>{toDate.format('DD.MM.YYYY - HH:mm')}</Button.Text>
            </Button>
          </YStack>
        </YStack>

        {/* INLINE PICKER (Pokazuje się tylko po kliknięciu w któryś przycisk) */}
        {activePicker && (
          <YStack backgroundColor="$background" borderRadius="$4" padding="$2" marginTop="$2">
<DateTimePicker
  mode="single"
  date={activePicker === 'from' ? fromDate.toDate() : toDate.toDate()}
  minDate={dayjs().toDate()}
  locale="pl" 
  timePicker={true} 
  onChange={(params: any) => handleDateChange(params.date)}
/>
          </YStack>
        )}

        <Button marginTop="$4" backgroundColor="#FF2A85" onPress={handleSave} size="$5">
          <Button.Text color="white" fontWeight="bold">Dodaj ten termin</Button.Text>
        </Button>

      </Sheet.Frame>
    </Sheet>
  );
}