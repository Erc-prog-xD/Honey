/**
 * 🐝 Exemplos de Uso - HoneyFlow API
 * 
 * Estes são exemplos de como usar os serviços do frontend
 * para conectar com a API do backend
 */

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

import { login, register } from './services/authServices';
import { apiFetch, decodeJWT, getCurrentUser } from './services/api';

// Exemplo 1: Login
async function exemploLogin() {
    try {
        const response = await login('usuario@email.com', 'senha123');
        
        // Armazenar token (normalmente feito automaticamente)
        localStorage.setItem('Token', response.token);
        
        console.log('Usuário logado:', response);
    } catch (error) {
        console.error('Erro no login:', error.message);
    }
}

// Exemplo 2: Decodificar token do usuário
async function exemploObterUsuario() {
    const user = getCurrentUser();
    console.log('Usuário atual:', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    });
}

// ============================================================================
// APIÁRIOS
// ============================================================================

import { 
    buscarApiarios, 
    criarApiario, 
    editarApiario, 
    deletarApiario 
} from './services/apiarioService';

// Exemplo 3: Buscar todos os apiários do usuário logado
async function exemploBuscarApiarios() {
    try {
        const response = await buscarApiarios();
        
        // A resposta pode vir com estrutura wrapper { dados: [...] }
        const apiarios = response.dados || response;
        
        console.log('Apiários encontrados:', apiarios);
        
        // Iterar sobre apiários
        apiarios.forEach(apiario => {
            console.log(`${apiario.nomeApelido} - ${apiario.tipoDeAbelha}`);
        });
    } catch (error) {
        console.error('Erro ao buscar apiários:', error.message);
    }
}

// Exemplo 4: Criar novo apiário
async function exemploCriarApiario() {
    try {
        const novoApiario = {
            localizacao: {
                rua: "Rua das Flores",
                bairro: "Centro",
                cidade: "São Paulo",
                estado: "SP",
                descricaoLocal: "Próximo ao parque",
                referencia: "Próximo à escola"
            },
            coord_X: "-46.6333", // Longitude
            coord_Y: "-23.5505", // Latitude
            bioma: "Cerrado",
            tipoDeAbelha: "Apis Mellifera",
            tipoDeMel: "Mel escuro",
            atividade: 1 // 1 = Ativo
        };
        
        const response = await criarApiario(novoApiario);
        console.log('Apiário criado:', response);
        
        return response.id; // Usar este ID para próximas operações
    } catch (error) {
        console.error('Erro ao criar apiário:', error.message);
    }
}

// Exemplo 5: Editar apiário existente
async function exemploEditarApiario(apiarioId) {
    try {
        const atualizacoes = {
            tipoDeAbelha: "Apis Mellifera Africana",
            atividade: 1
        };
        
        const response = await editarApiario(apiarioId, atualizacoes);
        console.log('Apiário atualizado:', response);
    } catch (error) {
        console.error('Erro ao editar apiário:', error.message);
    }
}

// Exemplo 6: Deletar apiário
async function exemploDeletarApiario(apiarioId) {
    try {
        const response = await deletarApiario(apiarioId);
        console.log('Apiário deletado:', response);
    } catch (error) {
        console.error('Erro ao deletar apiário:', error.message);
    }
}

// ============================================================================
// COLMEIAS
// ============================================================================

import { 
    buscarColmeiasDoApiario, 
    criarColmeia, 
    editarColmeia, 
    deletarColmeia 
} from './services/apiarioService';

// Exemplo 7: Buscar colmeias de um apiário
async function exemploBuscarColmeias(apiarioId) {
    try {
        const response = await buscarColmeiasDoApiario(apiarioId);
        
        const colmeias = response.dados || response;
        
        console.log(`Colmeias do apiário ${apiarioId}:`, colmeias);
    } catch (error) {
        console.error('Erro ao buscar colmeias:', error.message);
    }
}

// Exemplo 8: Criar nova colmeia
async function exemploCriarColmeia(apiarioId) {
    try {
        const novaColmeia = {
            nomeApelido: "Colmeia A",
            apiarioId: apiarioId,
            dataInstalacao: "2024-01-15",
            statusAtividade: 1, // 1 = Ativa
            coordLocal: {
                coord_X: "-46.6333",
                coord_Y: "-23.5505"
            }
        };
        
        const response = await criarColmeia(novaColmeia);
        console.log('Colmeia criada:', response);
        
        return response.id;
    } catch (error) {
        console.error('Erro ao criar colmeia:', error.message);
    }
}

// Exemplo 9: Editar colmeia
async function exemploEditarColmeia(colmeiaId) {
    try {
        const atualizacoes = {
            nomeApelido: "Colmeia A - Atualizada",
            statusAtividade: 1
        };
        
        const response = await editarColmeia(colmeiaId, atualizacoes);
        console.log('Colmeia atualizada:', response);
    } catch (error) {
        console.error('Erro ao editar colmeia:', error.message);
    }
}

// Exemplo 10: Deletar colmeia
async function exemploDeletarColmeia(colmeiaId) {
    try {
        const response = await deletarColmeia(colmeiaId);
        console.log('Colmeia deletada:', response);
    } catch (error) {
        console.error('Erro ao deletar colmeia:', error.message);
    }
}

// ============================================================================
// REQUISIÇÕES DIRETAS COM apiFetch (Para casos especiais)
// ============================================================================

// Exemplo 11: Fazer uma requisição GET personalizada
async function exemploRequisicaoGet() {
    try {
        const data = await apiFetch('/api/Apiario/BuscarApiariosUserLogado');
        console.log('Dados:', data);
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Exemplo 12: Fazer uma requisição POST personalizada
async function exemploRequisicaoPost() {
    try {
        const data = await apiFetch('/api/Apiario/CriarApiario', {
            method: 'POST',
            body: JSON.stringify({
                tipoDeAbelha: "Apis Mellifera",
                // ... outros campos
            })
        });
        console.log('Dados:', data);
    } catch (error) {
        console.error('Erro:', error);
    }
}

// ============================================================================
// PADRÃO DE USO EM COMPONENTES REACT
// ============================================================================

import React, { useState, useEffect } from 'react';

export function MeuComponente() {
    const [apiarios, setApiarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    
    // Carregar dados quando o componente montar
    useEffect(() => {
        carregarApiarios();
    }, []);
    
    async function carregarApiarios() {
        setLoading(true);
        setErro(null);
        
        try {
            const response = await buscarApiarios();
            const dados = response.dados || response;
            setApiarios(dados);
        } catch (error) {
            setErro(error.message);
            console.error('Erro ao carregar:', error);
        } finally {
            setLoading(false);
        }
    }
    
    if (loading) return <div>Carregando...</div>;
    if (erro) return <div>Erro: {erro}</div>;
    
    return (
        <div>
            {apiarios.map(apiario => (
                <div key={apiario.id}>
                    <h3>{apiario.nomeApelido}</h3>
                    <p>{apiario.tipoDeAbelha}</p>
                </div>
            ))}
        </div>
    );
}

// ============================================================================
// TRATAMENTO DE ERROS COMUM
// ============================================================================

// Exemplo 13: Tratamento robusto de erros
async function exemploTratamentoErros() {
    try {
        const response = await buscarApiarios();
        
        // Validar resposta
        if (!response) {
            throw new Error('Resposta vazia da API');
        }
        
        const dados = Array.isArray(response) ? response : response.dados;
        if (!Array.isArray(dados)) {
            throw new Error('Formato de resposta inválido');
        }
        
        console.log('Sucesso:', dados);
    } catch (error) {
        if (error.message.includes('401')) {
            // Não autorizado - redirecionar para login
            console.log('Sessão expirada, faça login novamente');
        } else if (error.message.includes('Failed to fetch')) {
            // Erro de conexão
            console.log('Erro de conexão com a API');
        } else {
            // Outro erro
            console.log('Erro:', error.message);
        }
    }
}

// ============================================================================
// DICAS IMPORTANTES
// ============================================================================

/*
✅ SEMPRE FAZER:
   - Usar try/catch em todas as chamadas assíncronas
   - Validar resposta da API antes de usar
   - Mostrar mensagens de erro ao usuário
   - Usar loading states durante requisições
   - Armazenar token após login

❌ NUNCA FAZER:
   - Chamar `apiFetch` diretamente em componentes (usar serviços)
   - Armazenar senhas no localStorage
   - Assumir estrutura da resposta sem validar
   - Ignorar erros 401 (sempre fazer logout)
   - Fazer requisições em loops sem tratamento

📝 ESTRUTURA DA RESPOSTA COMUM:
   {
       "success": true,
       "message": "Operação realizada",
       "dados": [...],
       "id": 123
   }
   
   ou em caso de erro:
   {
       "success": false,
       "message": "Descrição do erro",
       "erro": "Detalhes técnicos"
   }

🔐 AUTENTICAÇÃO:
   - Token é armazenado automaticamente em localStorage
   - Token é enviado automaticamente em todas as requisições
   - 401 limpa automaticamente o localStorage
   - Fazer logout removendo o token e redirecionando
*/
