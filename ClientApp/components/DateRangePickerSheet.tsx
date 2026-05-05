import { DateTimeFromTo } from '@/src/types/appointment';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import React, { useState } from 'react';
import { Platform } from 'react-native'; // <--- Dodajemy Platform
import DateTimePicker from 'react-native-ui-datepicker';
import { Button, H4, Input, Label, Sheet, Text, XStack, YStack } from 'tamagui';

interface DateRangePickerSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dateRange: DateTimeFromTo) => void;
}

export function DateRangePickerSheet({ isOpen, onOpenChange, onSave }: DateRangePickerSheetProps) {
  const isWeb = Platform.OS === 'web';

  const defaultFrom = dayjs().add(1, 'day').hour(10).minute(0).second(0);
  const defaultTo = defaultFrom.add(1.5, 'hour');

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [activePicker, setActivePicker] = useState<'from' | 'to' | null>(null);

  const handleSave = () => {
    onSave({
      from: fromDate.toISOString(),
      to: toDate.toISOString()
    });
    setActivePicker(null);
    onOpenChange(false);
  };

  const handleDateChange = (date: any) => {
    const newDate = dayjs(date);
    if (activePicker === 'from') {
      setFromDate(newDate);
      if (newDate.isAfter(toDate) || newDate.isSame(toDate)) {
        setToDate(newDate.add(1.5, 'hour'));
      }
    } else {
      setToDate(newDate);
    }
  };

  // Funkcja pomocnicza dla Weba do zmiany samej godziny
  const handleTimeChangeWeb = (type: 'from' | 'to', timeValue: string) => {
    const [hours, minutes] = timeValue.split(':').map(Number);
    if (type === 'from') {
      setFromDate(fromDate.hour(hours).minute(minutes));
    } else {
      setToDate(toDate.hour(hours).minute(minutes));
    }
  };

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) setActivePicker(null);
        onOpenChange(open);
      }}
      snapPointsMode="fit"
      dismissOnSnapToBottom
    >
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" gap="$5" backgroundColor="$background" paddingBottom="$8" maxWidth={isWeb ? 500 : '100%'} alignSelf="center">
        
        <YStack gap="$2">
          <H4 color="$color" textAlign="center">Wybierz ramy czasowe</H4>
          <Text color="$gray10" textAlign="center" fontSize="$3">Kiedy chciałabyś odbyć wizytę?</Text>
        </YStack>

        <YStack gap="$4" marginTop="$2">
          {/* SEKCJA DLA WEBA (Wygodniejsze Inputy) */}
          {isWeb ? (
            <YStack gap="$4">
              <YStack gap="$2">
                <Label fontWeight="bold">Od (Start):</Label>
                <XStack gap="$2">
                  <Button flex={2} icon={<Ionicons name="calendar-outline" size={18}/>} onPress={() => setActivePicker('from')}>
                    {fromDate.format('DD.MM.YYYY')}
                  </Button>
                  <Input 
                    flex={1} 
                    type="time" 
                    value={fromDate.format('HH:mm')} 
                    onChange={(e: any) => handleTimeChangeWeb('from', e.target.value)} 
                  />
                </XStack>
              </YStack>

              <YStack gap="$2">
                <Label fontWeight="bold">Do (Koniec):</Label>
                <XStack gap="$2">
                  <Button flex={2} icon={<Ionicons name="calendar-outline" size={18}/>} onPress={() => setActivePicker('to')}>
                    {toDate.format('DD.MM.YYYY')}
                  </Button>
                  <Input 
                    flex={1} 
                    type="time" 
                    value={toDate.format('HH:mm')} 
                    onChange={(e: any) => handleTimeChangeWeb('to', e.target.value)} 
                  />
                </XStack>
              </YStack>
            </YStack>
          ) : (
            /* SEKCJA DLA MOBILE (Twoja oryginalna) */
            <YStack gap="$4">
              <YStack gap="$2">
                <Text fontWeight="bold">Od (Start wizyty):</Text>
                <Button 
                  icon={<Ionicons name="calendar-outline" size={20} />} 
                  onPress={() => setActivePicker(activePicker === 'from' ? null : 'from')}
                  borderColor={activePicker === 'from' ? '#FF2A85' : '$borderColor'}
                  borderWidth={1}
                >
                  <Button.Text>{fromDate.format('DD.MM.YYYY - HH:mm')}</Button.Text>
                </Button>
              </YStack>

              <YStack gap="$2">
                <Text fontWeight="bold">Do (Koniec wizyty):</Text>
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
          )}
        </YStack>

        {/* KALENDARZ INLINE */}
        {activePicker && (
          <YStack backgroundColor="$background" borderRadius="$4" padding="$2" marginTop="$2" borderWidth={isWeb ? 1 : 0} borderColor="$borderColor">
            <DateTimePicker
              mode="single"
              date={activePicker === 'from' ? fromDate.toDate() : toDate.toDate()}
              minDate={dayjs().toDate()}
              locale="pl" 
              timePicker={!isWeb} // Na Webie wyłączamy TimePicker w kalendarzu, bo mamy natywny Input Time obok
              onChange={(params: any) => handleDateChange(params.date)}
            />
            {isWeb && <Button size="$2" alignSelf="flex-end" onPress={() => setActivePicker(null)}>Zamknij kalendarz</Button>}
          </YStack>
        )}

        <Button marginTop="$4" backgroundColor="#FF2A85" onPress={handleSave} size="$5">
          <Button.Text color="white" fontWeight="bold">Dodaj ten termin</Button.Text>
        </Button>

      </Sheet.Frame>
    </Sheet>
  );
}