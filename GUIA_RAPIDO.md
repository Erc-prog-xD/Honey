# 🐝 HoneyFlow - Guia Rápido de Conexão

## ⚡ Resumo em 2 Minutos

Você precisa de **DUAS** coisas funcionando ao mesmo tempo:

```
🖥️ TERMINAL 1 (Backend)      🖥️ TERMINAL 2 (Frontend)
cd BackendApi                 cd Frontend
dotnet run                    npm run dev

API rodará em:                Frontend rodará em:
http://localhost:8080         http://localhost:5173
```

---

## ✅ Checklist Rápido

### Preparar Frontend (faz UMA VEZ)

```bash
# 1. Ir para a pasta Frontend
cd Frontend

# 2. Copiar arquivo de configuração
cp .env.example .env

# 3. Instalar dependências
npm install
```

### Rodar Frontend

```bash
npm run dev
```

**Esperado:** Abre em http://localhost:5173

### Rodar Backend

```bash
cd BackendApi
dotnet run
```

**Esperado:** "Now listening on: http://localhost:80" ou "http://localhost:8080"

---

## 🔍 Como Saber se Está Funcionando

### 1. Verificar se API está respondendo
Abra no navegador:
```
http://localhost:8080/swagger
```
Se abrir uma página com documentação interativa = ✅ Funcionando

### 2. Verificar se Frontend está respondendo
Abra no navegador:
```
http://localhost:5173
```
Se abrir a página do HoneyFlow = ✅ Funcionando

### 3. Verificar se está conectando
1. Abra http://localhost:5173
2. Aperte F12 para abrir DevTools
3. Procure no Console por logs assim:

```
[HoneyFlow API] Base URL: http://localhost:8080
[API Request]
[API Response] 200 OK
```

Se vê isso = ✅ Funcionando!

---

## ❌ Erros Comuns

### "CORS policy blocked"
**Significa:** Backend não deixa Frontend conectar  
**Solução:** Reinicia Backend com `dotnet run`

### "Failed to fetch" ou "Cannot connect"
**Significa:** Backend não está rodando  
**Solução:** Abra novo terminal e execute `cd BackendApi && dotnet run`

### "401 Unauthorized"
**Significa:** Token expirado  
**Solução:** Faça logout e login novamente

### "404 Not Found"
**Significa:** Endpoint errado ou não existe  
**Solução:** Verificar no Swagger http://localhost:8080/swagger

---

## 🚀 Começar Agora

### Opção 1: Sem Docker (Recomendado para desenvolvimento)

**Terminal 1:**
```bash
cd BackendApi
dotnet run
```

**Terminal 2:**
```bash
cd Frontend
npm run dev
```

Abra http://localhost:5173 no navegador.

### Opção 2: Com Docker

```bash
docker-compose up
```

Aguarde alguns minutos e abra http://localhost:5173

---

## 📝 Estrutura Importante

```
Frontend/
├── .env          ← CRIAR (com VITE_API_URL=http://localhost:8080)
└── src/services/
    └── api.js    ← Responsável por conectar com a API
```

---

## 💡 Dica: Logs Detalhados

O Frontend agora mostra logs completos no console. Abra F12 e procure por:

- `[API Request]` - Mostra o que foi enviado
- `[API Response]` - Mostra a resposta
- `[API Error]` - Mostra erros

Isso ajuda muito no debug!

---

## 🎯 O Que Mudou

Apenas o **Frontend** foi modificado:

✅ Melhorado sistema de detecção da URL da API  
✅ Adicionado logs detalhados  
✅ Adicionado suporte a variáveis de ambiente  
✅ Melhorado tratamento de erros  

❌ Backend não foi alterado (conforme solicitado)

---

## 📞 Precisa de Ajuda?

1. Abra DevTools (F12) → Console
2. Procure por logs com `[API`
3. Veja qual é o erro
4. Consulte a seção "Erros Comuns" acima

Ou leia os arquivos criados:
- `CONEXAO_FRONTEND_API.md` - Guia de Debug
- `SETUP_COMPLETO.md` - Setup completo
- `EXEMPLOS_USO_API.js` - Exemplos de código

---

## ✨ Sucesso!

Se conseguiu ver os logs `[API Request]` e `[API Response]` no console, então **está tudo funcionando!** 🎉

