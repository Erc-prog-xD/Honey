# 🐝 Guia de Conexão Frontend-API - HoneyFlow

## ✅ O que foi corrigido

### 1. **Sistema de Detecção de URL da API**
A URL da API agora é detectada automaticamente:
- **Desenvolvimento**: `http://localhost:8080` (padrão)
- **Variável de Ambiente**: Via `VITE_API_URL` no `.env`

### 2. **Melhorias no tratamento de erros**
O arquivo `api.js` agora faz logs detalhados de:
- ✅ Requisições enviadas (método, URL, headers)
- ✅ Status das respostas (200, 401, 404, 500, etc)
- ✅ Dados retornados pela API
- ✅ Erros com contexto completo

### 3. **Tratamento de Respostas**
- Suporte para respostas 204 (No Content)
- Parsing seguro de JSON
- Mensagens de erro detalhadas

---

## 📋 Checklist de Conexão

### **Backend (NÃO PODE SER ALTERADO)**

- [ ] API rodando em `http://localhost:8080`
- [ ] CORS configurado para aceitar `http://localhost:5173`
- [ ] Banco de dados conectado
- [ ] Migrations aplicadas

**Verificar CORS:**
```bash
# No terminal do backend
# A API deve responder sem erro CORS
```

### **Frontend (SÓ PODE SER ALTERADO)**

- [ ] `.env` criado com `VITE_API_URL=http://localhost:8080`
- [ ] `npm install` executado
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Abrir DevTools (F12) para ver logs [API Request]

---

## 🔧 Como Debugar Conexões

### **1. Verificar Logs do Console**
Abra o DevTools (F12) e procure por logs assim:

```
[HoneyFlow API] Base URL: http://localhost:8080
[API Request]
  Method: POST
  URL: http://localhost:8080/api/Apiario/CriarApiario
  Auth: Bearer token presente
  Body: { ... }

[API Response] 200 OK

[API Data]
  { success: true, id: 123, ... }
```

### **2. Erros Comuns**

#### **❌ "CORS policy"**
```
Access to fetch at 'http://localhost:8080/api/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solução**: Backend não está com CORS configurado corretamente

#### **❌ "Failed to fetch"**
```
TypeError: Failed to fetch at http://localhost:8080/api/...
```
**Solução**: 
- API não está rodando na porta 8080
- Verificar se `localhost:8080` está acessível: abra no navegador `http://localhost:8080/swagger`

#### **❌ "401 Unauthorized"**
```
[API Response] 401 Unauthorized
```
**Solução**:
- Token expirado (fazer login novamente)
- Token inválido (limpar localStorage e fazer login)

#### **❌ "404 Not Found"**
```
[API Response] 404 Not Found
```
**Solução**:
- Endpoint errado no serviço (verificar `apiarioService.js`)
- Nome do controller incorreto
- Método HTTP incorreto (GET vs POST vs PUT vs DELETE)

---

## 🧪 Testar Conexão Manualmente

### **No Console do DevTools:**

```javascript
// 1. Verificar se a API está acessível
fetch('http://localhost:8080/api/Apiario/BuscarApiariosUserLogado', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('Token')}`
    }
})
.then(r => r.json())
.then(d => console.log('Sucesso:', d))
.catch(e => console.error('Erro:', e));

// 2. Verificar se há token
console.log('Token:', localStorage.getItem('Token'));

// 3. Verificar URL da API
console.log('API URL:', 'http://localhost:8080');
```

---

## 📁 Estrutura de Serviços

### **`api.js`** - Camada Base
```javascript
export const apiFetch(endpoint, options)
// Função que faz fetch com autenticação, CORS e tratamento de erros
```

### **`apiarioService.js`** - Serviços de Apiário
```javascript
buscarApiarios() → GET /api/Apiario/BuscarApiariosUserLogado
criarApiario(dados) → POST /api/Apiario/CriarApiario
editarApiario(id, dados) → PUT /api/Apiario/EditarApiario/{id}
deletarApiario(id) → DELETE /api/Apiario/DeletarApiario/{id}
buscarColmeiasDoApiario(id) → GET /api/Colmeia/BuscarColmeiasDoApiario/{id}
criarColmeia(dados) → POST /api/Colmeia/CriarColmeia
editarColmeia(id, dados) → PUT /api/Colmeia/EditarColmeia/{id}
deletarColmeia(id) → DELETE /api/Colmeia/DeletarColmeia/{id}
```

### **`authServices.js`** - Autenticação
```javascript
login(email, password) → POST /api/Auth/Login
register(data) → POST /api/Auth/Register
```

---

## 🚀 Passos Para Conectar Tudo

1. **Iniciar Backend** (Terminal 1)
   ```bash
   cd BackendApi
   dotnet run
   # Deve dizer: "Now listening on: http://localhost:80" 
   # Ou verificar docker-compose
   ```

2. **Iniciar Frontend** (Terminal 2)
   ```bash
   cd Frontend
   npm install
   npm run dev
   # Deve abrir em http://localhost:5173
   ```

3. **Verificar Conexão**
   - Abrir DevTools (F12)
   - Fazer login
   - Procurar por logs `[API Request]` e `[API Response]`

4. **Se houver erros**
   - Copiar mensagem de erro do console
   - Verificar se Backend está rodando
   - Verificar URL em `.env`
   - Fazer logout e login novamente

---

## 💡 Dicas

- Sempre que mudar a URL da API, editar apenas `.env`
- Não precisa reiniciar backend para testes de frontend
- O Vite faz hot reload automaticamente
- Limpar localStorage se houver token inválido: `localStorage.clear()`
- Para produção (Docker), usar `VITE_API_URL=http://api:80` ou equivalente

---

## 📞 Suporte

Se a conexão ainda não funcionar:
1. ✅ Abrir DevTools (F12) → Console
2. ✅ Copiar logs com `[API`
3. ✅ Verificar erro específico
4. ✅ Conferir if Backend está respondendo em `http://localhost:8080/swagger`
