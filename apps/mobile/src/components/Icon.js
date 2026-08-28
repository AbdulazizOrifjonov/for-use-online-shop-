import React from 'react';
import { Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export function Icon({ name, size = 18, color = '#4A2E2B', style }) {
  try {
    return <Feather name={name} size={size} color={color} style={style} />;
  } catch (e) {
    return <Text style={[{ fontSize: size, color }, style]}>•</Text>;
  }
}
