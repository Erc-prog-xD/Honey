import { apiFetch } from './api';

export const buscarApiarios = () =>
    apiFetch('/api/Apiario/BuscarApiariosUserLogado');

export const buscarColmeiasDoApiario = (apiarioId) =>
    apiFetch(`/api/Colmeia/BuscarColmeiasDoApiario/${apiarioId}`);
