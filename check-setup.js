#!/usr/bin/env node

/**
 * 🐝 HoneyFlow - Checklist de Conexão Frontend-API
 * 
 * Este script verifica se tudo está configurado corretamente
 */

const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function check(condition, successMsg, failMsg) {
    if (condition) {
        log(`✅ ${successMsg}`, 'green');
        return true;
    } else {
        log(`❌ ${failMsg}`, 'red');
        return false;
    }
}

log('\n🐝 HoneyFlow - Checklist de Conexão', 'cyan');
log('=====================================\n', 'cyan');

let passCount = 0;
let totalCount = 0;

// ============================================================================
// VERIFICAÇÕES DO FRONTEND
// ============================================================================
log('📁 Verificações do Frontend', 'blue');
log('─────────────────────────────', 'blue');

// 1. Arquivo .env existe
totalCount++;
const envPath = path.join(__dirname, 'Frontend', '.env');
if (check(fs.existsSync(envPath), 
    'Arquivo .env encontrado',
    'Arquivo .env não encontrado - Execute: cp Frontend/.env.example Frontend/.env')) {
    passCount++;
}

// 2. Conteúdo do .env
totalCount++;
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (check(envContent.includes('VITE_API_URL'),
        'Variável VITE_API_URL configurada',
        'VITE_API_URL não encontrada no .env')) {
        passCount++;
    }
} else {
    log('⏭️  Pulando (arquivo .env não existe)', 'yellow');
}

// 3. vite.config.js existe
totalCount++;
const viteConfigPath = path.join(__dirname, 'Frontend', 'vite.config.js');
if (check(fs.existsSync(viteConfigPath),
    'Arquivo vite.config.js encontrado',
    'Arquivo vite.config.js não encontrado')) {
    passCount++;
}

// 4. api.js existe e tem atualizações
totalCount++;
const apiPath = path.join(__dirname, 'Frontend', 'src', 'services', 'api.js');
if (fs.existsSync(apiPath)) {
    const apiContent = fs.readFileSync(apiPath, 'utf8');
    if (check(apiContent.includes('getApiBaseUrl'),
        'api.js atualizado com detecção de URL',
        'api.js não tem detecção de URL automática')) {
        passCount++;
    }
} else {
    totalCount--;
    log('⏭️  api.js não encontrado (arquivo crítico)', 'yellow');
}

// 5. package.json existe
totalCount++;
const packagePath = path.join(__dirname, 'Frontend', 'package.json');
if (check(fs.existsSync(packagePath),
    'Arquivo package.json encontrado',
    'Arquivo package.json não encontrado')) {
    passCount++;
}

// 6. node_modules existe
totalCount++;
const nodeModulesPath = path.join(__dirname, 'Frontend', 'node_modules');
if (check(fs.existsSync(nodeModulesPath),
    'Dependências instaladas (node_modules)',
    'Dependências não instaladas - Execute: cd Frontend && npm install')) {
    passCount++;
}

log('');

// ============================================================================
// VERIFICAÇÕES DO BACKEND
// ============================================================================
log('🔧 Verificações do Backend (Referência)', 'blue');
log('────────────────────────────────────────', 'blue');

// 7. Program.cs existe
totalCount++;
const programPath = path.join(__dirname, 'BackendApi', 'Program.cs');
if (check(fs.existsSync(programPath),
    'Arquivo Program.cs encontrado',
    'Arquivo Program.cs não encontrado')) {
    passCount++;
}

// 8. appsettings.json existe
totalCount++;
const appSettingsPath = path.join(__dirname, 'BackendApi', 'appsettings.json');
if (check(fs.existsSync(appSettingsPath),
    'Arquivo appsettings.json encontrado',
    'Arquivo appsettings.json não encontrado')) {
    passCount++;
}

log('');

// ============================================================================
// VERIFICAÇÕES DE DOCUMENTAÇÃO
// ============================================================================
log('📚 Verificações de Documentação', 'blue');
log('────────────────────────────────', 'blue');

const docs = [
    { name: 'CONEXAO_FRONTEND_API.md', desc: 'Guia de Debug e Troubleshooting' },
    { name: 'SETUP_COMPLETO.md', desc: 'Guia de Setup Passo a Passo' },
    { name: 'EXEMPLOS_USO_API.js', desc: 'Exemplos de Código' },
    { name: 'RESUMO_MUDANCAS.md', desc: 'Resumo das Mudanças' },
];

docs.forEach(doc => {
    totalCount++;
    const docPath = path.join(__dirname, doc.name);
    if (check(fs.existsSync(docPath),
        `${doc.name} - ${doc.desc}`,
        `${doc.name} não encontrado`)) {
        passCount++;
    }
});

log('');

// ============================================================================
// RESUMO
// ============================================================================
log('📊 Resumo', 'cyan');
log('─────────', 'cyan');

const percentage = Math.round((passCount / totalCount) * 100);
const status = percentage === 100 ? '✅ PRONTO' : '⚠️  INCOMPLETO';

log(`${status} - ${passCount}/${totalCount} verificações passaram (${percentage}%)`, 
    percentage === 100 ? 'green' : 'yellow');

log('');

// ============================================================================
// PRÓXIMOS PASSOS
// ============================================================================
log('🚀 Próximos Passos', 'cyan');
log('──────────────────', 'cyan');

if (percentage === 100) {
    log('1. Abra dois terminais', 'green');
    log('   Terminal 1 (Backend):', 'green');
    log('   $ cd BackendApi && dotnet run', 'yellow');
    log('');
    log('   Terminal 2 (Frontend):', 'green');
    log('   $ cd Frontend && npm run dev', 'yellow');
    log('');
    log('2. Abra http://localhost:5173 no navegador', 'green');
    log('');
    log('3. Abra DevTools (F12) e procure por logs [API Request]', 'green');
    log('');
    log('4. Leia os guias criados:', 'green');
    log('   - CONEXAO_FRONTEND_API.md para debug', 'yellow');
    log('   - EXEMPLOS_USO_API.js para ver como usar', 'yellow');
} else {
    log('Corrija os itens marcados com ❌ acima', 'red');
    log('');
    log('Passos comuns:', 'yellow');
    log('1. $ cp Frontend/.env.example Frontend/.env', 'yellow');
    log('2. $ cd Frontend && npm install', 'yellow');
    log('3. Rerun este script', 'yellow');
}

log('');
log('📖 Para mais informações, leia:', 'cyan');
log('   - CONEXAO_FRONTEND_API.md', 'yellow');
log('   - SETUP_COMPLETO.md', 'yellow');
log('   - EXEMPLOS_USO_API.js', 'yellow');
log('');
