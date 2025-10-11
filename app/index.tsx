import { useApp } from '@/contexts/AppContext';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const { isOnboarded } = useApp();

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
