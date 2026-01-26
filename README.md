# 🍯 Honey Flow - Guia de Execução com Docker

Este projeto utiliza **Docker** para facilitar o ambiente de desenvolvimento, subindo automaticamente o Banco de Dados (SQL Server), a API (.NET 9) e o Frontend (React/Vite).

## 🚀 Como subir o projeto pela primeira vez

Siga estes passos exatamente na ordem abaixo para garantir que o banco de dados seja criado corretamente.

### 1. Requisitos
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando.
*   [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) instalado.
*   Ferramenta de migrations instalada:  
    `dotnet tool install --global dotnet-ef`

### 2. Gerar a Migration Inicial
Abra o terminal na pasta raiz do projeto e execute:
```powershell
cd BackendApi
dotnet restore
dotnet ef migrations add InitialCreate
cd ..
```
*Este passo cria os arquivos necessários para que o Docker saiba como montar as tabelas do banco.*

### 3. Subir os Containers
Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute:
```powershell
docker-compose up -d --build
```
*   `-d`: Roda em segundo plano (libera o terminal).
*   `--build`: Garante que o Docker refaça o build se você alterou o código.

---

## 🔗 Endereços de Acesso

Assim que os containers estiverem verdes no Docker Desktop, você pode acessar:

*   **Frontend:** [http://localhost:5173](http://localhost:5173)
*   **API (Swagger):** [http://localhost:8080/swagger](http://localhost:8080/swagger)
*   **Banco de Dados (SQL Server):**
    *   **Host:** `localhost`
    *   **Porta:** `1433`
    *   **Usuário:** `sa`
    *   **Senha:** `HoneyFlor@123`

---

## 🛠️ Comandos Úteis de Manutenção

### Ver logs em tempo real (para debugar erros)
```powershell
docker logs -f HoneyFlorAPI
```

### Parar tudo
```powershell
docker-compose stop
```

### Limpar tudo (remove containers e redes)
```powershell
docker-compose down
```

### Reiniciar após alterar o código
Se você mudar algo no C# ou no React, rode:
```powershell
docker-compose up -d --build
```

---

## ⚠️ Solução de Problemas
*   **"Não foi possível conectar ao banco":** O SQL Server demora cerca de 1 minuto para iniciar totalmente. A API está configurada para tentar novamente, mas se falhar, basta reiniciar o container da API no Docker Desktop.
*   **"Acesso negado no banco":** Verifique se não há outra instância de SQL Server rodando localmente na porta 1433 da sua máquina.