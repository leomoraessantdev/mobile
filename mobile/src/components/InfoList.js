import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, typography } from '../theme';

/**
 * Cartão de pares rótulo/valor usado na revisão e nos detalhes da consulta.
 * Cada item aceita `value` (texto) ou `content` (qualquer nó, como o badge).
 */
export default function InfoList({ items }) {
  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <View key={item.label} style={[styles.row, index > 0 && styles.divider]}>
          <Text style={styles.label}>{item.label}</Text>
          {item.content ?? <Text style={styles.value}>{item.value}</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadow,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  row: {
    gap: spacing.xs,
    paddingVertical: spacing.lg,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  label: {
    ...typography.label,
  },
  value: {
    ...typography.body,
    fontWeight: '500',
    lineHeight: 21,
  },
});
