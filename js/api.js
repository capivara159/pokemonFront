//const API_BASE_URL = 'http://localhost:5199/api';

// Substitua pela URL do seu backend (ex: https://pokemon-api.onrender.com)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://seu-backend.vercel.app/api'; 

// Utilitários de Token
export const tokenManager = {
    set: (token) => localStorage.setItem('pokemon_token', token),
    get: () => localStorage.getItem('pokemon_token'),
    remove: () => localStorage.removeItem('pokemon_token'),
    exists: () => !!localStorage.getItem('pokemon_token')
};

// Função principal para requisições
export async function fetchAPI(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (requiresAuth) {
        const token = tokenManager.get();
        if (!token) {
            throw new Error('Token de autenticação não encontrado');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
    }

    return response.json();
}

// Serviços específicos
export const authService = {
    login: (credentials) => fetchAPI('/auth/login', 'POST', credentials, false),
    register: (userData) => fetchAPI('/auth/register', 'POST', userData, false)
};

export const pokemonService = {
    getAll: () => fetchAPI('/pokemons'),
    getById: (id) => fetchAPI(`/pokemons/${id}`),
    create: (pokemon) => fetchAPI('/pokemons', 'POST', pokemon),
    update: (id, pokemon) => fetchAPI(`/pokemons/${id}`, 'PUT', pokemon),
    delete: (id) => fetchAPI(`/pokemons/${id}`, 'DELETE')
};