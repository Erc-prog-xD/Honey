// Detecta a URL base da API automaticamente
const getApiBaseUrl = () => {
    // Se houver variável de ambiente
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Em desenvolvimento: localhost:8080
    // Em produção Docker: comunicação interna
    return 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();

console.log('%c[HoneyFlow API] Base URL:', 'color: #f59e0b; font-weight: bold;', API_BASE_URL);

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
    const method = options.method || 'GET';
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    
    console.log(`%c[API Request]`, 'color: #3b82f6; font-weight: bold;');
    console.log(`  Method: ${method}`);
    console.log(`  URL: ${fullUrl}`);
    console.log(`  Auth: ${token ? 'Bearer token presente' : 'Sem autenticação'}`);
    
    if (options.body) {
        try {
            console.log(`  Body:`, JSON.parse(options.body));
        } catch (e) {
            console.log(`  Body:`, options.body);
        }
    }

    try {
        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
        });

        // DEBUG: Informações do status da resposta
        const statusColor = response.ok ? '#10b981' : '#ef4444';
        console.log(`%c[API Response] ${response.status} ${response.statusText}`,
            `color: ${statusColor}; font-weight: bold;`);

        // 1. Tratamento de Não Autorizado (401)
        if (response.status === 401) {
            console.warn("%c[API] Não autorizado (401). Limpando sessão...", 'color: #ef4444; font-weight: bold;');
            localStorage.clear();
            window.location.href = '/';
            throw new Error("Sessão expirada. Faça login novamente.");
        }

        // 2. Trata respostas vazias (204 No Content)
        if (response.status === 204) {
            return { success: true };
        }

        // 3. Tenta parsear o JSON com segurança
        let data;
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
            try {
                data = await response.json();
                console.log(`%c[API Data]`, 'color: #10b981; font-weight: bold;', data);
            } catch (jsonError) {
                console.error(`%c[API JSON Parse Error]`, 'color: #ef4444; font-weight: bold;', jsonError);
                if (!response.ok) {
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }
                data = null;
            }
        } else {
            const text = await response.text();
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}: ${text}`);
            }
            data = text ? { message: text } : null;
        }

        // 4. Verifica se é uma resposta de erro do servidor
        if (!response.ok) {
            const errorMsg = data?.message || data?.erro || response.statusText;
            throw new Error(errorMsg);
        }

        return data;
    } catch (error) {
        console.error(`%c[API Error]`, 'color: #ef4444; font-weight: bold;', {
            message: error.message,
            endpoint,
            method,
            timestamp: new Date().toISOString()
        });
        throw error;
    }
};
