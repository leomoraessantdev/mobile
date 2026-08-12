import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Screen from '../components/Screen';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { DEMO_PATIENT } from '../utils/config';

const ACTIONS = [
  {
    route: 'SelectSpecialty',
    icon: 'add-circle-outline',
    title: 'Agendar consulta',
    description: 'Escolha a especialidade, o profissional e o melhor horário.',
  },
  {
    route: 'History',
    icon: 'time-outline',
    title: 'Histórico de consultas',
    description: 'Acompanhe seus atendimentos e cancele quando precisar.',
  },
];

function initials(name) {
  return name
    .split(' ')
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
          <Text style={styles.heroLabel}>Agendamento de consultas</Text>
          <Text style={styles.heroTitle}>Cuidar da sua saúde ficou mais simples</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.patientCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(DEMO_PATIENT.name)}</Text>
            </View>
            <View style={styles.patientTexts}>
              <Text style={styles.patientLabel}>Paciente</Text>
              <Text style={styles.patientName}>{DEMO_PATIENT.name}</Text>
              <Text style={styles.patientMeta}>{`Cadastro nº ${DEMO_PATIENT.id}`}</Text>
            </View>
          </View>

          {ACTIONS.map((action) => (
            <Pressable
              key={action.route}
              accessibilityRole="button"
              onPress={() => navigation.navigate(action.route)}
              style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.actionTexts}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Pressable>
          ))}

          <Text style={styles.disclaimer}>
            Versão de demonstração: não há login, todas as consultas pertencem ao paciente acima.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl + spacing.xl,
    borderBottomLeftRadius: radius.lg * 2,
    borderBottomRightRadius: radius.lg * 2,
    gap: spacing.sm,
  },
  heroLabel: {
    ...typography.label,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  heroTitle: {
    ...typography.title,
    color: colors.surface,
    fontSize: 26,
    lineHeight: 34,
  },
  body: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xxl,
    gap: spacing.md,
  },
  patientCard: {
    ...shadow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.subtitle,
    color: colors.primaryDark,
    fontSize: 18,
  },
  patientTexts: {
    flex: 1,
    gap: 2,
  },
  patientLabel: {
    ...typography.label,
  },
  patientName: {
    ...typography.subtitle,
    fontSize: 18,
  },
  patientMeta: {
    ...typography.caption,
  },
  actionCard: {
    ...shadow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTexts: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    ...typography.subtitle,
  },
  actionDescription: {
    ...typography.caption,
    lineHeight: 18,
  },
  disclaimer: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    lineHeight: 18,
  },
});
