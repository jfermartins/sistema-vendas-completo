# API-VENDAS

## Descrição

Esta é uma API RESTful robusta para um sistema de vendas, desenvolvida com as mais recentes tecnologias do ecossistema Node.js. A API foi construída utilizando TypeScript, o que garante um código mais seguro e manutenível. O framework Express.js serve como base para a criação dos endpoints, enquanto o TypeORM é utilizado como ORM para a interação com o banco de dados, facilitando a manipulação de dados de forma orientada a objetos.

A aplicação é modularizada, separando as responsabilidades em diferentes contextos, como gerenciamento de usuários, clientes, produtos e pedidos. Além disso, a API conta com funcionalidades essenciais como autenticação via JWT, validação de dados de entrada, cache com Redis para otimização de performance, e muito mais.

## Funcionalidades

*   **Gerenciamento de Usuários:** Cadastro, listagem, atualização de perfil e avatar.
*   **Autenticação:** Login com geração de token JWT e recuperação de senha por e-mail.
*   **Gerenciamento de Clientes:** CRUD completo de clientes.
*   **Gerenciamento de Produtos:** CRUD completo de produtos.
*   **Gerenciamento de Pedidos:** Criação e consulta de pedidos, com relacionamento entre produtos e clientes.
*   **Segurança:** Middleware de autenticação para rotas protegidas e rate limiting para prevenir ataques de força bruta.
*   **Upload de Arquivos:** Suporte para upload de avatares de usuário, com opção de armazenamento local ou em nuvem (AWS S3).
*   **Cache:** Utilização de Redis para cachear requisições e otimizar a performance.

## Tecnologias Utilizadas

| Tecnologia | Descrição |
| --- | --- |
| **Node.js** | Ambiente de execução JavaScript no servidor. |
| **TypeScript** | Superset do JavaScript que adiciona tipagem estática. |
| **Express.js** | Framework web para criação de APIs. |
| **TypeORM** | ORM para interação com o banco de dados. |
| **PostgreSQL** | Banco de dados relacional utilizado no projeto. |
| **JWT** | Padrão para criação de tokens de acesso. |
| **Redis** | Banco de dados em memória para cache. |
| **Multer** | Middleware para upload de arquivos. |
| **Nodemailer** | Biblioteca para envio de e-mails. |
| **Handlebars** | Template engine para criação de e-mails. |
| **Celebrate/Joi** | Validação de dados de entrada. |
| **ESLint/Prettier** | Ferramentas para linting e formatação de código. |

## Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
*   [Node.js](https://nodejs.org/en/)
*   [Yarn](https://yarnpkg.com/) ou [NPM](https://www.npmjs.com/)
*   [Docker](https://www.docker.com/) (para rodar o PostgreSQL e Redis em containers)

## Instalação

1.  **Clonar o Repositório**
    ```bash
    git clone https://github.com/jfermartins/API-VENDAS.git
    cd API-VENDAS
    ```
2.  **Instalar Dependências**
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  **Configurar Variáveis de Ambiente**
    
    Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example`. Preencha as variáveis de ambiente com as suas configurações, principalmente as de banco de dados, JWT e e-mail.
    
4.  **Configurar Banco de Dados**
    
    Você pode utilizar o Docker para subir uma instância do PostgreSQL e Redis:
    ```bash
    docker-compose up -d
    ```
    Após subir os containers, rode as migrações do TypeORM para criar as tabelas no banco de dados:
    ```bash
    npm run typeorm migration:run
    # ou
    yarn typeorm migration:run
    ```

## Uso

1.  **Iniciar o Servidor de Desenvolvimento**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
    O servidor será iniciado na porta `3333`.

## Rotas da API

| Rota | Método | Descrição |
| --- | --- | --- |
| `/users` | `POST` | Cria um novo usuário. |
| `/sessions` | `POST` | Autentica um usuário e retorna um token. |
| `/password/forgot` | `POST` | Envia um e-mail para recuperação de senha. |
| `/password/reset` | `POST` | Reseta a senha do usuário. |
| `/profile` | `GET` | Retorna os dados do usuário autenticado. |
| `/profile` | `PUT` | Atualiza os dados do usuário autenticado. |
| `/users/avatar` | `PATCH` | Atualiza o avatar do usuário autenticado. |
| `/products` | `GET` | Lista todos os produtos. |
| `/products` | `POST` | Cria um novo produto. |
| `/products/:id` | `GET` | Retorna um produto específico. |
| `/products/:id` | `PUT` | Atualiza um produto específico. |
| `/products/:id` | `DELETE` | Deleta um produto específico. |
| `/customers` | `GET` | Lista todos os clientes. |
| `/customers` | `POST` | Cria um novo cliente. |
| `/customers/:id` | `GET` | Retorna um cliente específico. |
| `/customers/:id` | `PUT` | Atualiza um cliente específico. |
| `/customers/:id` | `DELETE` | Deleta um cliente específico. |
| `/orders` | `POST` | Cria um novo pedido. |
| `/orders/:id` | `GET` | Retorna um pedido específico. |

## Estrutura do Projeto

O projeto é organizado da seguinte forma:

```
src/
├── @types/         # Tipos de definição do TypeScript
├── config/         # Arquivos de configuração (auth, mail, upload)
├── modules/        # Módulos da aplicação (users, products, etc.)
│   ├── ...
│   ├── controllers/  # Controladores (lógica de requisição/resposta)
│   ├── routes/       # Definição das rotas
│   ├── services/     # Regras de negócio
│   └── typeorm/      # Entidades e repositórios do TypeORM
└── shared/         # Código compartilhado entre os módulos
    ├── cache/        # Configuração do Redis
    ├── errors/       # Classe de erro customizada
    ├── http/         # Servidor Express e middlewares
    └── typeorm/      # Conexão com o banco de dados e migrações
```

## Contribuição

Contribuições são o que fazem a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1.  Faça um Fork do projeto
2.  Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3.  Adicione suas mudanças (`git add .`)
4.  Comite suas mudanças (`git commit -m \'Add some AmazingFeature\'`) 
5.  Faça o Push da Branch (`git push origin feature/AmazingFeature`)
6.  Abra um Pull Request

## Autor

*   **Jane Fernanda Martins** - [https://linkedin.com/in/jfermartins](https://linkedin.com/in/jfermartins)

