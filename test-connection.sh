#!/bin/bash
# Script para testar conexão frontend-api

echo "🐝 HoneyFlow - Verificação de Conexão"
echo "===================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar API
echo -e "${YELLOW}Verificando API em http://localhost:8080...${NC}"
if curl -s http://localhost:8080/swagger >/dev/null 2>&1; then
    echo -e "${GREEN}✅ API está respondendo${NC}"
else
    echo -e "${RED}❌ API não está respondendo em localhost:8080${NC}"
    echo "   Certifique-se de que o backend está rodando"
fi

# Verificar Frontend
echo ""
echo -e "${YELLOW}Verificando Frontend em http://localhost:5173...${NC}"
if curl -s http://localhost:5173 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend está respondendo${NC}"
else
    echo -e "${RED}❌ Frontend não está respondendo em localhost:5173${NC}"
    echo "   Execute: npm run dev"
fi

# Verificar .env
echo ""
echo -e "${YELLOW}Verificando arquivo .env...${NC}"
if [ -f "Frontend/.env" ]; then
    echo -e "${GREEN}✅ Arquivo .env encontrado${NC}"
    grep "VITE_API_URL" Frontend/.env || echo "⚠️  Variável VITE_API_URL não encontrada"
else
    echo -e "${RED}❌ Arquivo .env não encontrado${NC}"
    echo "   Copie o .env.example para .env"
fi

echo ""
echo "===================================="
echo "Abra o DevTools (F12) para verificar logs [API Request]"
