import ArtistAppointmentsView from '@/components/ArtistAppointmentsView';
import CustomerAppointmentsView from '@/components/CustomerAppointmentsView';
import { useAuth } from '@/src/contexts/AuthContext'; // Zaimportuj UserRole
import React from 'react';
import { Button, Spinner, Text, YStack } from 'tamagui';

export default function ExploreTab() {
  const { user, isLoading, isManager, isArtist, isAuthenticated, loginAs } = useAuth();

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="#FF2A85" />
      </YStack>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$4">
        <Text textAlign="center" fontSize="$5" color="$gray10">
          Zaloguj się, aby zobaczyć swoje wizyty
        </Text>
        <Button backgroundColor="#FF2A85" onPress={() => loginAs('Wygon')}>
          <Button.Text color="white">Zaloguj testowo</Button.Text>
        </Button>
      </YStack>
    );
  }

if (isManager || isArtist) {
  return <ArtistAppointmentsView />;
}
  return <CustomerAppointmentsView customerId={user.id} />;
}