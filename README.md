# CSP Kanban

Aplicação full stack desenvolvida para um processo seletivo. O projeto implementa um quadro Kanban para cadastro, acompanhamento e gerenciamento de demandas, com autenticação por seleção de usuário e controle de acesso por perfil.

O repositório é dividido em duas aplicações:

- `csp-app`: front-end em React e React Router.
- `csp-api`: API REST em Node.js, Fastify e Drizzle ORM.

## Funcionalidades

### Login e sessão

- A tela inicial permite selecionar um usuário existente na base.
- Após o login, o usuário é direcionado para uma página inicial com os acessos permitidos para seu perfil.
- A autenticação persiste por meio de cookie de sessão `httpOnly`.
- O token JWT não é exposto ao código executado no navegador.
- Rotas protegidas redirecionam usuários sem sessão válida para `/login`.
- A opção **Sair** encerra a sessão e remove o cookie.

### Página inicial

A página inicial autenticada utiliza a mesma identidade visual do quadro Kanban e apresenta atalhos para:

- Quadro Kanban.
- Cadastro de demanda, quando permitido.
- Cadastro de usuário, quando permitido.

Atalhos não autorizados não são exibidos.

### Menu lateral

- Exibe os acessos disponíveis de acordo com o perfil autenticado.
- A opção correspondente à rota atual fica realçada.
- Apresenta nome, perfil e avatar do usuário.
- Disponibiliza a ação de logout.

### Cadastro de demanda

Campos:

- Título.
- Responsável.
- Prazo.
- Descrição.

Regras:

- Todos os campos são obrigatórios.
- Ao tentar salvar um formulário incompleto, uma mensagem é exibida abaixo de cada campo não preenchido.
- O prazo aceita somente números e aplica a máscara `dd/mm/aaaa`.
- O responsável é selecionado por um campo pesquisável.
- Somente usuários dos perfis **Desenvolvedor** e **Agilista** são apresentados como responsáveis.
- A lista é filtrada enquanto o usuário digita.
- Quando não há resultado, o campo exibe **“Usuário não encontrado”**.
- Na edição, o formulário é aberto com os dados atuais da demanda.

### Cadastro de usuário

Campos:

- Nome.
- Perfil.

Regras:

- Todos os campos são obrigatórios.
- O formulário apresenta mensagens específicas para campos não preenchidos.
- O nome aceita somente letras, espaços e caracteres acentuados.
- O perfil é selecionado entre:
  - Desenvolvedor.
  - Administrador.
  - Agilista.
- O e-mail é gerado automaticamente a partir do nome no padrão `nome.sobrenome@csp.tech`.
- Não é permitido cadastrar outro usuário que resulte no mesmo e-mail.

### Quadro Kanban

O quadro contém cinco colunas:

1. Não Iniciada.
2. Em andamento.
3. Pausada.
4. Em Homologação.
5. Em Produção.

Comportamentos:

- Usuários autorizados podem arrastar demandas entre as colunas.
- A mudança atualiza o status visualmente e persiste a alteração no banco.
- A atualização no front-end é otimista e posteriormente reconciliada com a resposta do servidor.
- Demandas em **Em Produção** não podem mudar de status.
- Essa restrição é aplicada no front-end e novamente na API.
- A busca filtra os cards por título ou responsável enquanto o texto é digitado.
- Os cards são ordenados pelo prazo, do mais próximo para o mais distante, dentro de cada coluna.
- Cada card exibe título, responsável e prazo.
- O botão **Nova Demanda** é exibido somente para perfis autorizados.
- Clicar em um card abre seus detalhes.

### Detalhes da demanda

- Os detalhes são apresentados em uma janela sobreposta ao Kanban.
- Fechar a janela mantém o usuário no quadro.
- São exibidos:
  - Título.
  - Responsável.
  - Status.
  - Prazo.
  - Descrição.
- O botão **Editar** abre o formulário preenchido e aparece apenas para perfis autorizados.
- O botão **Excluir** remove a demanda do banco e aparece apenas para o perfil autorizado.

## Perfis e permissões

### Administrador

- Pode cadastrar usuários.
- Pode cadastrar demandas.
- Pode acessar o Kanban.
- Pode visualizar os cards e seus detalhes.
- Não pode mover demandas.
- Não pode editar demandas.
- Não pode excluir demandas.

### Agilista

- Pode cadastrar demandas.
- Pode editar demandas.
- Pode excluir demandas.
- Pode acessar o Kanban.
- Pode visualizar os cards e seus detalhes.
- Pode mover cards.
- Não pode cadastrar usuários.

### Desenvolvedor

- Pode acessar o Kanban.
- Pode visualizar os cards e seus detalhes.
- Pode mover cards.
- Pode editar demandas.
- Não pode cadastrar demandas.
- Não pode excluir demandas.
- Não pode cadastrar usuários.

As permissões são aplicadas em duas camadas:

1. O front-end oculta menus e botões não permitidos.
2. A API valida todas as ações protegidas, impedindo acesso direto não autorizado.

## Arquitetura

### Fluxo geral

```text
Navegador
   |
   | HTTP
   v
csp-app (React Router SSR)
   |
   | REST + Bearer JWT
   v
csp-api (Fastify / Vercel Function)
   |
   | Drizzle ORM
   v
PostgreSQL (Neon)
```

O navegador se comunica com as `loaders` e `actions` do React Router. O servidor do front-end lê o token armazenado no cookie `httpOnly` e chama a API utilizando o cabeçalho `Authorization: Bearer <token>`.

Essa arquitetura mantém `BACKEND_URL` e o JWT fora do bundle do navegador.

### Estrutura principal

```text
.
├── csp-api
│   ├── api/                 # Entrada serverless da Vercel
│   ├── db/                  # Cliente, schema e seed
│   ├── drizzle/             # Migrações SQL
│   ├── lib/                 # Autenticação, permissões e utilitários
│   ├── routes/              # Endpoints Fastify
│   └── server.ts            # Servidor para desenvolvimento local
└── csp-app
    ├── app/routes/          # Rotas, loaders e actions
    ├── components/          # UI, Kanban, formulários e layout
    └── lib/                 # Cliente da API, sessão, tipos e permissões
```

## Fluxos técnicos

### Autenticação

#### Front-end

1. A `loader` de `/login` consulta `GET /users`.
2. O usuário seleciona um perfil e envia o formulário.
3. A `action` chama `POST /signin` com o `userId`.
4. O JWT retornado é armazenado no cookie assinado `csp_session`.
5. O layout autenticado chama `GET /me` para validar a sessão e obter o usuário.
6. Uma sessão ausente ou inválida provoca redirecionamento para `/login`.

#### Back-end

1. `POST /signin` valida o UUID recebido com Zod.
2. A API confirma que o usuário existe.
3. Um JWT com o ID no campo `sub` é assinado com `JWT_SECRET`.
4. Endpoints protegidos validam o cabeçalho Bearer no `preHandler`.
5. O usuário autenticado é carregado antes da verificação de permissões.

### Listagem e cadastro de usuários

#### Front-end

- A tela de login usa a listagem pública de usuários.
- O formulário de demanda chama `GET /users?assignable=true`.
- A tela de usuários e o formulário de cadastro são protegidos para administradores.
- O cadastro é enviado por uma `action` do React Router.

#### Back-end

- `GET /users` retorna os usuários em ordem alfabética.
- `assignable=true` limita o resultado a desenvolvedores e agilistas.
- `POST /users` exige perfil administrador.
- O payload é validado com Zod.
- O e-mail é normalizado e gerado pela API.

### Demandas

#### Front-end

- As `loaders` consultam demandas e usuários em paralelo.
- A criação e a edição passam pelas `actions` do React Router.
- O Kanban mantém uma cópia local dos dados para atualização otimista.
- Ao mover um card, a rota envia `intent=move`, ID e novo status.
- Ao excluir, a rota envia `intent=delete` e o ID.
- Após a ação, o React Router revalida a rota e reconcilia a interface com o banco.

#### Back-end

- `GET /tasks` retorna demandas ordenadas por prazo.
- `POST /tasks` valida os campos, confirma a existência do responsável e cria a demanda com status inicial `not_started`.
- `PATCH /tasks/:id` altera os campos informados ou o status.
- `DELETE /tasks/:id` remove a demanda.
- A API retorna `403` quando o perfil não possui permissão.
- A API retorna `404` quando a demanda não existe.
- Uma demanda em `prod` não pode receber outro status.

## API REST

URL local padrão: `http://localhost:3333`.

### Endpoints públicos

- `GET /`: verificação de saúde da API.
- `GET /users`: lista usuários para a tela de login.
- `GET /users?assignable=true`: lista desenvolvedores e agilistas.
- `POST /signin`: autentica um usuário selecionado.

Exemplo de login:

```json
{
  "userId": "UUID_DO_USUARIO"
}
```

### Endpoints protegidos

Devem receber:

```text
Authorization: Bearer JWT
```

- `GET /me`: retorna o usuário autenticado.
- `GET /tasks`: lista demandas.
- `POST /tasks`: cria uma demanda — Administrador e Agilista.
- `PATCH /tasks/:id`: edita ou move uma demanda — Agilista e Desenvolvedor.
- `DELETE /tasks/:id`: exclui uma demanda — Agilista.
- `POST /users`: cria um usuário — Administrador.

Exemplo de demanda:

```json
{
  "title": "Implementar nova funcionalidade",
  "description": "Descrição da demanda",
  "dueDate": "2026-12-31",
  "assignedTo": "UUID_DO_RESPONSAVEL"
}
```

Status usados pela API:

- `not_started`: Não Iniciada.
- `in_progress`: Em andamento.
- `paused`: Pausada.
- `homolog`: Em Homologação.
- `prod`: Em Produção.

## Banco de dados

O projeto utiliza PostgreSQL hospedado no Neon.

### Tabela `users`

- `id`: UUID, chave primária.
- `name`: nome obrigatório.
- `email`: e-mail obrigatório e único.
- `profile`: enum `admin`, `developer` ou `agile`.
- `created_at` e `updated_at`: datas de auditoria.

### Tabela `tasks`

- `id`: UUID, chave primária.
- `title`: título obrigatório.
- `status`: enum de status, com padrão `not_started`.
- `description`: descrição obrigatória.
- `due_date`: prazo obrigatório.
- `assigned_to`: chave estrangeira obrigatória para `users.id`.
- `created_at` e `updated_at`: datas de auditoria.

O Drizzle Kit gerencia as migrações em `csp-api/drizzle`.

## Tecnologias e bibliotecas

### Front-end

- React 19: construção da interface.
- React Router 8: SSR, rotas, loaders, actions, formulários e sessões.
- TypeScript: tipagem estática.
- Vite: desenvolvimento e build.
- Tailwind CSS 4: estilização.
- shadcn e Radix UI: componentes acessíveis.
- dnd-kit: drag and drop do Kanban.
- Lucide React: ícones.
- Geist: fonte da interface.

### Back-end

- Node.js: ambiente de execução.
- Fastify 5: API HTTP.
- TypeScript: tipagem estática.
- Zod: validação dos payloads e variáveis de ambiente.
- Drizzle ORM e Drizzle Kit: acesso ao banco e migrações.
- PostgreSQL/Neon: persistência SQL serverless.
- JSON Web Token: autenticação entre front-end e API.
- `@fastify/cors`: configuração de CORS.
- `dotenv`: carregamento de variáveis locais.

### Infraestrutura

- Vercel: execução da API como função serverless e hospedagem da aplicação.
- Neon: banco PostgreSQL compatível com ambiente serverless.

## Execução local

### Pré-requisitos

- Node.js 20 ou superior.
- npm.
- Banco PostgreSQL acessível por uma `DATABASE_URL`.

### 1. Configurar a API

```bash
cd csp-api
npm install
cp .env.example .env
```

Preencha `csp-api/.env`:

```env
PORT=3333
HOST=0.0.0.0
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
JWT_SECRET=uma-chave-longa-e-segura
CORS_ORIGIN=http://localhost:5173
```

Crie as tabelas e os dados iniciais:

```bash
npm run db:migrate
npm run db:seed
```

Inicie a API:

```bash
npm run dev
```

### 2. Configurar o front-end

Em outro terminal:

```bash
cd csp-app
npm install
cp .env.example .env
```

Preencha `csp-app/.env`:

```env
BACKEND_URL=http://localhost:3333
SESSION_SECRET=outra-chave-longa-e-segura
```

Inicie a aplicação:

```bash
npm run dev
```

Acesse `http://localhost:5173`.

## Scripts

### API

Executados dentro de `csp-api`:

- `npm run dev`: servidor local com recarregamento.
- `npm run start`: servidor local sem watch.
- `npm run typecheck`: validação TypeScript.
- `npm run db:generate`: gera uma migração a partir do schema.
- `npm run db:migrate`: aplica as migrações.
- `npm run db:seed`: recria os dados de demonstração.
- `npm run db:studio`: abre o Drizzle Studio.

> Atenção: o seed remove as demandas e os usuários atuais antes de inserir os dados de demonstração.

### Front-end

Executados dentro de `csp-app`:

- `npm run dev`: servidor de desenvolvimento.
- `npm run build`: build de produção.
- `npm run start`: executa o build de produção.
- `npm run typecheck`: geração dos tipos de rota e validação TypeScript.

## Deploy na Vercel

As duas pastas devem ser configuradas como projetos separados.

### API

- Root Directory: `csp-api`.
- Variáveis obrigatórias:
  - `DATABASE_URL`.
  - `JWT_SECRET`.
  - `CORS_ORIGIN`, com a URL do front-end.
- `api/index.ts` é a entrada serverless.
- `vercel.json` encaminha as rotas para a função.
- Execute as migrações contra o banco de produção antes da primeira utilização.

### Front-end

- Root Directory: `csp-app`.
- Variáveis obrigatórias:
  - `BACKEND_URL`, com a URL pública da API.
  - `SESSION_SECRET`.
- `BACKEND_URL` não utiliza o prefixo `VITE_`, pois deve permanecer disponível apenas no servidor.

## Requisitos adicionados

Além dos requisitos originais, foram adicionadas melhorias que aumentam a segurança, consistência e experiência de uso.

### RA-01 — Autorização em profundidade

As permissões não são aplicadas somente visualmente. A API também bloqueia ações não autorizadas, evitando que um usuário contorne a interface com chamadas HTTP diretas.

### RA-02 — Sessão protegida

O JWT é armazenado em cookie assinado, `httpOnly`, `sameSite=lax` e `secure` em produção. O token não fica disponível para JavaScript no navegador.

### RA-03 — Atualização otimista

A movimentação e a exclusão de cards atualizam a interface imediatamente. Os dados são reconciliados com a API após a ação.

### RA-04 — Validação compartilhada por camadas

Os formulários apresentam validação amigável no front-end, enquanto a API valida novamente payloads, UUIDs, perfis, status e permissões.

### RA-05 — E-mail automático

O cadastro gera um e-mail consistente a partir do nome e impede duplicidade.

### RA-06 — Estado de saúde da API

O endpoint `GET /` permite verificar se a função da API está disponível.

### RA-07 — Dados de demonstração

O seed cria usuários de todos os perfis e demandas em todos os status, permitindo que os avaliadores testem imediatamente todas as regras da aplicação.

### RA-08 — Compatibilidade serverless

A inicialização do Fastify foi separada entre servidor local e handler da Vercel, permitindo reutilização da mesma aplicação nos dois ambientes.

## Qualidade e verificação

Antes da entrega:

```bash
cd csp-api && npm run typecheck
cd ../csp-app && npm run typecheck && npm run build
```

Os fluxos previstos para validação manual são:

1. Entrar com cada perfil.
2. Conferir menus, atalhos e ações visíveis.
3. Cadastrar usuário como Administrador.
4. Cadastrar demanda como Administrador e Agilista.
5. Editar demanda como Agilista e Desenvolvedor.
6. Excluir demanda como Agilista.
7. Mover cards como Agilista e Desenvolvedor.
8. Confirmar que cards em produção permanecem em produção.
9. Testar busca, ordenação, máscaras e mensagens de validação.
