import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNotifications } from '@/src/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { AppBar } from '../../components/AppBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter(n => !n.isRead).length;

  return (
    <Tabs
      screenOptions={{
        header: () => <AppBar />,
        tabBarActiveTintColor: '#FF2A85'
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Główna',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="cos"
        options={{
          title: 'cos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="help-circle" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="new-appointment"
        options={{
          title: 'Nowa wizyta',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Powiadomienia',
          // 3. Dynamiczny Badge
          // Jeśli unreadCount jest większe od 0, pokaż liczbę. Jeśli 0 lub undefined, ukryj badge (undefined).
          tabBarBadge: unreadCount && unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#FF2A85',
            color: 'white',
            fontSize: 10,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={unreadCount && unreadCount > 0 ? "notifications" : "notifications-outline"}
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: 'Moje wizyty',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}