import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';

import AppointmentCard from '../components/AppointmentCard';
import Screen from '../components/Screen';
import StatusFilter from '../components/StatusFilter';
import { EmptyState, ErrorState, LoadingState } from '../components/StateView';
import useApiData from '../hooks/useApiData';
import { fetchAppointments } from '../api/appointments';
import { colors, spacing } from '../theme';
import { DEMO_PATIENT } from '../utils/config';

const EMPTY_DESCRIPTIONS = {
  '': 'Quando você agendar uma consulta, ela aparece aqui.',
  agendado: 'Você não tem consultas agendadas no momento.',
  confirmado: 'Nenhuma consulta confirmada até agora.',
  realizado: 'Nenhuma consulta realizada até agora.',
  cancelado: 'Nenhuma consulta cancelada até agora.',
};

export default function HistoryScreen({ navigation }) {
  const [status, setStatus] = useState('');

  const request = useCallback(
    () => fetchAppointments({ patientId: DEMO_PATIENT.id, status }),
    [status],
  );

  const { data: appointments, error, loading, refreshing, reload, refresh } = useApiData(
    request,
    'Não foi possível carregar o histórico.',
  );

  /*
   * Ao voltar dos detalhes a lista precisa refletir um eventual cancelamento.
   * `refresh` ganha uma identidade nova a cada filtro; mantê-lo em uma ref
   * deixa o efeito preso ao foco da tela e evita uma segunda requisição junto
   * com a que a troca de filtro já dispara.
   */
  const refreshRef = useRef(refresh);
  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        refreshing ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Atualizar lista de consultas"
            onPress={refresh}
            hitSlop={12}
          >
            <Ionicons name="refresh" size={22} color={colors.primaryDark} />
          </Pressable>
        ),
    });
  }, [navigation, refresh, refreshing]);

  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }

      refreshRef.current();
    }, []),
  );

  function renderBody() {
    if (loading) {
      return <LoadingState message="Buscando suas consultas..." />;
    }

    if (error) {
      return <ErrorState message={error} onRetry={reload} />;
    }

    return (
      <FlatList
        data={appointments}
        keyExtractor={(appointment) => String(appointment.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState title="Nenhuma consulta encontrada." description={EMPTY_DESCRIPTIONS[status]} />
        }
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
          />
        )}
      />
    );
  }

  return (
    <Screen>
      <StatusFilter value={status} onChange={setStatus} />

      {renderBody()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
});
