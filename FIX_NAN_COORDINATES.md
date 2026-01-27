# 🔧 Fix: Invalid LatLng object: (NaN, NaN)

## 🐛 Problema
Erro no console: `Invalid LatLng object: (NaN, NaN)`

**Causa:** Algum apiário tem coordenadas (coord_X, coord_Y) que não são números válidos.

---

## ✅ O Que Foi Corrigido

### MapArea.jsx
- ✅ Validação rigorosa de coordenadas antes de renderizar
- ✅ Filtragem de polígonos com pontos inválidos
- ✅ Validação de range (latitude -90 a 90, longitude -180 a 180)
- ✅ Logs detalhados de quais apiários têm problemas

### ApiaryDetails.jsx
- ✅ Validação de polígonos antes de calcular centro
- ✅ Validação de coordenadas da API
- ✅ Range validation para latitude/longitude
- ✅ Logs indicando qual apiário tem problema

---

## 🚀 Como Resolver

### Opção 1: Apenas Recarregar (Rápido)

```
1. Recarregue a página (F5 ou Ctrl+R)
2. O erro deve desaparecer
3. Abra DevTools (F12) para ver logs de problemas
```

O código agora **ignora coordenadas inválidas** em vez de quebrar.

### Opção 2: Debug Detalhado (5 minutos)

1. Abra DevTools (F12)
2. Console
3. Execute:

```javascript
// Buscar todos os apiários
const resp = await fetch('http://localhost:8080/api/Apiario/BuscarApiariosUserLogado', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
});
const data = await resp.json();

// Procurar quem tem coordenadas inválidas
console.log('=== VALIDAÇÃO DE COORDENADAS ===');
data.dados?.forEach(apiary => {
  const lat = parseFloat(apiary.coord_Y);
  const lng = parseFloat(apiary.coord_X);
  
  const valid = !isNaN(lat) && !isNaN(lng) && 
                lat >= -90 && lat <= 90 && 
                lng >= -180 && lng <= 180;
  
  console.log(`${apiary.nomeApelido}:`, {
    coord_X: apiary.coord_X,
    coord_Y: apiary.coord_Y,
    lat_parsed: lat,
    lng_parsed: lng,
    valid: valid
  });
});
```

**Resultado esperado:**
- ✅ Todos com `valid: true` → Tudo OK
- ❌ Alguns com `valid: false` → Precisam corrigir coordenadas

### Opção 3: Corrigir Apiários Problemáticos

Se encontrou apiários com `valid: false`:

1. Vá para a página do apiário
2. Edite as informações
3. Adicione/corrija a localização
4. Salve
5. Recarregue

---

## 📋 Checklist

- [ ] Recarreguei a página (F5)
- [ ] Erro desapareceu
- [ ] Abri DevTools (F12) → Console
- [ ] Procurei por logs ⚠️ sobre apiários inválidos
- [ ] Se houve, identifiquei qual apriário tem problema
- [ ] Corrigi as coordenadas desse apiário
- [ ] Recarreguei novamente

---

## 📊 O Que Mudou no Código

### Antes
```jsx
// ❌ Direto para array - pode gerar NaN
positions={apiary.polygon.map(p => [p.lat, p.lng])}

// ❌ Sem validação de range
if (!isNaN(lat) && !isNaN(lng))
```

### Depois
```jsx
// ✅ Filtra coordenadas inválidas
const validPositions = apiary.polygon
  .map(p => {
    const lat = parseFloat(p.lat);
    const lng = parseFloat(p.lng);
    if (isNaN(lat) || isNaN(lng)) return null;
    return [lat, lng];
  })
  .filter(pos => pos !== null);

// ✅ Valida range completo
if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
  return null; // Não renderiza
}
```

---

## 🔍 Logs Úteis

Abra DevTools (F12) e procure por:

✅ **Sucesso:**
```
✅ Usando coordenadas válidas: [-5.1753, -40.6769]
```

⚠️ **Aviso - Sem dados:**
```
⚠️ Apiário "Maria" (ID: 1) tem coordenadas inválidas:
   { coord_X: undefined, coord_Y: null, lat: NaN, lng: NaN }
```

⚠️ **Aviso - Fora do range:**
```
⚠️ Apiário "Nome" tem coordenadas fora do range válido:
   { lat: 200, lng: -450 }
```

---

## ✨ Próximos Passos

1. **Recarregue** a página (F5)
2. **Verifique** se erro sumiu
3. **Se ainda houver problema**, execute o debug (Opção 2)
4. **Corrija** os apiários problemáticos

---

## 📞 Se Nada Funcionar

1. Copie o log completo do erro
2. Verifique se Backend está rodando
3. Tente fazer logout e login novamente
4. Se erro persistir, consulte logs do console

---

**Status:** ✅ Código atualizado e pronto!

Recarregue agora e teste! 🚀
