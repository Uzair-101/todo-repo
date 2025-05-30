import axios from 'axios';
import authStorage from './authStorage.js';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
    const token = authStorage.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;