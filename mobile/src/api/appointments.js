import { api, unwrap } from './client';

export async function fetchAppointments({ patientId, status }) {
  return unwrap(
    await api.get('/appointments', {
      params: { patient_id: patientId, status: status || undefined },
    }),
  );
}

export async function fetchAppointment(appointmentId) {
  return unwrap(await api.get(`/appointments/${appointmentId}`));
}

export async function createAppointment(payload) {
  return unwrap(await api.post('/appointments', payload));
}

export async function cancelAppointment(appointmentId) {
  return unwrap(await api.patch(`/appointments/${appointmentId}/cancel`));
}
