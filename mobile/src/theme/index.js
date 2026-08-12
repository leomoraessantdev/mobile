export const colors = {
  primary: '#0F766E',
  primaryDark: '#0B5A54',
  primarySoft: '#E3F1EF',
  background: '#F4F7F8',
  surface: '#FFFFFF',
  text: '#17272C',
  textMuted: '#657C84',
  border: '#E1E8EA',
  danger: '#C0392B',
  dangerSoft: '#FBEAE7',
  overlay: 'rgba(23, 39, 44, 0.45)',
};

/** Cada status precisa ser reconhecivel de relance na lista do historico. */
export const statusColors = {
  agendado: { text: '#1D4ED8', background: '#E6EDFD' },
  confirmado: { text: '#0F766E', background: '#DCF0ED' },
  realizado: { text: '#475569', background: '#EDF1F5' },
  cancelado: { text: '#C0392B', background: '#FBEAE7' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, color: colors.text },
  caption: { fontSize: 13, color: colors.textMuted },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
};

export const shadow = {
  shadowColor: '#0B2B33',
  shadowOpacity: 0.07,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};
