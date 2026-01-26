import { apiFetch } from './api';

export const login = (email, password) =>
    apiFetch('/api/Auth/Login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

export const register = (data) =>
    apiFetch('/api/Auth/Register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
