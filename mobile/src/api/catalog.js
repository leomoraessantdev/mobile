import { api, unwrap } from './client';

export async function fetchSpecialties() {
  return unwrap(await api.get('/specialties'));
}

export async function fetchProfessionals(specialtyId) {
  return unwrap(await api.get('/professionals', { params: { specialty_id: specialtyId } }));
}
