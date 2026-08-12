import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

const TONES = {
  error: { background: colors.dangerSoft, color: colors.danger, icon: 'alert-circle' },
  success: { background: colors.primarySoft, color: colors.primaryDark, icon: 'checkmark-circle' },
};

/** Mensagem fixa na tela — some só quando o usuário resolve a situação. */
export default function Banner({ tone = 'error', message, style }) {
  const palette = TONES[tone];

  return (
    <View style={[styles.banner, { backgroundColor: palette.background }, style]}>
      <Ionicons name={palette.icon} size={18} color={palette.color} />
      <Text style={[styles.message, { color: palette.color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  message: {
    ...typography.body,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
