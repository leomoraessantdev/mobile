import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from './AppButton';
import { colors, spacing, typography } from '../theme';

function Container({ children }) {
  return <View style={styles.container}>{children}</View>;
}

export function LoadingState({ message = 'Carregando...' }) {
  return (
    <Container>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </Container>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Container>
      <Ionicons name="cloud-offline-outline" size={44} color={colors.danger} />
      <Text style={styles.title}>Não foi possível carregar</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <AppButton label="Tentar novamente" onPress={onRetry} style={styles.action} /> : null}
    </Container>
  );
}

export function EmptyState({ title, description, icon = 'calendar-outline' }) {
  return (
    <Container>
      <Ionicons name={icon} size={44} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.message}>{description}</Text> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  title: {
    ...typography.subtitle,
    textAlign: 'center',
  },
  message: {
    ...typography.caption,
    textAlign: 'center',
    lineHeight: 20,
  },
  action: {
    marginTop: spacing.sm,
    alignSelf: 'stretch',
  },
});
