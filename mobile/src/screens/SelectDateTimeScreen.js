import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import StepHeader from '../components/StepHeader';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { formatLongDate, today } from '../utils/date';

/** Horários fixos de atendimento — o backend continua sendo quem decide o conflito. */
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const NOTES_LIMIT = 500;

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
};
LocaleConfig.defaultLocale = 'pt-br';

const calendarTheme = {
  todayTextColor: colors.primary,
  arrowColor: colors.primary,
  selectedDayBackgroundColor: colors.primary,
  textDayFontWeight: '500',
  textMonthFontWeight: '700',
  textDisabledColor: '#C4CFD3',
};

export default function SelectDateTimeScreen({ navigation, route }) {
  const { specialty, professional } = route.params;
  const minDate = today();

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [notes, setNotes] = useState('');

  return (
    <Screen
      footer={
        <AppButton
          label="Revisar agendamento"
          disabled={!date || !time}
          onPress={() =>
            navigation.navigate('ReviewAppointment', {
              specialty,
              professional,
              date,
              time,
              notes: notes.trim(),
            })
          }
        />
      }
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <StepHeader step={3} title="Quando fica bom para você?" description={professional.name} />

          <View style={styles.card}>
            <Calendar
              minDate={minDate}
              current={minDate}
              onDayPress={(day) => setDate(day.dateString)}
              markedDates={date ? { [date]: { selected: true } } : {}}
              disableAllTouchEventsForDisabledDays
              hideExtraDays
              theme={calendarTheme}
            />
          </View>

          <Text style={styles.sectionTitle}>Horário</Text>
          <View style={styles.slots}>
            {TIME_SLOTS.map((slot) => {
              const active = slot === time;

              return (
                <Pressable
                  key={slot}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setTime(slot)}
                  style={[styles.slot, active && styles.slotActive]}
                >
                  <Text style={[styles.slotLabel, active && styles.slotLabelActive]}>{slot}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Observações (opcional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Algo que o profissional precise saber antes da consulta"
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={NOTES_LIMIT}
            style={styles.notes}
          />
          <Text style={styles.counter}>{`${notes.length}/${NOTES_LIMIT}`}</Text>

          <Text style={styles.summary}>
            {date && time
              ? `${formatLongDate(date)} às ${time}`
              : 'Escolha uma data e um horário para continuar.'}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    ...shadow,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...typography.label,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slot: {
    minWidth: 84,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  slotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  slotLabelActive: {
    color: colors.surface,
  },
  notes: {
    ...typography.body,
    minHeight: 96,
    textAlignVertical: 'top',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  counter: {
    ...typography.caption,
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  summary: {
    ...typography.caption,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
});
