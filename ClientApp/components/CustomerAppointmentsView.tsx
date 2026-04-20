import { API_CONFIG } from '@/src/api.config';
import { apiClient } from '@/src/api/apiClient';
import { AppointmentDto } from '@/src/types/appointment';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl } from 'react-native';
import { Card, Separator, Spinner, Text, View, XStack, YStack } from 'tamagui';

interface CustomerAppointmentsViewProps {
  customerId: number;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'Confirmed': return { label: 'Potwierdzona', color: '#38B2AC' };
    case 'RequestedStatus': return { label: 'Oczekująca', color: '#F6AD55' };
    case 'Canceled': return { label: 'Odwołana', color: '#FC8181' };
    case 'Finished': return { label: 'Zakończona', color: '$gray10' };
    default: return { label: status, color: '$color' };
  }
};

export default function CustomerAppointmentsView({ customerId }: CustomerAppointmentsViewProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Funkcja pobierająca dane - przeniesiona do środka, aby mieć dostęp do customerId
  const fetchAppointmentsPage = async ({ pageParam = 1 }) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.GET_APPOINTMENTS, {
      params: {
        requestedByUserId: customerId, // WAŻNE: Filtrujemy tylko wizyty tego klienta!
        Page: pageParam,
        Count: 10,
      }
    });
    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['appointments', 'customer', customerId], 
    queryFn: fetchAppointmentsPage,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Jeśli pobraliśmy 10 elementów, zakładamy, że jest kolejna strona
      if (lastPage.appointments?.length === 10) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Spłaszczamy strony z React Query do jednej tablicy wizyt
  const allAppointments = data?.pages.flatMap(page => page.appointments) || [];

  const renderItem = ({ item }: ListRenderItemInfo<AppointmentDto>) => {
    const isExpanded = expandedId === item.id;
    const statusConfig = getStatusConfig(item.status);
    
    // Mapowanie rozmiaru na tekst
    const nailSizeLabels = ['S', 'M', 'L', 'XL', 'Mega'];
    const sizeLabel = item.nailSize !== null ? nailSizeLabels[item.nailSize] : null;

    return (
      <Card
        elevation={2}
        borderWidth={1}
        borderColor="$borderColor"
        backgroundColor="$background"
        marginVertical="$2"
        pressStyle={{ scale: 0.98 }}
        onPress={() => toggleExpand(item.id)}
      >
        <Card.Header padding="$4" paddingBottom="$2">
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack flex={1}>
              <Text fontSize="$5" fontWeight="bold" color="$color">
                {item.service?.name || 'Usługa do ustalenia'}
              </Text>
              {item.variant && (
                <Text fontSize="$3" color="$gray10">{item.variant.name}</Text>
              )}
            </YStack>
            
            <YStack alignItems="flex-end">
              <Text fontSize="$3" color={statusConfig.color} fontWeight="bold">
                {statusConfig.label}
              </Text>
              <Text fontWeight="bold" color="#FF2A85" fontSize="$4" marginTop="$1">
                {item.totalPrice} zł
              </Text>
            </YStack>
          </XStack>
        </Card.Header>

        <Card.Footer padding="$4" paddingTop="$2" flexDirection="column">
          <YStack gap="$2">
            <XStack gap="$4">
              <XStack gap="$2" alignItems="center">
                <Ionicons name="calendar-outline" size={16} color="gray" />
                <Text color="$gray11">
                  {item.from ? dayjs(item.from).format('DD.MM.YYYY') : 'Brak daty'}
                </Text>
              </XStack>
              <XStack gap="$2" alignItems="center">
                <Ionicons name="time-outline" size={16} color="gray" />
                <Text color="$gray11">
                  {item.from ? dayjs(item.from).format('HH:mm') : '--:--'}
                </Text>
              </XStack>
            </XStack>

            {isExpanded && (
              <YStack gap="$3" marginTop="$3">
                <Separator />
                
                <YStack gap="$2">
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$gray10">Czas trwania:</Text>
                    <Text fontSize="$3" fontWeight="bold">{item.totalDurationInMinutes} min</Text>
                  </XStack>

                  {sizeLabel && (
                    <XStack justifyContent="space-between">
                      <Text fontSize="$3" color="$gray10">Długość:</Text>
                      <Text fontSize="$3" fontWeight="bold">{sizeLabel}</Text>
                    </XStack>
                  )}

                  {item.addons && item.addons.length > 0 && (
                    <YStack marginTop="$1">
                      <Text fontSize="$3" color="$gray10" marginBottom="$1">Dodatki:</Text>
                      <XStack flexWrap="wrap" gap="$2">
                        {item.addons.map(addon => (
                          <View key={addon.id} backgroundColor="$gray3" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                            <Text fontSize="$2">+{addon.name}</Text>
                          </View>
                        ))}
                      </XStack>
                    </YStack>
                  )}

                  {item.additionalNotesUser && (
                    <YStack backgroundColor="$gray3" padding="$3" borderRadius="$2" marginTop="$2">
                      <Text fontSize="$3" fontStyle="italic" color="$gray11">"{item.additionalNotesUser}"</Text>
                    </YStack>
                  )}
                </YStack>
              </YStack>
            )}
          </YStack>
        </Card.Footer>
      </Card>
    );
  };

  if (isError) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
        <Ionicons name="alert-circle-outline" size={40} color="red" />
        <Text color="red" marginTop="$2">Wystąpił błąd podczas pobierania wizyt.</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {isLoading ? (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="#FF2A85" />
        </YStack>
      ) : (
        <FlatList
          data={allAppointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FF2A85"
              colors={['#FF2A85']}
            />
          }
          ListHeaderComponent={
            <Text fontSize="$8" fontWeight="bold" color="$color" marginBottom="$4">
              Moje wizyty
            </Text>
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <YStack padding="$4" alignItems="center">
                <Spinner size="small" color="#FF2A85" />
              </YStack>
            ) : !hasNextPage && allAppointments.length > 0 ? (
              <YStack padding="$6" alignItems="center">
                <Text color="$gray10" fontSize="$3" fontStyle="italic">
                  To już wszystko! 💅
                </Text>
              </YStack>
            ) : null
          }
          ListEmptyComponent={
            <YStack padding="$8" alignItems="center" justifyContent="center">
              <Ionicons name="calendar-outline" size={50} color="gray" />
              <Text color="$gray10" marginTop="$4" textAlign="center">
                Nie masz jeszcze żadnych wizyt.
              </Text>
            </YStack>
          }
        />
      )}
    </YStack>
  );
}