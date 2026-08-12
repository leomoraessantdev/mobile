import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import AppButton from '../components/AppButton';
import Banner from '../components/Banner';
import ConfirmDialog from '../components/ConfirmDialog';
import InfoList from '../components/InfoList';
import Screen from '../components/Screen';
import StatusBadge from '../components/StatusBadge';
import { ErrorState, LoadingState } from '../components/StateView';
import useApiData from '../hooks/useApiData';
import { cancelAppointment, fetchAppointment } from '../api/appointments';
import { spacing, typography } from '../theme';
import { formatLongDate } from '../utils/date';
import { toFriendlyMessage } from '../utils/errors';

export default function AppointmentDetailScreen({ route }) {
  const { appointmentId } = route.params;

  const request = useCallback(() => fetchAppointment(appointmentId), [appointmentId]);
  const { data: appointment, error, loading, reload, setData } = useApiData(
    request,
    'Não foi possível carregar os detalhes da consulta.',
  );

  const [confirming, setConfirming] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function confirmCancellation() {
    setCanceling(true);
    setFeedback(null);

    try {
      setData(await cancelAppointment(appointmentId));
      setFeedback({ tone: 'success', message: 'Consulta cancelada com sucesso.' });
    } catch (requestError) {
      const detail = toFriendlyMessage(requestError, 'tente novamente em instantes.');
      setFeedback({ tone: 'error', message: `Não foi possível cancelar: ${detail}` });
    } finally {
      setCanceling(false);
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <Screen>
        <LoadingState message="Carregando a consulta..." />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorState message={error} onRetry={reload} />
      </Screen>
    );
  }

  const when = `${formatLongDate(appointment.appointment_date)} às ${appointment.appointment_time}`;

  return (
    <Screen
      footer={
        appointment.can_cancel ? (
          <AppButton label="Cancelar consulta" variant="danger" onPress={() => setConfirming(true)} />
        ) : null
      }
    >
      <ScrollView contentContainerStyle={styles.content}>
        {feedback ? (
          <Banner tone={feedback.tone} message={feedback.message} style={styles.banner} />
        ) : null}

        <InfoList
          items={[
            {
              label: 'Status',
              content: <StatusBadge status={appointment.status} label={appointment.status_label} />,
            },
            { label: 'Paciente', value: appointment.patient.name },
            { label: 'Especialidade', value: appointment.professional.specialty.name },
            { label: 'Profissional', value: appointment.professional.name },
            { label: 'Data', value: formatLongDate(appointment.appointment_date) },
            { label: 'Horário', value: appointment.appointment_time },
            { label: 'Observações', value: appointment.notes || 'Nenhuma observação informada.' },
          ]}
        />

        {appointment.can_cancel ? null : (
          <Text style={styles.note}>
            Consultas realizadas ou canceladas ficam disponíveis apenas para consulta.
          </Text>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={confirming}
        title="Cancelar consulta"
        message={`Tem certeza que deseja cancelar a consulta de ${when}?`}
        confirmLabel="Sim, cancelar"
        cancelLabel="Manter"
        loading={canceling}
        onConfirm={confirmCancellation}
        onCancel={() => setConfirming(false)}
      />
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
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
  },
});
