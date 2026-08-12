import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme';

const VARIANTS = {
  primary: { background: colors.primary, label: colors.surface },
  secondary: { background: colors.primarySoft, label: colors.primaryDark },
  danger: { background: colors.dangerSoft, label: colors.danger },
};

/**
 * O botão fica bloqueado enquanto `loading` estiver ativo, o que evita
 * disparar a mesma requisição duas vezes por toque repetido.
 */
export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) {
  const palette = VARIANTS[variant];
  const isBlocked = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isBlocked, busy: loading }}
      onPress={onPress}
      disabled={isBlocked}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.background },
        pressed && styles.pressed,
        isBlocked && styles.blocked,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.label} />
      ) : (
        <Text style={[styles.label, { color: palette.label }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  blocked: {
    opacity: 0.55,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
