import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
};

export default function Button({
  title,
  onPress,
  variant = 'primary' as const,
  size = 'medium' as const,
  disabled = false,
  loading = false,
  testID,
}: ButtonProps) {
  const buttonHeight = size === 'small' ? 40 : size === 'large' ? 60 : 50;
  const fontSize = size === 'small' ? 14 : size === 'large' ? 18 : 16;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        testID={testID}
        style={[styles.container, { height: buttonHeight }]}
      >
        <LinearGradient
          colors={disabled ? [Colors.textLight, Colors.textLight] : (Colors.gradient.primary as [string, string])}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, { height: buttonHeight }]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={[styles.text, styles.primaryText, { fontSize }]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        testID={testID}
        style={[
          styles.container,
          styles.outlineButton,
          { height: buttonHeight },
          disabled && styles.disabledOutline,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <Text style={[styles.text, styles.outlineText, { fontSize }]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
      style={[
        styles.container,
        styles.secondaryButton,
        { height: buttonHeight },
        disabled && styles.disabledSecondary,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : (
        <Text style={[styles.text, styles.secondaryText, { fontSize }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  text: {
    fontWeight: '600' as const,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryText: {
    color: Colors.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineText: {
    color: Colors.primary,
  },
  disabledSecondary: {
    backgroundColor: Colors.border,
  },
  disabledOutline: {
    borderColor: Colors.border,
  },
});
