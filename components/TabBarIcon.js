import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme } from '@react-navigation/native';

export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? DarkTheme.colors.primary : DarkTheme.colors.text }
    />
  );
}
