# 🔌 Referência de Endpoints - HoneyFlow API

## Base URL
```
http://localhost:8080
```

## Headers Necessários
```
Content-Type: application/json
Authorization: Bearer {token}  (em todas as requisições exceto /api/Auth/*)
```

---

## 🔐 Autenticação

### POST `/api/Auth/Login`
**Fazer login e obter token JWT**

Request:
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

Response (200):
```json
{
  "token": "eyJhbGc...",
  "message": "Login realizado com sucesso"
}
```

### POST `/api/Auth/Register`
**Registrar novo usuário**

Request:
```json
{
  "email": "novo@email.com",
  "password": "senha123",
  "name": "Nome do usuário",
  "cpf": "123.456.789-00"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Usuário criado com sucesso"
}
```

---

## 🐝 Apiários

### GET `/api/Apiario/BuscarApiariosUserLogado`
**Buscar todos os apiários do usuário logado**

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "dados": [
    {
      "id": 1,
      "nomeApelido": "Apiário da Colina",
      "tipoDeAbelha": "Apis Mellifera",
      "tipoDeMel": "Mel escuro",
      "atividade": 1,
      "bioma": "Cerrado",
      "coord_X": "-46.6333",
      "coord_Y": "-23.5505",
      "localizacao": {
        "id": 1,
        "rua": "Rua das Flores",
        "bairro": "Centro",
        "cidade": "São Paulo",
        "estado": "SP",
        "descricaoLocal": "Próximo ao parque",
        "referencia": "Próximo à escola"
      }
    }
  ]
}
```

### POST `/api/Apiario/CriarApiario`
**Criar novo apiário**

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "localizacao": {
    "rua": "Rua das Flores",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "descricaoLocal": "Próximo ao parque",
    "referencia": "Próximo à escola"
  },
  "coord_X": "-46.6333",
  "coord_Y": "-23.5505",
  "bioma": "Cerrado",
  "tipoDeAbelha": "Apis Mellifera",
  "tipoDeMel": "Mel escuro",
  "atividade": 1
}
```

Response (200):
```json
{
  "success": true,
  "message": "Apiário criado com sucesso",
  "id": 1,
  "nomeApelido": "Apiário da Colina"
}
```

### PUT `/api/Apiario/EditarApiario/{apiarioId}`
**Editar apiário existente**

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "tipoDeAbelha": "Apis Mellifera Africana",
  "tipoDeMel": "Mel claro",
  "atividade": 1
}
```

Response (200):
```json
{
  "success": true,
  "message": "Apiário atualizado com sucesso"
}
```

### DELETE `/api/Apiario/DeletarApiario/{apiarioId}`
**Deletar apiário**

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "success": true,
  "message": "Apiário deletado com sucesso"
}
```

---

## 🏠 Colmeias

### GET `/api/Colmeia/BuscarColmeiasDoApiario/{apiarioId}`
**Buscar colmeias de um apiário**

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "dados": [
    {
      "id": 1,
      "nomeApelido": "Colmeia A",
      "apiarioId": 1,
      "dataInstalacao": "2024-01-15",
      "statusAtividade": 1,
      "coordLocal": {
        "coord_X": "-46.6333",
        "coord_Y": "-23.5505"
      }
    }
  ]
}
```

### POST `/api/Colmeia/CriarColmeia`
**Criar nova colmeia**

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "nomeApelido": "Colmeia A",
  "apiarioId": 1,
  "dataInstalacao": "2024-01-15",
  "statusAtividade": 1,
  "coordLocal": {
    "coord_X": "-46.6333",
    "coord_Y": "-23.5505"
  }
}
```

Response (200):
```json
{
  "success": true,
  "message": "Colmeia criada com sucesso",
  "id": 1
}
```

### PUT `/api/Colmeia/EditarColmeia/{colmeiaId}`
**Editar colmeia existente**

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "nomeApelido": "Colmeia A - Atualizada",
  "statusAtividade": 1
}
```

Response (200):
```json
{
  "success": true,
  "message": "Colmeia atualizada com sucesso"
}
```

### DELETE `/api/Colmeia/DeletarColmeia/{colmeiaId}`
**Deletar colmeia**

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "success": true,
  "message": "Colmeia deletada com sucesso"
}
```

---

## 📊 Códigos de Status HTTP

| Código | Significado | Ação |
|--------|-------------|------|
| **200** | OK - Sucesso | Use os dados retornados |
| **201** | Created - Criado | Recurso foi criado |
| **204** | No Content - Sem conteúdo | Operação bem-sucedida, sem dados |
| **400** | Bad Request - Requisição inválida | Verifique os dados enviados |
| **401** | Unauthorized - Não autorizado | Fazer login novamente |
| **403** | Forbidden - Proibido | Sem permissão para acessar |
| **404** | Not Found - Não encontrado | Recurso não existe |
| **500** | Server Error - Erro no servidor | Problema no backend |

---

## 🔄 Fluxo de Uso Comum

### 1. Login
```javascript
POST /api/Auth/Login
Response: { token: "..." }
// Salvar token em localStorage
localStorage.setItem('Token', response.token);
```

### 2. Buscar Apiários
```javascript
GET /api/Apiario/BuscarApiariosUserLogado
Header: Authorization: Bearer {token}
Response: { dados: [...] }
```

### 3. Criar Apiário
```javascript
POST /api/Apiario/CriarApiario
Header: Authorization: Bearer {token}
Body: { localizacao, coord_X, coord_Y, ... }
Response: { success: true, id: 1 }
```

### 4. Buscar Colmeias
```javascript
GET /api/Colmeia/BuscarColmeiasDoApiario/{apiarioId}
Header: Authorization: Bearer {token}
Response: { dados: [...] }
```

### 5. Criar Colmeia
```javascript
POST /api/Colmeia/CriarColmeia
Header: Authorization: Bearer {token}
Body: { nomeApelido, apiarioId, ... }
Response: { success: true, id: 1 }
```

---

## 🐛 Erros Comuns e Soluções

### 401 Unauthorized
```json
{
  "message": "Token inválido ou expirado"
}
```
**Solução:** Fazer login novamente

### 400 Bad Request
```json
{
  "message": "Campo obrigatório faltando",
  "erro": "tipoDeAbelha"
}
```
**Solução:** Adicionar o campo obrigatório

### 404 Not Found
```json
{
  "message": "Apiário não encontrado"
}
```
**Solução:** Verificar se o ID é válido

### 500 Server Error
```json
{
  "message": "Erro interno do servidor"
}
```
**Solução:** Verificar logs do backend

---

## 📝 Tipos de Dados

### Atividade
```
1 = Ativo
0 = Inativo
```

### Status de Atividade (Colmeia)
```
1 = Ativa
0 = Inativa
```

### Bioma
```
"Cerrado"
"Mata Atlântica"
"Amazônia"
"Caatinga"
"Pantanal"
"Pampas"
"Costeiro"
```

### Tipo de Abelha
```
"Apis Mellifera"
"Apis Mellifera Africana"
"Apis Mellifera Carnica"
"Apis Mellifera Caucasiana"
"Stingless Bees"
```

---

## 🔗 Relação entre Entidades

```
User (1) ──── (N) Apiario
             │
             └─ (N) Colmeia
                    │
                    └─ (N) Producao
                    │
                    └─ (N) MovimentoMel
```

---

## 🧪 Testando via cURL

### Login
```bash
curl -X POST http://localhost:8080/api/Auth/Login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456"}'
```

### Buscar Apiários
```bash
curl -X GET http://localhost:8080/api/Apiario/BuscarApiariosUserLogado \
  -H "Authorization: Bearer {seu-token}"
```

### Criar Apiário
```bash
curl -X POST http://localhost:8080/api/Apiario/CriarApiario \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu-token}" \
  -d '{
    "tipoDeAbelha": "Apis Mellifera",
    "tipoDeMel": "Mel escuro",
    "bioma": "Cerrado",
    "atividade": 1,
    "localizacao": {...},
    "coord_X": "-46.6333",
    "coord_Y": "-23.5505"
  }'
```

---

## 📚 Documentação Interativa

Para explorar a API interativamente, acesse:
```
http://localhost:8080/swagger
```

Você pode:
- ✅ Ver todos os endpoints
- ✅ Ver requisições/respostas esperadas
- ✅ Testar direto no navegador
- ✅ Ver códigos de status

---

## 🔐 Segurança

- ✅ Todos os endpoints (exceto /Auth/*) requerem token
- ✅ Token expira após 24 horas
- ✅ Senhas são hasheadas com bcrypt
- ✅ CORS configurado apenas para frontend
- ✅ Validação de entrada em todos endpoints

---

## 📞 Suporte

Para problemas com endpoints:
1. Verifique o Swagger (http://localhost:8080/swagger)
2. Verifique se tem token válido
3. Verifique os logs no console do Backend
4. Consulte EXEMPLOS_USO_API.js para exemplos

