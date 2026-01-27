@echo off
REM Script para testar conexão frontend-api no Windows

echo.
echo [HoneyFlow - Verificacao de Conexao]
echo =====================================
echo.

REM Cores não funcionam bem no CMD, usar texto simples
echo Verificando API em http://localhost:8080...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/swagger' -UseBasicParsing; Write-Host '[OK] API esta respondendo' -ForegroundColor Green } catch { Write-Host '[ERRO] API nao esta respondendo' -ForegroundColor Red; Write-Host '   Certifique-se de que o backend esta rodando' }"

echo.
echo Verificando Frontend em http://localhost:5173...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing; Write-Host '[OK] Frontend esta respondendo' -ForegroundColor Green } catch { Write-Host '[ERRO] Frontend nao esta respondendo' -ForegroundColor Red; Write-Host '   Execute: npm run dev' }"

echo.
echo Verificando arquivo .env...
if exist "Frontend\.env" (
    echo [OK] Arquivo .env encontrado
    findstr "VITE_API_URL" Frontend\.env >nul && (
        echo Variavel VITE_API_URL configurada
    ) || (
        echo [AVISO] Variavel VITE_API_URL nao encontrada
    )
) else (
    echo [ERRO] Arquivo .env nao encontrado
    echo Copie o .env.example para .env
)

echo.
echo =====================================
echo Abra o DevTools (F12) para verificar logs [API Request]
echo.
