# Sistema de Vendas - Frontend

Este é o frontend do Sistema de Vendas, desenvolvido em React com Tailwind CSS e Shadcn/ui, para interagir com a API de vendas.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Vite**: Ferramenta de build para desenvolvimento frontend rápido.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
- **Shadcn/ui**: Componentes de UI construídos com Tailwind CSS e Radix UI.
- **Lucide Icons**: Biblioteca de ícones.
- **React Router DOM**: Para gerenciamento de rotas na aplicação.
- **Axios**: Cliente HTTP para fazer requisições à API.

## Estrutura do Projeto

```
vendas-frontend/
├── public/
├── src/
│   ├── assets/             # Ativos estáticos como imagens
│   ├── components/         # Componentes React reutilizáveis (incluindo shadcn/ui)
│   │   └── ui/             # Componentes Shadcn/ui
│   ├── contexts/           # Contextos React para gerenciamento de estado global (ex: autenticação)
│   ├── hooks/              # Hooks React personalizados
│   ├── lib/                # Funções utilitárias e bibliotecas
│   ├── pages/              # Páginas principais da aplicação (ex: Login, Dashboard, Produtos)
│   ├── services/           # Serviços de integração com a API (ex: api.js)
│   ├── utils/              # Utilitários diversos
│   ├── App.css             # Estilos globais e Tailwind CSS
│   ├── App.jsx             # Componente principal da aplicação e roteamento
│   └── main.jsx            # Ponto de entrada da aplicação
├── components.json         # Configuração do shadcn/ui
├── eslint.config.js        # Configuração do ESLint
├── index.html              # Arquivo HTML principal
├── package.json            # Dependências e scripts do projeto
├── pnpm-lock.yaml          # Lock file das dependências
└── vite.config.js          # Configuração do Vite
```

## Instalação

Para configurar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório da API (backend) primeiro:**
    ```bash
    git clone https://github.com/jfermartins/API-VENDAS
    cd API-VENDAS
    # Siga as instruções de instalação e execução da API
    ```

2.  **Clone este repositório (frontend):**
    ```bash
    git clone <URL_DESTE_REPOSITORIO>
    cd vendas-frontend
    ```

3.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

## Configuração da API

O frontend está configurado para se comunicar com a API no endereço `http://localhost:3333`. Certifique-se de que sua API de backend esteja rodando neste endereço. Você pode ajustar a `baseURL` no arquivo `src/services/api.js` se necessário.

## Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
pnpm run dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou outra porta disponível).

## Rotas da Aplicação

-   `/login`: Página de autenticação.
-   `/dashboard`: Visão geral do sistema (requer autenticação).
-   `/products`: Gerenciamento de produtos (CRUD) (requer autenticação).
-   `/customers`: Gerenciamento de clientes (CRUD) (requer autenticação).
-   `/orders`: Gerenciamento de pedidos (criação e visualização) (requer autenticação).
-   `/users`: Gerenciamento de usuários (criação e listagem) (requer autenticação).
-   `/profile`: Gerenciamento do perfil do usuário logado (requer autenticação).

## Autenticação

A aplicação utiliza autenticação baseada em token (JWT). Após o login, o token é armazenado no `localStorage` e enviado automaticamente em todas as requisições subsequentes à API. Em caso de token inválido ou expirado, o usuário é redirecionado para a tela de login.

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades. Por favor, abra uma issue ou envie um pull request.
