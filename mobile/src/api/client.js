import { create } from 'axios';

import { API_BASE_URL } from '../utils/config';

/**
 * Instância única do Axios: a URL da API vive só aqui e em src/utils/config.js.
 */
export const api = create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

/** Todas as respostas da API vêm embrulhadas em { "data": ... }. */
export function unwrap(response) {
  return response.data.data;
}
