import { useCallback, useEffect, useState } from 'react';

import { toFriendlyMessage } from '../utils/errors';

/**
 * Centraliza o ciclo carregando / erro / conteúdo das telas que leem a API.
 * `request` precisa vir de um useCallback para o efeito não repetir a busca.
 */
export default function useApiData(request, fallbackMessage) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const run = useCallback(
    async (setBusy) => {
      setBusy(true);
      setError(null);

      try {
        setData(await request());
      } catch (requestError) {
        setError(toFriendlyMessage(requestError, fallbackMessage));
      } finally {
        setBusy(false);
      }
    },
    [request, fallbackMessage],
  );

  const load = useCallback(() => run(setLoading), [run]);
  const refresh = useCallback(() => run(setRefreshing), [run]);

  // A primeira busca (e cada troca de filtro) nasce aqui de propósito: o efeito
  // é justamente o gatilho da requisição, e o estado de carregamento precisa
  // acompanhar essa troca.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { data, error, loading, refreshing, reload: load, refresh, setData };
}
