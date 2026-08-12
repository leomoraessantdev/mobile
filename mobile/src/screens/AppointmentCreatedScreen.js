import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '../components/AppButton';
import InfoList from '../components/InfoList';
import Screen from '../components/Screen';
import { colors, radius, spacing, typography } from '../theme';
import { formatLongDate } from '../utils/date';

/**
 * O fluxo termina aqui, e não em um "voltar" silencioso: a pilha é reconstruída
 * conforme o destino escolhido para o botão de voltar continuar fazendo sentido.
 */
export default function AppointmentCreatedScreen({ navigation, route }) {
  const { appointment } = route.params;

  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

  const goHistory = () =>
    navigation.reset({ index: 1, routes: [{ name: 'Home' }, { name: 'History' }] });

  const goDetail = () =>
    navigation.reset({
      index: 2,
      routes: [
        { name: 'Home' },
        { name: 'History' },
        { name: 'AppointmentDetail', params: { appointmentId: appointment.id } },
      ],
    });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={40} color={colors.surface} />
        </View>

        <Text style={styles.title}>Consulta agendada!</Text>
        <Text style={styles.subtitle}>
          {`Guardamos seu horário com ${appointment.professional.name}. O status inicial é “${appointment.status_label}”.`}
        </Text>

        <InfoList
          items={[
            { label: 'Especialidade', value: appointment.professional.specialty.name },
            { label: 'Profissional', value: appointment.professional.name },
            { label: 'Data', value: formatLongDate(appointment.appointment_date) },
            { label: 'Horário', value: appointment.appointment_time },
          ]}
        />

        <View style={styles.actions}>
          <AppButton label="Ver a consulta" onPress={goDetail} />
          <AppButton label="Ir para o histórico" variant="secondary" onPress={goHistory} />
          <AppButton label="Voltar ao início" variant="secondary" onPress={goHome} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  badge: {
    alignSelf: 'center',
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
});
