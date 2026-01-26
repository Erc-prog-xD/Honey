const API_BASE_URL = 'http://localhost:8080';

/**
 * Decodifica um token JWT e retorna o payload
 * @param {string} token - Token JWT
 * @returns {object|null} - Payload decodificado ou null se inválido
 */
export const decodeJWT = (token) => {
    try {
        if (!token) return null;

        // O JWT tem 3 partes separadas por ponto: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Decodifica a parte do payload (segunda parte)
        const payload = JSON.parse(atob(parts[1]));

        // Mapeia as claims do .NET para nomes mais amigáveis
        return {
            id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            email: payload['Email'],
            cpf: payload['Cpf'],
            role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            exp: payload['exp']
        };
    } catch (error) {
        console.error('%c[JWT Decode Error]:', 'color: #ef4444;', error);
        return null;
    }
};

/**
 * Verifica se o usuário atual é administrador
 * @returns {boolean}
 */
export const isAdmin = () => {
    const token = localStorage.getItem('Token');
    const decoded = decodeJWT(token);
    return decoded?.role === 'Admin';
};

/**
 * Retorna os dados do usuário atual a partir do token
 * @returns {object|null}
 */
export const getCurrentUser = () => {
    const token = localStorage.getItem('Token');
    return decodeJWT(token);
};

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('Token');

    // DEBUG: Informações da requisição enviada
    console.log(`%c[API Request] %c${options.method || 'GET'} %c${API_BASE_URL}${endpoint}`,
        'color: #3b82f6; font-weight: bold;', 'color: #10b981;', 'color: #6b7280;');
    if (options.body) {
        console.log('%c[Payload]:', 'color: #f59e0b; font-weight: bold;', JSON.parse(options.body));
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        });

        // DEBUG: Informações do status da resposta
        console.log(`%c[API Response Status]: %c${response.status} ${response.statusText}`,
            'color: #3b82f6; font-weight: bold;',
            response.ok ? 'color: #10b981;' : 'color: #ef4444;');

        const data = await response.json();

        // DEBUG: Dados recebidos
        console.log('%c[API Response Data]:', 'color: #10b981; font-weight: bold;', data);

        if (!response.ok) {
            throw data;
        }

        return data;
    } catch (error) {
        // DEBUG: Erros capturados
        console.error('%c[API Error]:', 'color: #ef4444; font-weight: bold;', error);
        throw error;
    }
};
