const NETWORK_MESSAGE =
  'Não foi possível falar com o servidor. Verifique se a API está no ar e se o endereço configurado está correto.';

function firstValidationMessage(errors) {
  const messages = Object.values(errors ?? {}).flat();

  return messages.length > 0 ? messages[0] : null;
}

/**
 * Traduz qualquer falha de requisição em uma frase que faça sentido para o
 * paciente. A mensagem do backend sempre tem prioridade: é ela que carrega a
 * regra de negócio ("horário já ocupado", "consulta não pode ser cancelada").
 */
export function toFriendlyMessage(error, fallback = 'Algo deu errado. Tente novamente em instantes.') {
  const response = error?.response;

  if (!response) {
    return error?.request ? NETWORK_MESSAGE : fallback;
  }

  const { status, data } = response;

  // Em erro 500 a mensagem do Laravel é técnica: melhor manter o texto da tela.
  if (status >= 500) {
    return fallback;
  }

  return firstValidationMessage(data?.errors) ?? data?.message ?? fallback;
}
