# Sistema de Vendas Completo

Este repositório contém uma solução completa para um Sistema de Vendas, incluindo uma API RESTful (backend) desenvolvida em Node.js com TypeScript e um frontend interativo construído com React.

## Visão Geral do Projeto

O objetivo deste projeto é fornecer uma plataforma robusta para gerenciamento de vendas, abrangendo funcionalidades essenciais como:

-   **Gerenciamento de Usuários**: Cadastro, autenticação (JWT), perfil e avatar.
-   **Gerenciamento de Clientes**: CRUD completo para a base de clientes.
-   **Gerenciamento de Produtos**: CRUD completo para o catálogo de produtos.
-   **Gerenciamento de Pedidos**: Criação e consulta de pedidos, com detalhes de produtos e clientes.
-   **Segurança**: Autenticação via token, validação de dados e rate limiting.
-   **Performance**: Cache com Redis para otimização de requisições.

O projeto é dividido em duas partes principais:

1.  **API-VENDAS (Backend)**: A lógica de negócio e persistência de dados.
2.  **vendas-frontend (Frontend)**: A interface de usuário para interagir com a API.

## Estrutura do Repositório

```
./
├── API-VENDAS/         # Repositório do Backend (Node.js, TypeScript, Express, TypeORM)
│   ├── src/
│   ├── ...
│   └── README.md       # Documentação específica do Backend
├── vendas-frontend/    # Repositório do Frontend (React, Vite, Tailwind CSS, Shadcn/ui)
│   ├── src/
│   ├── ...
│   └── README.md       # Documentação específica do Frontend
└── README.md           # Este arquivo: Documentação geral do projeto
```

## Tecnologias Utilizadas

### Backend (API-VENDAS)

-   **Node.js**: Ambiente de execução JavaScript.
-   **TypeScript**: Tipagem estática para maior segurança e manutenibilidade.
-   **Express.js**: Framework web para construção da API.
-   **TypeORM**: ORM para interação com o banco de dados (PostgreSQL).
-   **PostgreSQL**: Banco de dados relacional.
-   **Redis**: Banco de dados em memória para cache.
-   **JWT**: Autenticação baseada em tokens.
-   **Multer**: Middleware para upload de arquivos.
-   **Nodemailer**: Envio de e-mails.
-   **Celebrate/Joi**: Validação de dados.

### Frontend (vendas-frontend)

-   **React**: Biblioteca JavaScript para construção de interfaces de usuário.
-   **Vite**: Ferramenta de build rápida.
-   **Tailwind CSS**: Framework CSS utilitário.
-   **Shadcn/ui**: Componentes de UI acessíveis e personalizáveis.
-   **Lucide Icons**: Biblioteca de ícones.
-   **React Router DOM**: Gerenciamento de rotas.
-   **Axios**: Cliente HTTP para requisições à API.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

-   [Node.js](https://nodejs.org/en/)
-   [pnpm](https://pnpm.io/installation) (recomendado para o frontend) ou [npm](https://www.npmjs.com/)
-   [Docker](https://www.docker.com/) (para rodar PostgreSQL e Redis do backend)
-   [Git](https://git-scm.com/)

## Configuração e Execução

Siga os passos abaixo para configurar e executar o projeto completo:

### 1. Configuração do Backend (API-VENDAS)

1.  **Navegue até o diretório do backend:**
    ```bash
    cd API-VENDAS
    ```
2.  **Instale as dependências:**
    ```bash
    npm install # ou yarn install
    ```
3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do diretório `API-VENDAS` baseado no `.env.example` e preencha com suas configurações (banco de dados, JWT, e-mail).
4.  **Inicie os serviços do banco de dados e cache com Docker:**
    ```bash
    docker-compose up -d
    ```
5.  **Execute as migrações do banco de dados:**
    ```bash
    npm run typeorm migration:run # ou yarn typeorm migration:run
    ```
6.  **Inicie o servidor da API:**
    ```bash
    npm run dev # ou yarn dev
    ```
    A API estará disponível em `http://localhost:3333`.

### 2. Configuração do Frontend (vendas-frontend)

1.  **Abra um novo terminal e navegue até o diretório do frontend:**
    ```bash
    cd vendas-frontend
    ```
2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```
3.  **Verifique a configuração da API:**
    O frontend está configurado para se comunicar com a API em `http://localhost:3333`. Se a sua API estiver em outro endereço, edite o arquivo `vendas-frontend/src/services/api.js` para ajustar a `baseURL`.
4.  **Inicie o servidor de desenvolvimento do frontend:**
    ```bash
    pnpm run dev
    ```
    O frontend estará disponível em `http://localhost:5173` (ou outra porta disponível).

## Rotas da Aplicação

### Rotas da API (Backend)

Consulte o `API-VENDAS/README.md` para a lista completa de rotas da API.

### Rotas do Frontend

-   `/login`: Página de autenticação.
-   `/dashboard`: Visão geral do sistema.
-   `/products`: Gerenciamento de produtos.
-   `/customers`: Gerenciamento de clientes.
-   `/orders`: Gerenciamento de pedidos.
-   `/users`: Gerenciamento de usuários.
-   `/profile`: Gerenciamento do perfil do usuário logado.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests para melhorias, correções de bugs ou novas funcionalidades.

## Autor

-   **Jane Fernanda Martins** (Backend) - [https://linkedin.com/in/jfermartins](https://linkedin.com/in/jfermartins)
-   **Manus AI** (Frontend e Integração)

# sistema-vendas-completo
