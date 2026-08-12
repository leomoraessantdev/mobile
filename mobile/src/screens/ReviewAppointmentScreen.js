import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import AppButton from '../components/AppButton';
import Banner from '../components/Banner';
import InfoList from '../components/InfoList';
import Screen from '../components/Screen';
import StepHeader from '../components/StepHeader';
import { createAppointment } from '../api/appointments';
import { spacing, typography } from '../theme';
import { DEMO_PATIENT } from '../utils/config';
import { formatLongDate, isPastDate } from '../utils/date';
import { toFriendlyMessage } from '../utils/errors';

/**
 * Checagem só de experiência: quem garante as regras é o backend. Serve para
 * o usuário não perder uma requisição por um dado que já sabemos estar errado.
 */
function findLocalProblem({ specialty, professional, date, time }) {
  if (!specialty || !professional) {
    return 'Volte e escolha a especialidade e o profissional.';
  }

  if (!date || !time) {
    return 'Volte e escolha a data e o horário.';
  }

  if (isPastDate(date)) {
    return 'A data escolhida já passou. Volte e selecione outra.';
  }

  return null;
}

export default function ReviewAppointmentScreen({ navigation, route }) {
  const { specialty, professional, date, time, notes } = route.params;
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function confirm() {
    const localProblem = findLocalProblem(route.params);

    if (localProblem) {
      setError(localProblem);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const appointment = await createAppointment({
        patient_id: DEMO_PATIENT.id,
        professional_id: professional.id,
        appointment_date: date,
        appointment_time: time,
        notes: notes || null,
      });

      navigation.replace('AppointmentCreated', { appointment });
    } catch (requestError) {
      setError(
        `Não foi possível agendar: ${toFriendlyMessage(requestError, 'tente novamente em instantes.')}`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen
      footer={
        <AppButton label="Confirmar agendamento" onPress={confirm} loading={submitting} />
      }
    >
      <ScrollView contentContainerStyle={styles.content}>
        <StepHeader
          step={4}
          title="Confira antes de confirmar"
          description="Você ainda pode voltar e alterar qualquer item."
        />

        {error ? <Banner message={error} style={styles.banner} /> : null}

        <InfoList
          items={[
            { label: 'Paciente', value: DEMO_PATIENT.name },
            { label: 'Especialidade', value: specialty.name },
            { label: 'Profissional', value: professional.name },
            { label: 'Data', value: formatLongDate(date) },
            { label: 'Horário', value: time },
            { label: 'Observações', value: notes || 'Nenhuma observação informada.' },
          ]}
        />

        <Text style={styles.note}>
          A consulta será criada com o status “agendado”. Você pode cancelá-la depois pelo histórico.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  banner: {
    marginBottom: spacing.lg,
  },
  note: {
    ...typography.caption,
    marginTop: spacing.lg,
    textAlign: 'center',
    lineHeight: 18,
  },
});
