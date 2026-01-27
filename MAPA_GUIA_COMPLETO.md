# 🗺️ Guia Completo: Apiário Não Aparece no Mapa

## 📝 Resumo Rápido

**Problema:** Apiário "Maria" selecionado mas não aparece no mapa

**Causa Raiz:** O apiário não tem coordenadas (coord_X, coord_Y) válidas ou não tem polígono desenhado

**Solução Rápida:** 
1. Recarregue a página (F5)
2. Se ainda não aparecer, veja Solução 1 abaixo

---

## 🔧 O Que Foi Corrigido

Melhorias implementadas:

✅ **MapArea.jsx**: Agora renderiza marcadores para apiários sem polígono  
✅ **ApiaryDetails.jsx**: Usa `coord_Y` e `coord_X` da API como fallback  
✅ **Logs melhorados**: Avisa quando coordenadas são inválidas

---

## 🧪 Soluções Passo a Passo

### **Solução 1: Teste a API (5 minutos)**

1. Abra DevTools (F12)
2. Tab "Console"
3. Cole e execute:

```javascript
// 1. Buscar todos os apiários
const resp = await fetch('http://localhost:8080/api/Apiario/BuscarApiariosUserLogado', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
});

// 2. Extrair dados
const data = await resp.json();
console.log('Resposta completa:', data);

// 3. Procurar "Maria"
const maria = data.dados?.find(a => a.nomeApelido?.includes('Maria'));
console.log('=== APIÁRIO MARIA ===');
console.log('ID:', maria?.id);
console.log('Nome:', maria?.nomeApelido);
console.log('coord_X:', maria?.coord_X);
console.log('coord_Y:', maria?.coord_Y);
console.log('Tipo Abelha:', maria?.tipoDeAbelha);
console.log('Localização:', maria?.localizacao);
console.log('');
console.log('Tem coordenadas?', !!maria?.coord_X && !!maria?.coord_Y);
```

**Resultado esperado:**
- ✅ Se mostrar `coord_X` e `coord_Y` com números → Coordenadas OK (vá para Solução 3)
- ❌ Se mostrar `undefined` ou `null` → Sem coordenadas (vá para Solução 2)
- ❌ Se der erro 401 → Token expirado (fazer login novamente)

---

### **Solução 2: Adicionar Coordenadas na API**

Se "Maria" não tem coordenadas:

**Via Interface:**
1. Abra http://localhost:5173/apiario/{id-da-maria}
2. Editar informações do apiário
3. Adicionar localização (rua, bairro, cidade, estado)
4. Salvar

**O sistema deve gerar automaticamente coord_X e coord_Y**

---

### **Solução 3: Recarregar e Testar**

Após garantir que coordenadas existem:

1. Recarregue a página (F5)
2. Abra DevTools (F12)
3. Procure por logs:
   - `[API Request] GET /api/Apiario/BuscarApiariosUserLogado`
   - `[API Response] 200 OK`
   - `[API Data]` com os dados

4. Verifique se "Maria" aparece como marcador no mapa

**Se aparecer:** ✅ Problema resolvido!

**Se não aparecer:** Vá para Solução 4

---

### **Solução 4: Verificar Estrutura de Dados**

A API pode estar retornando coordenadas com nomes diferentes:

```javascript
// Verifique qual é o campo de latitude/longitude
const resp = await fetch('http://localhost:8080/api/Apiario/BuscarApiariosUserLogado', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
});
const data = await resp.json();
const maria = data.dados?.[0]; // Primeiro apiário como exemplo

console.log('Todos os campos de Maria:');
Object.keys(maria).forEach(key => {
  console.log(`${key}:`, maria[key]);
});

// Procure por algo como:
// - coord_X, coord_Y (esperado)
// - latitude, longitude
// - localizacao.lat, localizacao.lng
// - x, y
```

**Resultado esperado:**
- Se encontrar `coord_X` e `coord_Y` → Código já está tratando (Solução 3)
- Se encontrar `latitude` e `longitude` → Avise para atualizar o código
- Se encontrar em `localizacao.x` e `localizacao.y` → Avise para atualizar o código

---

### **Solução 5: Adicionar Dados Manualmente (Último Recurso)**

Se absolutamente nada funcionar:

```javascript
// 1. Pegue o ID de Maria
const resp = await fetch('http://localhost:8080/api/Apiario/BuscarApiariosUserLogado', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
});
const data = await resp.json();
const mariasId = data.dados?.find(a => a.nomeApelido?.includes('Maria'))?.id;

// 2. Adicione manualmente no localStorage
const maps = JSON.parse(localStorage.getItem('hf_apiary_maps') || '[]');
maps.push({
  id: mariasId,
  nomeApelido: 'Maria',
  polygon: [
    { lat: -5.1753, lng: -40.6769 },  // Crateús, CE (exemplo)
    { lat: -5.1743, lng: -40.6769 },
    { lat: -5.1743, lng: -40.6759 },
    { lat: -5.1753, lng: -40.6759 }
  ]
});
localStorage.setItem('hf_apiary_maps', JSON.stringify(maps));

// 3. Recarregue
location.reload();
```

---

## 📊 Árvore de Decisão

```
Apiário não aparece no mapa?
│
├─ Sim, Maria está selecionada
│  │
│  ├─ Tem coord_X e coord_Y? (execute Solução 1)
│  │  │
│  │  ├─ SIM → Recarregue (F5) e teste novamente
│  │  │         Se aparecer = ✅ Resolvido
│  │  │         Se não = Solução 4
│  │  │
│  │  └─ NÃO → Adicione via interface (Solução 2)
│  │           Edite o apiário e salve
│  │           Volte para "SIM"
│  │
│  └─ Botão de seleção não funciona?
│     └─ Verifique console por erros 401
```

---

## 🐛 Possíveis Erros e Soluções

### ❌ "Failed to fetch"
```
TypeError: Failed to fetch at http://localhost:8080/...
```
**Causa:** Backend não está rodando  
**Solução:** Inicie backend com `cd BackendApi && dotnet run`

### ❌ "401 Unauthorized"
```
[API Response] 401 Unauthorized
```
**Causa:** Token JWT expirado  
**Solução:** 
1. Logout (limpar localStorage)
2. Fazer login novamente

### ❌ "404 Not Found"
```
[API Response] 404 Not Found
```
**Causa:** Endpoint errado ou usuário não tem permissão  
**Solução:** Verificar token e fazer login novamente

### ⚠️ "Apiário sem coordenadas válidas"
```
⚠️ Apiário "Maria" sem coordenadas válidas: {...}
```
**Causa:** `coord_X` e `coord_Y` não estão definidos ou são inválidos  
**Solução:** Adicione coordenadas via API (Solução 2)

---

## 📱 Testando em Diferentes Cenários

### Cenário 1: Apiário com Polígono Desenhado
**Esperado:** Aparece como área sombreada no mapa
**Se não aparecer:** Recarregue F5

### Cenário 2: Apiário com Apenas Coordenadas
**Esperado:** Aparece como marcador (pin) no mapa
**Se não aparecer:** 
1. Verifique se tem coord_X e coord_Y
2. Recarregue F5
3. Execute Solução 1

### Cenário 3: Apiário Sem Coordenadas nem Polígono
**Esperado:** Não aparece (dados incompletos)
**Solução:** Adicione coordenadas via interface

---

## 🔍 Verificação Final

Depois de aplicar a solução, verifique:

```javascript
// 1. Tem dados?
const resp = await fetch('http://localhost:8080/api/Apiario/BuscarApiariosUserLogado', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
});
const data = await resp.json();
console.log('Tem dados?', !!data.dados && data.dados.length > 0);

// 2. Maria tem coordenadas?
const maria = data.dados?.find(a => a.nomeApelido?.includes('Maria'));
console.log('Maria tem coord?', !!maria?.coord_X && !!maria?.coord_Y);

// 3. Valores válidos?
const lat = parseFloat(maria?.coord_Y);
const lng = parseFloat(maria?.coord_X);
console.log('Valores válidos?', !isNaN(lat) && !isNaN(lng));
console.log('Posição:', [lat, lng]);
```

Se tudo for true (✅), o problema está resolvido!

---

## 🎯 Checklist de Resolução

- [ ] Executei código de teste (Solução 1)
- [ ] Verifiquei se Maria tem coord_X e coord_Y
- [ ] Recarreguei a página (F5)
- [ ] Procurei por logs [API no console
- [ ] Verifiquei se algum erro aparece
- [ ] Testei novamente clicando no apiário
- [ ] Constatei se aparece no mapa

---

## 📞 Se Nada Funcionar

1. Copie o resultado do console (Solução 1)
2. Verifique qual é o erro exato
3. Consulte a seção "Possíveis Erros" acima
4. Se erro 401 → Fazer login
5. Se "sem coordenadas" → Adicione coordenadas
6. Se outro erro → Cheque se backend está rodando

---

## ✅ Status

✅ Código atualizado para mostrar marcadores  
✅ Tratamento de coordenadas melhorado  
✅ Logs adicionados para debug  

Recarregue a página e teste! 🚀

---

**Criado em:** 26 de janeiro de 2026  
**Última atualização:** 26 de janeiro de 2026
