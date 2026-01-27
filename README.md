# 🐝 HoneyFlow

Sistema de gestão para apiários, colmeias e produção de mel.

## 🚀 Como Rodar Rapidamente

Este projeto é totalmente containerizado com Docker. Siga os passos abaixo para iniciar.

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando.

### Passos
1.  Abra o terminal na pasta raiz do projeto.
2.  Execute o comando:
    ```bash
    docker-compose up -d --build
    ```
    *(Isso irá baixar as dependências, compilar o backend/frontend, configurar o banco de dados e iniciar tudo)*

3.  Aguarde alguns instantes até que todos os containers estejam `Healthy` ou `Running`.

### 🔗 Acessos

- **Frontend (Painel)**: [http://localhost:5173](http://localhost:5173)
- **API (Swagger)**: [http://localhost:8080/swagger](http://localhost:8080/swagger)
- **Banco de Dados**: `localhost:1433`

### 👤 Usuário Admin Padrão
Para realizar login inicial:
- **Email**: `admin@admin.com`
- **Senha**: `Admin@123`

> ⚠️ **Importante**: Altere a senha após o primeiro acesso.

---

## 🛠️ Solução de Problemas

**Erro "dotnet is not recognized"?**
- Não se preocupe, o projeto roda isolado dentro do Docker. Você não precisa do .NET instalado na sua máquina local.

**Containers não sobem?**
- Verifique se o Docker Desktop está aberto.
- Verifique se as portas `8080`, `5173` ou `1433` já não estão em uso por outros programas.

**Reiniciar do zero?**
Para limpar tudo e reconstruir:
```bash
docker-compose down -v
docker-compose up -d --build
```