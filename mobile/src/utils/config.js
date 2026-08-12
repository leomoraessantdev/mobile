import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 8000;

/**
 * Paciente único da demonstração (criado pelo PatientSeeder do backend).
 * O desafio não pede autenticação, então o app trabalha sempre com ele.
 */
export const DEMO_PATIENT = {
  id: 1,
  name: 'João da Silva',
};

/**
 * O Metro informa em qual host o bundle foi servido. Em dispositivo físico
 * isso é o IP da máquina na rede local, que costuma ser onde a API também
 * está rodando — então o app funciona sem configuração na maioria dos casos,
 * e EXPO_PUBLIC_API_BASE_URL cobre quando a API está em outro endereço.
 */
function hostFromMetro() {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;

  return hostUri ? hostUri.split(':')[0] : null;
}

function resolveBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  const host = hostFromMetro() ?? 'localhost';
  const isLoopback = host === 'localhost' || host === '127.0.0.1';

  // No emulador Android o loopback aponta para o próprio emulador; a máquina
  // que hospeda a API responde em 10.0.2.2.
  if (Platform.OS === 'android' && isLoopback) {
    return `http://10.0.2.2:${API_PORT}/api`;
  }

  return `http://${host}:${API_PORT}/api`;
}

export const API_BASE_URL = resolveBaseUrl();
