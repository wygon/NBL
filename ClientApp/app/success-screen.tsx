import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Button, Circle, H2, Text, YStack } from 'tamagui';

export default function SuccessScreen() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();

  return (
    <YStack 
      flex={1} 
      backgroundColor="$background" 
      justifyContent="center" 
      alignItems="center" 
      padding="$5" 
      gap="$6"
    >
      <Circle 
        size={120} 
        backgroundColor="#E6FFFA" 
        borderWidth={4}
        borderColor="#38B2AC"
      >
        <Ionicons name="checkmark-done" size={70} color="#38B2AC" />
      </Circle>

      <YStack gap="$2" alignItems="center">
        <H2 textAlign="center" fontWeight="bold">Prośba wysłana!</H2>
        
        <Text color="$gray11" textAlign="center" fontSize="$5">
          Twoja rezerwacja (ID: <Text fontWeight="bold" color="#FF2A85">#{appointmentId}</Text>) trafiła do systemu.
        </Text>
        
        <Text color="$gray10" textAlign="center" fontSize="$3" marginTop="$2">
          Powiadomimy Cię, gdy stylistka zaakceptuje Twój termin.
        </Text>
      </YStack>

      <YStack width="100%" gap="$3" marginTop="$6">
        <Button 
          backgroundColor="#FF2A85" 
          size="$5" 
          onPress={() => router.replace('/')}
        >
          <Button.Text color="white" fontWeight="bold">Wróć do strony głównej</Button.Text>
        </Button>
      </YStack>
    </YStack>
  );
}