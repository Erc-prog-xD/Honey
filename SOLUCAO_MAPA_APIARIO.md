# 🗺️ Solução: Apiário Não Aparece no Mapa

## 🐛 Problema

Você selecionou o apiário "Maria" mas ele **não aparece no mapa**.

---

## 🔍 Causas Possíveis

1. **Sem Coordenadas (coord_X, coord_Y)**: O apiário não tem localização definida
2. **Sem Polígono**: O apiário não foi desenhado no mapa
3. **Dados Incompletos**: Informações ausentes na API ou localStorage

---

## ✅ Soluções

### **Solução 1: Verificar Dados no Console** (Debugging)

1. Abra DevTools (F12)
2. Vá para tab **Console**
3. Cole este código:

```javascript
// Verificar se o apiário tem coordenadas
const response = await fetch('http://localhost:8080/api/Apiario/BuscarApiariosUserLogado', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('Token')}`
  }
});
const data = await response.json();
const maria = data.dados?.find(a => a.nomeApelido?.includes('Maria'));
console.log('Apiário Maria:', maria);
console.log('coord_X:', maria?.coord_X);
console.log('coord_Y:', maria?.coord_Y);
console.log('Tem coordenadas válidas?', maria?.coord_X && maria?.coord_Y);
```

**Se mostrar:**
- ✅ `coord_X` e `coord_Y` preenchidos → Solução 2
- ❌ `undefined` ou `null` → Solução 3 ou 4

---

### **Solução 2: Backend Melhorado** (Recomendado)

Se o apiário tem `coord_X` e `coord_Y` mas ainda não aparece, o código foi atualizado para:

✅ Mostrar marcadores mesmo sem polígono  
✅ Usar coordenadas quando não houver polígono  
✅ Centralizar no apiário corretamente  

**Ação necessária:**
1. Recarregue a página (F5)
2. Verifique se agora "Maria" aparece como um marcador no mapa

---

### **Solução 3: Adicionar Coordenadas via API**

Se o apiário NÃO tem `coord_X` e `coord_Y`:

**Passo 1:** Vá para a página do apiário "Maria"
```
http://localhost:5173/apiario/{id-da-maria}
```

**Passo 2:** Clique para editar as informações

**Passo 3:** As coordenadas devem ser incluídas (sistema deve gerar automaticamente)

**Passo 4:** Salve

---

### **Solução 4: Adicionar via localStorage** (Temporário)

Se o apiário foi criado apenas no frontend:

1. Abra DevTools (F12)
2. Tab **Console**
3. Execute este código:

```javascript
// Primeiro, descubra o ID do apiário Maria
const response = await fetch('http://localhost:8080/api/Apiario/BuscarApiariosUserLogado', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('Token')}`
  }
});
const data = await response.json();
const maria = data.dados?.find(a => a.nomeApelido?.includes('Maria'));
const mariasId = maria?.id;

// Agora adicione as coordenadas
const apiariosLocal = JSON.parse(localStorage.getItem('hf_apiary_maps') || '[]');
apiariosLocal.push({
  id: mariasId,
  nomeApelido: "Maria",
  polygon: [
    { lat: -5.1753, lng: -40.6769 },
    { lat: -5.1743, lng: -40.6769 },
    { lat: -5.1743, lng: -40.6759 },
    { lat: -5.1753, lng: -40.6759 }
  ]
});
localStorage.setItem('hf_apiary_maps', JSON.stringify(apiariosLocal));

// Recarregue a página
location.reload();
```

✅ Agora "Maria" deve aparecer no mapa!

---

### **Solução 5: Verificar Estrutura da Resposta**

O código foi melhorado para:

1. **MapArea.jsx**: Agora renderiza marcadores para apiários sem polígono
2. **ApiaryDetails.jsx**: Usa `coord_Y` e `coord_X` como fallback

Se ainda não funcionar, verifique:

```javascript
// Qual é a estrutura de resposta da API para apiários?
const response = await fetch('http://localhost:8080/api/Apiario/BuscarApiariosUserLogado', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
});
const data = await response.json();
console.log('Estrutura:', JSON.stringify(data, null, 2));
// Procure por: coord_X, coord_Y, latitude, longitude, localizacao
```

---

## 🔧 Código Adicionado

### MapArea.jsx - Novo componente `ApiaryMarker`

```jsx
// Renderiza marcador quando há coordenadas mas não há polígono
const ApiaryMarker = ({ apiary, navigate }) => {
    const handleClick = () => {
        navigate(`/apiario/${apiary.id}`);
    };

    // Skip se tem polygon (ClickablePolygon já renderiza)
    if (apiary.polygon && apiary.polygon.length > 0) return null;

    // Extrai coordenadas
    const lat = parseFloat(apiary.coord_Y || apiary.latitude);
    const lng = parseFloat(apiary.coord_X || apiary.longitude);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        console.warn(`Apiário sem coordenadas: ${apiary.nomeApelido}`);
        return null;
    }

    return (
        <Marker position={[lat, lng]} icon={createHiveIcon()}>
            <Popup>
                <strong>{apiary.nomeApelido}</strong><br />
                Tipo: {apiary.tipoAbelha}
            </Popup>
        </Marker>
    );
};
```

### ApiaryDetails.jsx - Função melhorada

```jsx
const getPolygonCenter = () => {
    // Tenta polígono primeiro
    if (apiary?.polygon?.length > 0) {
        const lats = apiary.polygon.map(p => p.lat);
        const lngs = apiary.polygon.map(p => p.lng);
        return [(Math.min(...lats) + Math.max(...lats)) / 2, 
                (Math.min(...lngs) + Math.max(...lngs)) / 2];
    }
    
    // Tenta coordenadas da API
    if (apiary?.coord_Y && apiary?.coord_X) {
        try {
            const lat = parseFloat(apiary.coord_Y);
            const lng = parseFloat(apiary.coord_X);
            if (!isNaN(lat) && !isNaN(lng)) {
                return [lat, lng];
            }
        } catch (e) {
            console.warn("Erro ao parsear coordenadas:", e);
        }
    }
    
    // Fallback
    return [-5.1753, -40.6769];
};
```

---

## 🧪 Teste a Solução

### Passo 1: Recarregue a Página
```
F5 (ou Ctrl+R)
```

### Passo 2: Verifique o Console (F12)
Procure por:
- ✅ `[API Request]` e `[API Response]` - confirma que dados foram carregados
- ⚠️ Avisos sobre coordenadas inválidas

### Passo 3: Clique no Apiário
Se aparecer como marcador no mapa, está funcionando!

---

## 📊 Checklist de Diagnóstico

- [ ] Executei console para ver se Maria tem `coord_X` e `coord_Y`
- [ ] Recarreguei a página (F5)
- [ ] Abri DevTools e procurei por logs `[API`
- [ ] Verifiquei se há aviso sobre "sem coordenadas válidas"
- [ ] Tentei as soluções acima em ordem

---

## 🎯 Resumo das Mudanças

| Arquivo | Mudança |
|---------|---------|
| `MapArea.jsx` | ✅ Adicionado componente `ApiaryMarker` para mostrar coordenadas sem polígono |
| `ApiaryDetails.jsx` | ✅ Melhorado `getPolygonCenter()` para usar coordenadas da API |

---

## 💡 Por Que Isso Acontecia

**Antes:**
- MapArea só renderizava apiários com polígono
- Se não houvesse polígono, nada era mostrado
- Coordenadas da API eram ignoradas

**Depois:**
- MapArea renderiza DOIS tipos:
  1. Polígonos (se houver)
  2. Marcadores de coordenadas (se não houver polígono)
- Coordenadas da API são usadas como fallback

---

## 🚀 Próximas Ações

1. **Teste agora**: Recarregue a página e veja se "Maria" aparece
2. **Se funcionar**: Parabéns! 🎉
3. **Se não funcionar**: Execute o código de debug (Solução 1) e me mostre o resultado
4. **Para adicionar coordenadas**: Edite o apiário para incluir localização

---

## 📞 Se Ainda Não Funcionar

1. Abra DevTools (F12)
2. Console
3. Execute:
```javascript
const r = await fetch('http://localhost:8080/api/Apiario/BuscarApiariosUserLogado', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
});
const d = await r.json();
console.log(d);
// Me mostre a resposta completa
```

---

**Status:** ✅ Código atualizado e pronto para funcionar!

Recarregue a página e teste agora! 🚀
