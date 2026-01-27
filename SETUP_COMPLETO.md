# 🚀 Setup Completo - HoneyFlow

## 📋 Pré-requisitos

- Node.js v16+ instalado
- .NET 9.0 SDK instalado
- SQL Server 2022 (ou Docker com Docker Compose)
- Git instalado

---

## 🔧 Backend Setup (Não pode ser alterado)

### 1. Restaurar dependências
```bash
cd BackendApi
dotnet restore
```

### 2. Aplicar migrations
```bash
dotnet ef database update
```

### 3. Rodando a API
```bash
dotnet run
```

**Esperado:**
```
Now listening on: http://localhost:80
Application started. Press Ctrl+C to exit.
```

Ou se usar Docker:
```bash
docker-compose up -d api
```

---

## 🎨 Frontend Setup (Apenas isso pode ser alterado)

### 1. Instalar dependências
```bash
cd Frontend
npm install
```

### 2. Criar arquivo .env
Copie `.env.example` e renomeie para `.env`:

```bash
cp .env.example .env
```

**Conteúdo do `.env`:**
```
VITE_API_URL=http://localhost:8080
```

### 3. Rodar servidor de desenvolvimento
```bash
npm run dev
```

**Esperado:**
```
  VITE v7.2.4  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## ✅ Validação de Conexão

### 1. Verificar se API está rodando
Abra no navegador: http://localhost:8080/swagger

Você deve ver a documentação interativa do Swagger com os endpoints da API.

### 2. Verificar DevTools (F12)
No console do navegador, procure por logs assim:

```
[HoneyFlow API] Base URL: http://localhost:8080
```

### 3. Fazer teste de login
1. Vá para http://localhost:5173
2. Use credenciais de teste
3. Abra DevTools (F12) → Console
4. Você deve ver logs com [API Request] e [API Response]

---

## 🐛 Troubleshooting

### Erro: "CORS policy blocked"

**Causa:** Frontend não está autorizado a acessar a API

**Solução:** 
- Verificar se Backend está com CORS configurado
- Verificar se Frontend está em http://localhost:5173
- Restart Backend

```bash
# Terminal Backend
dotnet run
```

### Erro: "Failed to fetch"

**Causa:** Backend não está respondendo

**Solução:**
- Verificar se Backend está rodando
- Verificar se está na porta 8080
- Abrir http://localhost:8080 no navegador

### Erro: "401 Unauthorized"

**Causa:** Token inválido ou expirado

**Solução:**
- Fazer logout (sai do app)
- Fazer login novamente
- Abrir DevTools → Application → Clear All Site Data

### Erro: "404 Not Found"

**Causa:** Endpoint errado

**Solução:**
- Verificar logs no console (vê qual URL foi chamada)
- Comparar com endpoints no Swagger da API
- Verificar nomes de controllers/métodos

---

## 📱 Usando via Docker Compose

### 1. Certificar que Docker está rodando

```bash
docker --version
```

### 2. Iniciar tudo de uma vez

```bash
docker-compose up -d
```

### 3. Verificar status

```bash
docker-compose ps
```

Esperado:
```
NAME                    STATUS
HoneyFlorAPI           Up
HoneyFlorFrontend      Up
Honey_flow_DB          Up
```

### 4. Verificar logs

```bash
docker-compose logs -f api
docker-compose logs -f frontend
```

### 5. Parar tudo

```bash
docker-compose down
```

---

## 🧪 Fluxo de Teste Completo

1. **Iniciar Backend**
   ```bash
   cd BackendApi && dotnet run
   ```

2. **Iniciar Frontend** (novo terminal)
   ```bash
   cd Frontend && npm run dev
   ```

3. **Abrir no navegador**
   ```
   http://localhost:5173
   ```

4. **Fazer login**
   - Email: usuario@teste.com
   - Senha: senha123

5. **Verificar console (F12)**
   - Procurar por [API Request]
   - Procurar por [API Response]

6. **Testar funcionalidades**
   - Criar apiário
   - Editar apiário
   - Deletar apiário

---

## 📂 Estrutura Importante

```
Frontend/
├── .env                 ← Variáveis de ambiente (VITE_API_URL)
├── src/
│   └── services/
│       ├── api.js       ← Função apiFetch (NÃO MUDAR)
│       ├── apiarioService.js  ← Serviços de apiário
│       └── authServices.js    ← Serviços de autenticação
│   └── pages/           ← Páginas da aplicação
│   └── components/      ← Componentes reutilizáveis
└── vite.config.js       ← Configuração Vite

BackendApi/
├── Program.cs           ← Configuração da API (NÃO MUDAR)
├── Controllers/         ← Endpoints da API
├── Services/            ← Lógica de negócio
├── Models/              ← Modelos de dados
└── Data/                ← Contexto do banco
```

---

## 🔐 Segurança

### Não fazer:

❌ Armazenar senhas em localStorage  
❌ Expor tokens em URLs  
❌ Fazer requisições sem HTTPS em produção  
❌ Assumir dados do usuário sem validar  

### Fazer:

✅ Sempre validar dados antes de enviar à API  
✅ Sempre usar try/catch em requisições  
✅ Sempre mostrar mensagens de erro ao usuário  
✅ Limpar localStorage ao fazer logout  

---

## 🚀 Deploy

### Frontend para Produção

```bash
npm run build
```

Gera pasta `dist/` com arquivos otimizados.

### Com Docker Compose (Recomendado)

```bash
docker-compose -f docker-compose.yml up -d
```

Acessa:
- API: http://seu-host:8080
- Frontend: http://seu-host:5173

---

## 📞 Problemas Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| CORS error | CORS não configurado | Restart Backend |
| 404 Not Found | Endpoint errado | Verificar Swagger |
| 401 Unauthorized | Token inválido | Fazer login novamente |
| Failed to fetch | Backend offline | Iniciar `dotnet run` |
| Port in use | Porta já ocupada | Mudar porta em .env |

---

## ✨ Sucesso!

Se chegou até aqui, está tudo funcionando! 🎉

**Próximos passos:**
1. Explorar endpoints no Swagger (http://localhost:8080/swagger)
2. Testar funcionalidades no Frontend
3. Verificar logs no DevTools (F12)
4. Implementar novos recursos conforme necessário

