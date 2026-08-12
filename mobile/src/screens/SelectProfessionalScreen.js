import { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import SelectableRow from '../components/SelectableRow';
import StepHeader from '../components/StepHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/StateView';
import useApiData from '../hooks/useApiData';
import { fetchProfessionals } from '../api/catalog';
import { spacing } from '../theme';

export default function SelectProfessionalScreen({ navigation, route }) {
  const { specialty } = route.params;
  const [selected, setSelected] = useState(null);

  const request = useCallback(() => fetchProfessionals(specialty.id), [specialty.id]);
  const { data: professionals, error, loading, reload } = useApiData(
    request,
    'Não foi possível carregar os profissionais.',
  );

  if (loading) {
    return (
      <Screen>
        <LoadingState message="Carregando profissionais..." />
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

  return (
    <Screen
      footer={
        <AppButton
          label="Continuar"
          disabled={!selected}
          onPress={() =>
            navigation.navigate('SelectDateTime', { specialty, professional: selected })
          }
        />
      }
    >
      <FlatList
        data={professionals}
        keyExtractor={(professional) => String(professional.id)}
        ListHeaderComponent={
          <StepHeader step={2} title="Com quem você quer se consultar?" description={specialty.name} />
        }
        ListEmptyComponent={
          <EmptyState
            title="Nenhum profissional disponível"
            description={`Ainda não há profissionais cadastrados em ${specialty.name}.`}
            icon="people-outline"
          />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SelectableRow
            title={item.name}
            subtitle={item.specialty?.name}
            selected={selected?.id === item.id}
            onPress={() => setSelected(item)}
          />
        )}
      />
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
