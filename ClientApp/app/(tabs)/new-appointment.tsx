// app/new-appointment.tsx
import React, { useMemo, useState } from 'react';
import { YStack, XStack, Text, ScrollView, Button, H4, Progress, AnimatePresence, Spinner, Input, TextArea } from 'tamagui';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBookingData } from '@/src/hooks/useBookingData';
import { useCreateAppointment } from '@/src/hooks/useCreateAppointment';
import { DateTimeFromTo } from '@/src/types/appointment';
import dayjs from 'dayjs';
import { DateRangePickerSheet } from '@/components/DateRangePickerSheet';
import { apiClient } from '@/src/api/apiClient';
import { CreateAppointmentCommand } from '@/src/types/commands/createAppointmentCommand';

// Enum rozmiarów paznokci (zgodny z Twoim backendem C#)
const NAIL_SIZES = [
  { id: 0, label: 'Krótkie' },
  { id: 1, label: 'Średnie' },
  { id: 2, label: 'Długie' },
  { id: 3, label: 'Ekstra Długie' }
];

export default function NewAppointmentScreen() {
  const router = useRouter();

  // 1. Pobieranie danych z Twojego API
  const { data: bookingData, isLoading, error } = useBookingData();

  // 2. Ujednolicony stan formularza (tylko ID-ki, gotowe do wysłania)
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [nailSize, setNailSize] = useState<number | null>(null);
  const [variantId, setVariantId] = useState<number | null>(null);
  const [addonIds, setAddonIds] = useState<number[]>([]);
  const [notes, setNotes] = useState('');
  const [requestedDates, setRequestedDates] = useState<DateTimeFromTo[]>([]);
  const [selectedDates, setSelectedDates] = useState<{ from: string, to: string }[]>([]);
  const { mutate: sendRequest, isPending: isSending } = useCreateAppointment((data) => {
    console.log("Response from API:", data); // Zobacz w konsoli czy jest 'id' czy 'Id'

    // Bezpieczne pobranie ID
    const appointmentId = data?.id ?? data?.Id;

    if (appointmentId) {
      router.replace({
        pathname: "/success-screen" as any,
        params: { appointmentId: String(appointmentId) }
      });
    } else {
      // Jeśli API zwróciło 200 OK, ale pusty obiekt lub bez ID
      console.warn("API returned success but no ID found in response");
      router.replace("/" as any);
    }
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // 3. Dynamiczne obliczanie koszyka
  const summary = useMemo(() => {
    if (!bookingData) return { price: 0, duration: 0 };

    // Szukamy wybranej usługi w zagnieżdżonych kategoriach
    const allServices = bookingData.categories.flatMap(c => c.services);
    const selectedService = allServices.find(s => s.id === serviceId);

    // Filtrujemy wybrane dodatki
    const selectedAddons = bookingData.addons.filter(a => addonIds.includes(a.id));

    // Podliczamy ceny i czas
    const price = (selectedService?.defaultPrice || 0) +
      selectedAddons.reduce((sum, a) => sum + a.additionalPrice, 0);

    const duration = (selectedService?.defaultDurationInMinutes || 0) +
      selectedAddons.reduce((sum, a) => sum + a.additionalDurationMinutes, 0);

    return { price, duration };
  }, [serviceId, addonIds, bookingData]);

  // 4. Obsługa logiki
  const toggleAddon = (id: number) => {
    setAddonIds(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleAddDateRange = (newRange: DateTimeFromTo) => {
    setRequestedDates(prev => [...prev, newRange]);
  };

  const removeDateRange = (index: number) => {
    setRequestedDates(prev => prev.filter((_, i) => i !== index));
  };
  // 5. 
  const addDate = () => {
    const now = new Date();
    const from = new Date(now.setHours(now.getHours() + 24)).toISOString();
    const to = new Date(now.setHours(now.getHours() + 2)).toISOString();
    setSelectedDates([...selectedDates, { from, to }]);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => currentStep > 1 ? setCurrentStep(prev => prev - 1) : router.back();

  const handleSubmit = () => {
    const command: CreateAppointmentCommand = {
      requestedArtistId: null,
      userId: 1,
      requestedDates: requestedDates, // Twoja lista z DateRangePicker
      serviceId: serviceId!, // ! jeśli masz pewność, że nie jest null
      nailSize: nailSize,
      variantId: variantId!,
      addonsIds: addonIds,
      additionalNotes: notes || null,
    };
    console.log("Wysyłanie mutacji TanStack Query:", command);
    sendRequest(command);
    // router.push('/success-screen'); 
  };

  // 5. Ekrany ładowania / błędów
  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="#FF2A85" />
        <Text marginTop="$2" color="$gray11">Pobieram ofertę salonu...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="red">Błąd połączenia: {(error as Error).message}</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* HEADER Z PROGRESEM */}
      <YStack paddingHorizontal="$4" paddingTop="$5" gap="$2">
        <XStack alignItems="center" justifyContent="space-between">
          <Button circular chromeless icon={<Ionicons name="close" size={24} color="$color" />} onPress={() => router.back()} />
          <H4>Krok {currentStep} z {totalSteps}</H4>
          <XStack width={40} />
        </XStack>
        <Progress value={(currentStep / totalSteps) * 100} size="$2">
          <Progress.Indicator backgroundColor="#FF2A85" />
        </Progress>
      </YStack>

      {/* PANELE (KROKI) */}
      <ScrollView flex={1} contentContainerStyle={{ flexGrow: 1 }}>
        <AnimatePresence>
          <YStack padding="$4" gap="$5" flex={1}>

            {/* KROK 1: USŁUGA GŁÓWNA (Dynamiczne Kategorie) */}
            {currentStep === 1 && (
              <YStack gap="$5" enterStyle={{ opacity: 0, x: 20 }}>
                <YStack>
                  <Text fontSize="$8" fontWeight="bold">Co dziś robimy?</Text>
                  <Text color="$gray10">Wybierz główną usługę, aby zacząć.</Text>
                </YStack>

                {bookingData?.categories.map((category) => (
                  <YStack key={category.id} gap="$2">
                    <Text color="$gray11" fontWeight="bold" fontSize="$3" textTransform="uppercase">
                      {category.name}
                    </Text>
                    <YStack gap="$2">
                      {category.services.map((s) => (
                        <Button
                          key={s.id}
                          size="$5"
                          justifyContent="space-between"
                          borderWidth={serviceId === s.id ? 2 : 1}
                          borderColor={serviceId === s.id ? '#FF2A85' : '$borderColor'}
                          backgroundColor={serviceId === s.id ? '#FFF0F5' : '$background'}
                          onPress={() => { setServiceId(s.id); nextStep(); }}
                        >
                          <Text flex={1} color={serviceId === s.id ? '#FF2A85' : '$color'} fontWeight={serviceId === s.id ? 'bold' : 'normal'}>
                            {s.name}
                          </Text>
                          <Text color={serviceId === s.id ? '#FF2A85' : '$gray11'} fontWeight="bold">
                            {s.defaultPrice} zł
                          </Text>
                        </Button>
                      ))}
                    </YStack>
                  </YStack>
                ))}
              </YStack>
            )}

            {/* KROK 2: PERSONALIZACJA (Rozmiar z Enuma, Kształt z API) */}
            {currentStep === 2 && (
              <YStack gap="$6" enterStyle={{ opacity: 0, x: 20 }}>
                <YStack>
                  <Text fontSize="$8" fontWeight="bold">Dopasuj detale</Text>
                  <Text color="$gray10">Jakie paznokcie planujemy?</Text>
                </YStack>

                <YStack gap="$3">
                  <Text fontWeight="600" fontSize="$5">Długość (Rozmiar):</Text>
                  <XStack gap="$2" flexWrap="wrap">
                    {NAIL_SIZES.map((size) => (
                      <Button
                        key={size.id}
                        borderWidth={nailSize === size.id ? 2 : 1}
                        borderColor={nailSize === size.id ? '#FF2A85' : '$borderColor'}
                        backgroundColor={nailSize === size.id ? '#FFF0F5' : '$background'}
                        onPress={() => setNailSize(size.id)}
                      >
                        <Text color={nailSize === size.id ? '#FF2A85' : '$color'}>{size.label}</Text>
                      </Button>
                    ))}
                  </XStack>
                </YStack>

                <YStack gap="$3">
                  <Text fontWeight="600" fontSize="$5">Kształt:</Text>
                  <XStack gap="$2" flexWrap="wrap">
                    {bookingData?.forms.map((f) => (
                      <Button
                        key={f.id}
                        borderWidth={variantId === f.id ? 2 : 1}
                        borderColor={variantId === f.id ? '#FF2A85' : '$borderColor'}
                        backgroundColor={variantId === f.id ? '#FFF0F5' : '$background'}
                        onPress={() => setVariantId(f.id)}
                      >
                        <Text color={variantId === f.id ? '#FF2A85' : '$color'}>{f.name}</Text>
                      </Button>
                    ))}
                  </XStack>
                </YStack>
              </YStack>
            )}

            {/* KROK 3: DODATKI (Dynamiczne Addony) */}
            {currentStep === 3 && (
              <YStack gap="$4" enterStyle={{ opacity: 0, x: 20 }}>
                <YStack>
                  <Text fontSize="$8" fontWeight="bold">Dodatki do wizyty</Text>
                  <Text color="$gray10">Opcjonalne zdobienia i zabiegi.</Text>
                </YStack>

                <YStack gap="$2">
                  {bookingData?.addons.map((addon) => {
                    const isSelected = addonIds.includes(addon.id);
                    return (
                      <Button
                        key={addon.id}
                        size="$5"
                        justifyContent="flex-start"
                        borderWidth={isSelected ? 2 : 1}
                        borderColor={isSelected ? '#FF2A85' : '$borderColor'}
                        backgroundColor={isSelected ? '#FFF0F5' : '$background'}
                        onPress={() => toggleAddon(addon.id)}
                      >
                        <XStack flex={1} justifyContent="space-between" alignItems="center">
                          <XStack alignItems="center" gap="$3">
                            <Ionicons
                              name={isSelected ? "checkbox" : "square-outline"}
                              size={24}
                              color={isSelected ? "#FF2A85" : "gray"}
                            />
                            <Text color={isSelected ? '#FF2A85' : '$color'} fontWeight={isSelected ? 'bold' : 'normal'}>
                              {addon.name}
                            </Text>
                          </XStack>
                          <Text color={isSelected ? '#FF2A85' : '$gray11'}>
                            +{addon.additionalPrice} zł
                          </Text>
                        </XStack>
                      </Button>
                    )
                  })}
                </YStack>
              </YStack>
            )}

            {/* KROK 4: UWAGI (Terminy zrobimy w osobnym komponencie, tu dajemy pole tekstowe) */}
            {currentStep === 4 && (
              <YStack gap="$4" enterStyle={{ opacity: 0, x: 20 }}>
                <Text fontSize="$8" fontWeight="bold">Dodatkowe uwagi</Text>
                <Text color="$gray10">Masz jakieś specjalne życzenia lub pytania do stylistki?</Text>

                <TextArea
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Np. zależy mi na konkretnym odcieniu czerwieni..."
                  size="$4"
                  borderWidth={1}
                  borderColor="$borderColor"
                  minHeight={120}
                />
              </YStack>
            )}

            {/* KROK 5: WYBÓR TERMINÓW */}
            {currentStep === 5 && (
              <YStack gap="$5" enterStyle={{ opacity: 0, x: 20 }}>
                <YStack>
                  <Text fontSize="$8" fontWeight="bold">Kiedy Ci pasuje?</Text>
                  <Text color="$gray10">Podaj propozycje terminów. Stylistka wybierze jeden z nich.</Text>
                </YStack>

                <YStack gap="$3">
                  {requestedDates.length > 0 ? (
                    requestedDates.map((date, index) => (
                      <XStack
                        key={index}
                        backgroundColor="$gray2"
                        padding="$4"
                        borderRadius="$4"
                        justifyContent="space-between"
                        alignItems="center"
                        borderWidth={1}
                        borderColor="$borderColor"
                      >
                        <YStack gap="$1">
                          <XStack alignItems="center" gap="$2">
                            <Ionicons name="calendar" size={16} color="#FF2A85" />
                            <Text fontWeight="bold">{dayjs(date.from).format('DD MMMM YYYY')}</Text>
                          </XStack>
                          <Text color="$gray11" fontSize="$3">
                            ⌚ {dayjs(date.from).format('HH:mm')} - {dayjs(date.to).format('HH:mm')}
                          </Text>
                        </YStack>

                        <Button
                          circular
                          size="$3"
                          chromeless
                          icon={<Ionicons name="trash-outline" size={20} color="red" />}
                          onPress={() => removeDateRange(index)}
                        />
                      </XStack>
                    ))
                  ) : (
                    <YStack padding="$8" alignItems="center" justifyContent="center" borderWidth={2} borderStyle="dashed" borderColor="$borderColor" borderRadius="$4">
                      <Ionicons name="time-outline" size={40} color="$gray8" />
                      <Text color="$gray8" marginTop="$2">Brak dodanych terminów</Text>
                    </YStack>
                  )}

                  <Button
                    icon={<Ionicons name="add-circle" size={20} color="white" />}
                    backgroundColor="#FF2A85"
                    onPress={() => setIsDatePickerOpen(true)}
                    marginTop="$2"
                  >
                    <Button.Text color="white" fontWeight="bold">Dodaj propozycję terminu</Button.Text>
                  </Button>
                </YStack>

                {/* Komponent Sheeta wywoływany przez stan */}
                <DateRangePickerSheet
                  isOpen={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                  onSave={handleAddDateRange}
                />
              </YStack>
            )}
          </YStack>
        </AnimatePresence>
      </ScrollView>

      {/* FIXED FOOTER (Dynamiczne przeliczanie) */}
      <YStack padding="$4" backgroundColor="$background" borderTopWidth={1} borderColor="$borderColor">
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
          <YStack>
            <Text color="$gray10" fontSize="$2">Szacowany koszt i czas:</Text>
            <Text fontWeight="bold" fontSize="$5" color="#FF2A85">
              ~{summary.price} zł • {summary.duration} min
            </Text>
          </YStack>

          {currentStep > 1 && (
            <Button size="$3" chromeless onPress={prevStep}>
              Wróć
            </Button>
          )}
        </XStack>

        <Button
          size="$5"
          backgroundColor="#FF2A85"
          onPress={currentStep === totalSteps ? handleSubmit : nextStep}
          disabled={currentStep === 1 && !serviceId}
          opacity={currentStep === 1 && !serviceId ? 0.5 : 1}
        >
          <Button.Text color="white" fontWeight="bold">
            {currentStep === totalSteps ? 'Poproś o wizytę' : 'Kontynuuj'}

          </Button.Text>
        </Button>
      </YStack>
    </YStack>
  );
}