# Configuração local — Sistema de Vendas

## Requisitos

- Node.js 20 LTS (o projeto contém dependências antigas; prefira Node 20 em vez da versão 22).
- npm 10 ou compatível.
- Docker Desktop com Docker Compose.
- Git.

## 1. Backend e serviços

No terminal, na raiz do repositório:

```bash
cd backend
cp .env.example .env
```

Gere um segredo JWT e substitua `APP_SECRET` no arquivo `.env`. Exemplo para Linux/macOS:

```bash
openssl rand -hex 32
```

No Windows PowerShell, pode-se usar:

```powershell
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLower()
```

O exemplo define os mesmos valores de usuário, senha e banco usados pelo `ormconfig.json` e pelo Compose. Para uso local, mantenha esses valores alinhados; o Compose lê o `.env` no diretório `backend`.

Suba os serviços e instale o backend:

```bash
docker compose up -d
npm ci
```

Rode as migrações e inicie a API:

```bash
npm run typeorm migration:run
npm run dev
```

A API escuta em `http://localhost:3333`. Confirme que PostgreSQL está na porta 5432 e Redis na 6379. O projeto depende do Redis para cache/limitação; mantenha-o ativo.

## 2. Frontend

Em outro terminal, na raiz do repositório:

```bash
cd frontend
npm ci --legacy-peer-deps
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`. O cliente Axios aponta para `http://localhost:3333`.

O uso de `--legacy-peer-deps` contorna o conflito de peer dependencies declarado pelo projeto entre React 19 e `react-day-picker` 8. Não use `--force` como primeira tentativa. Se sua instalação falhar por pacote opcional do Rollup/arquitetura, use Node 20 x64 e remova `node_modules` antes de instalar novamente:

```bash
rm -rf node_modules
npm ci --legacy-peer-deps
```

No PowerShell, use `Remove-Item -Recurse -Force node_modules`.

## Observações

- O arquivo `ormconfig.json` usa PostgreSQL e credenciais literais (`postgres` / `docker` / `apivendas`); alterá-las exige alinhar também `backend/.env` para o Compose.
- O backend usa `APP_SECRET`, `APP_API_URL`, `APP_WEB_URL`, `REDIS_HOST` e `REDIS_PORT`. O exemplo de ambiente inclui os valores locais.
- O remetente de recuperação de senha usa Ethereal (caixa de teste); a mensagem de preview é impressa no terminal. A URL web de recuperação deve ser `http://localhost:5173`.
- O pacote `oracledb` está listado nas dependências, mas não há referência a ele no código fonte; o projeto está configurado para PostgreSQL. No Linux ARM64, esse pacote nativo pode impedir o `npm ci`. Para evitar alterar dependências sem necessidade, rode no Node 20 x64, ou remova a dependência Oracle e regenere o lockfile somente se tiver confirmado que seu projeto não precisa de Oracle.
- Não há rota raiz `/` descrita para a API; valide por meio das rotas documentadas em `backend/README.md` ou faça login/cadastro pelo frontend.
