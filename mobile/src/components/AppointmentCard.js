import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import StatusBadge from './StatusBadge';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { formatDate } from '../utils/date';

export default function AppointmentCard({ appointment, onPress }) {
  const { professional, appointment_date: date, appointment_time: time } = appointment;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.specialty}>{professional.specialty.name}</Text>
          <Text style={styles.professional}>{professional.name}</Text>
        </View>
        <StatusBadge status={appointment.status} label={appointment.status_label} />
      </View>

      <View style={styles.footer}>
        <View style={styles.meta}>
          <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
          <Text style={styles.metaText}>{formatDate(date)}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={15} color={colors.textMuted} />
          <Text style={styles.metaText}>{time}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={styles.chevron} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadow,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  specialty: {
    ...typography.label,
    color: colors.primary,
  },
  professional: {
    ...typography.subtitle,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  metaText: {
    ...typography.caption,
    color: colors.text,
  },
  chevron: {
    marginLeft: 'auto',
  },
});
