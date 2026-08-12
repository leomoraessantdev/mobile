const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

const WEEKDAYS = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

/** Datas trafegam sempre como "YYYY-MM-DD", o mesmo formato aceito pela API. */
export function toIsoDate(date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
}

export function today() {
  return toIsoDate(new Date());
}

function parts(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);

  // Construir a partir dos componentes evita o deslocamento de fuso que
  // new Date('YYYY-MM-DD') aplica ao interpretar a string como UTC.
  return new Date(year, month - 1, day);
}

export function formatDate(isoDate) {
  const date = parts(isoDate);

  return `${`${date.getDate()}`.padStart(2, '0')}/${`${date.getMonth() + 1}`.padStart(2, '0')}/${date.getFullYear()}`;
}

export function formatLongDate(isoDate) {
  const date = parts(isoDate);

  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

export function isPastDate(isoDate) {
  return isoDate < today();
}
