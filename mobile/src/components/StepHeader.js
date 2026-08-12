import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

const TOTAL_STEPS = 4;

/** Mostra em qual etapa do agendamento o usuário está. */
export default function StepHeader({ step, title, description }) {
  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
          <View key={index} style={[styles.dot, index < step && styles.dotActive]} />
        ))}
      </View>

      <Text style={styles.counter}>{`Etapa ${step} de ${TOTAL_STEPS}`}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    paddingBottom: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.sm,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  counter: {
    ...typography.label,
    color: colors.primary,
  },
  title: {
    ...typography.title,
    fontSize: 21,
  },
  description: {
    ...typography.caption,
    lineHeight: 20,
  },
});
