// app/new-appointment.tsx
import React, { useState } from 'react';
import { YStack, XStack, Text, ScrollView, Button, TextArea, H3, Separator, H2, H5, H4 } from 'tamagui';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DateTimeFromTo, NailAddons, NailForm, NailService, NailSize } from '@/src/types/appointment';
import { CreateAppointmentCommand } from '@/src/types/commands/createAppointmentCommand';
import { DateRangePickerSheet } from '@/components/DateRangePickerSheet';

// Słowniki do ładnego wyświetlania enumów w UI
const SERVICE_LABELS: Record<NailService, string> = {
  [NailService.ManicureHybrid]: 'Manicure Hybrydowy',
  [NailService.ManicureClassic]: 'Manicure Klasyczny',
  [NailService.ZelNaturalnaPlytka]: 'Żel - Naturalna Płytka',
  [NailService.PrzedluzenieZelowe]: 'Przedłużenie Żelowe',
  [NailService.UzupelnienieZelowe]: 'Uzupełnienie Żelowe',
  [NailService.Pedicure]: 'Pedicure',
  [NailService.PedicureFrezarkowy]: 'Pedicure Frezarkowy',
  [NailService.SciaganieHybrydyZelu]: 'Ściągnięcie',
  [NailService.ClassicManicure]: 'Manicure Klasyczny (Alt)',
};

const SIZE_LABELS: Record<NailSize, string> = {
  [NailSize.Short]: 'Krótkie',
  [NailSize.Medium]: 'Średnie',
  [NailSize.Long]: 'Długie',
};

const FORM_LABELS: Record<NailForm, string> = {
  [NailForm.Migdal]: 'Migdał',
  [NailForm.Kwadrat]: 'Kwadrat',
  [NailForm.MiekkiKwadrat]: 'Miękki Kwadrat',
  [NailForm.Owal]: 'Owal',
};

const ADDONS_LABELS: Record<NailAddons, string> = {
  [NailAddons.French]: 'French',
  [NailAddons.Ozdoby3D]: 'Ozdoby 3D',
  [NailAddons.Cyrkonie]: 'Cyrkonie',
  [NailAddons.Pylek]: 'Pyłek',
  [NailAddons.Syrenka]: 'Syrenka',
  [NailAddons.Princess]: 'Princess',
  [NailAddons.Folia]: 'Folia',
  [NailAddons.ZdobieniaMalowane]: 'Zdobienia Malowane',
};

export default function NewAppointmentScreen() {
  const router = useRouter();

  // Stan formularza odpowiadający CreateAppointmentCommand
  const [service, setService] = useState<NailService | null>(null);
  const [size, setSize] = useState<NailSize | null>(null);
  const [form, setForm] = useState<NailForm | null>(null);
  const [addons, setAddons] = useState<NailAddons[]>([]);
  const [notes, setNotes] = useState('');
  const [requestedDates, setRequestedDates] = useState<DateTimeFromTo[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const toggleAddon = (addon: NailAddons) => {
    setAddons((prev) =>
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };
  const removeDate = (indexToRemove: number) => {
    setRequestedDates((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveDateRange = (newDateRange: DateTimeFromTo) => {
    setRequestedDates((prev) => [...prev, newDateRange]);
  };

  const formatDateTime = (dateString: string | Date) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }) + ' ' +
      d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };


const handleSubmit = () => {
    const command: Partial<CreateAppointmentCommand> = {
      userId: 1,
      nailService: service || undefined,
      nailSize: size || undefined,
      nailForm: form || undefined,
      nailAddons: addons,
      additionalNotes: notes,
      requestedDates: requestedDates,
    };
    
    console.log('Wysyłanie do API:', command);
    router.back();
  };

  return (
    <>
      <ScrollView backgroundColor="$background">
        <YStack padding="$4" gap="$5" paddingBottom="$10">

          {/* Nagłówek i cofanie dla płynnego UX */}
          <XStack alignItems="center" gap="$3">
            <Button circular chromeless icon={<Ionicons name="arrow-back" size={24} color="$color" />} onPress={() => router.back()} />
            <H4>Nowa wizyta</H4>
          </XStack>

          {/* 1. USŁUGA */}
          <YStack gap="$3">
            <Text fontWeight="bold" fontSize="$4" color="$color">1. Wybierz usługę</Text>
            <XStack flexWrap="wrap" gap="$2">
              {(Object.keys(SERVICE_LABELS) as unknown as NailService[]).map((key) => {
                const numKey = Number(key) as NailService;
                const isSelected = service === numKey;
                return (
                  <Button
                    key={numKey}
                    size="$3"
                    backgroundColor={isSelected ? '#FF2A85' : '$gray3'}
                    onPress={() => setService(numKey)}
                  >
                    <Button.Text color={isSelected ? 'white' : '$color'}>
                      {SERVICE_LABELS[numKey]}
                    </Button.Text>
                  </Button>
                );
              })}
            </XStack>
          </YStack>

          <Separator />

          {/* 2. DŁUGOŚĆ I KSZTAŁT (Pokaż tylko jeśli to nie jest samo ściąganie/pedicure) */}
          <YStack gap="$3">
            <Text fontWeight="bold" fontSize="$4" color="$color">2. Długość i Kształt</Text>

            <Text fontSize="$3" color="$gray10">Długość paznokci:</Text>
            <XStack flexWrap="wrap" gap="$2">
              {(Object.keys(SIZE_LABELS) as unknown as NailSize[]).map((key) => {
                const numKey = Number(key) as NailSize;
                const isSelected = size === numKey;
                return (
                  <Button
                    key={numKey}
                    size="$3"
                    theme={isSelected ? 'active' : 'alt1'}
                    onPress={() => setSize(numKey)}
                    backgroundColor={isSelected ? '#FF2A85' : undefined}
                  >
                    <Button.Text color={isSelected ? 'white' : undefined}>
                      {SIZE_LABELS[numKey]}
                    </Button.Text>
                  </Button>
                );
              })}
            </XStack>

            <Text fontSize="$3" color="$gray10" marginTop="$2">Preferowany kształt:</Text>
            <XStack flexWrap="wrap" gap="$2">
              {(Object.keys(FORM_LABELS) as unknown as NailForm[]).map((key) => {
                const numKey = Number(key) as NailForm;
                const isSelected = form === numKey;
                return (
                  <Button key={numKey} size="$3" theme={isSelected ? 'active' : 'alt1'} onPress={() => setForm(numKey)} backgroundColor={isSelected ? '#FF2A85' : undefined} >
                    <Button.Text color={isSelected ? 'white' : undefined}>
                      {FORM_LABELS[numKey]}
                    </Button.Text>
                  </Button>
                );
              })}
            </XStack>
          </YStack>

          <Separator />

          {/* 3. DODATKI (Wielokrotny wybór) */}
          <YStack gap="$3">
            <Text fontWeight="bold" fontSize="$4" color="$color">3. Dodatki i Zdobienia (Opcjonalnie)</Text>
            <XStack flexWrap="wrap" gap="$2">
              {(Object.keys(ADDONS_LABELS) as unknown as NailAddons[]).map((key) => {
                const numKey = Number(key) as NailAddons;
                const isSelected = addons.includes(numKey);
                return (
                  <Button
                    key={numKey}
                    size="$3"
                    borderWidth={1}
                    borderColor={isSelected ? '#FF2A85' : '$borderColor'}
                    backgroundColor={isSelected ? '#FFF0F5' : '$background'}
                    icon={isSelected ? <Ionicons name="checkmark" color="#FF2A85" /> : undefined}
                    onPress={() => toggleAddon(numKey)}
                  >
                    <Button.Text color={isSelected ? '#FF2A85' : '$color'}>
                      {ADDONS_LABELS[numKey]}
                    </Button.Text>
                  </Button>
                );
              })}
            </XStack>
          </YStack>

          <Separator />

          {/* 4. TERMINY WIZYTY (NOWA SEKCJA) */}
          <YStack gap="$3">
            <Text fontWeight="bold" fontSize="$4" color="$color">4. Proponowane terminy</Text>
            <Text fontSize="$3" color="$gray10">Wybierz jeden lub kilka terminów, które Ci pasują.</Text>

            {/* Kontener na "Pillsy" */}
            {requestedDates.length > 0 && (
              <XStack flexWrap="wrap" gap="$2" marginTop="$2">
                {requestedDates.map((dateObj, index) => (
                  <XStack
                    key={index}
                    backgroundColor="$color.pink2Light" // Delikatne różowe tło
                    borderWidth={1}
                    borderColor="#FF2A85"
                    borderRadius={100} // Zaokrąglenie pilla
                    paddingLeft="$3"
                    paddingRight="$1"
                    paddingVertical="$1"
                    alignItems="center"
                    gap="$2"
                  >
                    <Text fontSize="$2" color="#FF2A85" fontWeight="bold">
                      {formatDateTime(dateObj.from)} - {new Date(dateObj.to).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                    </Text>

                    {/* Przycisk usuwania (krzyżyk) */}
                    <Button
                      circular
                      size="$2"
                      chromeless
                      backgroundColor="transparent"
                      onPress={() => removeDate(index)}
                      icon={<Ionicons name="close-circle" size={20} color="#FF2A85" />}
                    />
                  </XStack>
                ))}
              </XStack>
            )}

            {/* Przycisk dodawania kolejnego terminu */}
            <Button
              marginTop="$2"
              theme="alt2"
              borderStyle="dashed"
              borderWidth={1}
              borderColor="$gray8"
              icon={<Ionicons name="add-outline" size={20} color="$color" />}
              onPress={() => setIsDatePickerOpen(true)}
            >
              <Button.Text>Dodaj propozycję terminu</Button.Text>
            </Button>
          </YStack>

          <Separator />

          {/* 5. UWAGI */}
          <YStack gap="$3">
            <Text fontWeight="bold" fontSize="$4" color="$color">4. Dodatkowe uwagi</Text>
            <TextArea
              placeholder="Np. mam bardzo wrażliwe skórki, proszę o delikatne opiłowanie..."
              value={notes}
              onChangeText={setNotes}
              minHeight={100}
            />
          </YStack>

          {/* PRZYCISK ZAPISU */}
          <Button
            marginTop="$4"
            size="$5"
            backgroundColor={!service ? '$gray8' : '#FF2A85'} // Blokada wizualna jeśli brak usługi
            disabled={!service} // Zablokuj kliknięcie jeśli nie wybrano usługi
            onPress={handleSubmit}
            icon={<Ionicons name="calendar-outline" size={20} color="white" />}
          >
            <Button.Text color="white">
              {service ? 'Przejdź do wyboru terminu' : 'Wybierz usługę, aby kontynuować'}
            </Button.Text>
          </Button>

        </YStack>
      </ScrollView>

      <DateRangePickerSheet
        isOpen={isDatePickerOpen}
        onOpenChange={setIsDatePickerOpen}
        onSave={handleSaveDateRange}
      />
    </>
  );
}