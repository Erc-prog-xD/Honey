import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Componente para proteger rotas privadas.
 * Se o usuário não existir no localStorage, redireciona para o login.
 */
const ProtectedRoute = ({ children }) => {
    const userString = localStorage.getItem('user');
    let isAuthenticated = false;

    try {
        if (userString) {
            const user = JSON.parse(userString);
            if (user && (user.email || user.name)) {
                isAuthenticated = true;
            }
        }
    } catch (e) {
        isAuthenticated = false;
    }

    if (!isAuthenticated) {
        // Redireciona para login se não estiver autenticado
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
