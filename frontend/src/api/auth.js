import axios from 'axios';

const BASE = 'http://localhost:8000/api';

export async function login(email, password) {
    const res = await axios.post(`${BASE}/token/`, {email, password});
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    return res.data;
}

export async function register(name, email, phone, password) {
    const res = await axios.post(`${BASE}/register/`, {name, email, phone, password});
    return res.data;
}

export function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}
