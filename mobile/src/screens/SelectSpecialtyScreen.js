import { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import SelectableRow from '../components/SelectableRow';
import StepHeader from '../components/StepHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/StateView';
import useApiData from '../hooks/useApiData';
import { fetchSpecialties } from '../api/catalog';
import { spacing } from '../theme';

export default function SelectSpecialtyScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const request = useCallback(() => fetchSpecialties(), []);
  const { data: specialties, error, loading, reload } = useApiData(
    request,
    'Não foi possível carregar as especialidades.',
  );

  const header = (
    <StepHeader
      step={1}
      title="Qual especialidade você precisa?"
      description="A lista vem direto do cadastro da clínica."
    />
  );

  if (loading) {
    return (
      <Screen>
        <LoadingState message="Carregando especialidades..." />
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
          onPress={() => navigation.navigate('SelectProfessional', { specialty: selected })}
        />
      }
    >
      <FlatList
        data={specialties}
        keyExtractor={(specialty) => String(specialty.id)}
        ListHeaderComponent={header}
        ListEmptyComponent={<EmptyState title="Nenhuma especialidade cadastrada." icon="medkit-outline" />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SelectableRow
            title={item.name}
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
