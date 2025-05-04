const API_BASE_URL = 'https://pokemonapi-freeapp.azurewebsites.net/api';

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

      try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
          
          if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || `Erro na requisição: ${response.status} - ${response.statusText}`);
          }

          return response.json();
      } catch (error) {
          throw new Error(`Falha na comunicação com o servidor: ${error.message}`);
      }
  }

  // Serviços específicos
  export const authService = {
      login: (credentials) => fetchAPI('/Auth/login', 'POST', credentials, false),
      register: (userData) => fetchAPI('/Auth/register', 'POST', userData, false)
  };

  export const pokemonService = {
      getAll: () => fetchAPI('/Pokemons'),
      getById: (id) => fetchAPI(`/Pokemons/${id}`),
      create: (pokemon) => fetchAPI('/Pokemons', 'POST', pokemon),
      update: (id, pokemon) => fetchAPI(`/Pokemons/${id}`, 'PUT', pokemon),
      delete: (id) => fetchAPI(`/Pokemons/${id}`, 'DELETE')
  };