import ArtistAppointmentsView from '@/components/ArtistAppointmentsView';
import CustomerAppointmentsView from '@/components/CustomerAppointmentsView';
import { useAuth } from '@/src/hooks/useAuth';
import React from 'react';
import { YStack, Spinner } from 'tamagui';

export default function ExploreTab() {
  const { user, isLoading } = useAuth(); // Zwraca np. { id: 1, role: 'Artist' }

  if (isLoading) return <YStack flex={1} justifyContent="center"><Spinner /></YStack>;

  if (!user) return null;
  
  if (user?.role === 'Manager') {
    return <ArtistAppointmentsView artistId={user.id} isManager={true} />;
  }

  // Warunkowe renderowanie na podstawie roli
  if (user?.role === 'Artist') {
    return <ArtistAppointmentsView artistId={user.id} />;
  }

  // Domyślnie widok klienta
  return <CustomerAppointmentsView customerId={user?.id} />;
}