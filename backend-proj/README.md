# Backend — Controle de Despesas

API REST em Node.js, Express e MySQL, organizada em rotas, controllers, middleware e configuração. As rotas de categorias, despesas e dashboard exigem JWT. Os dados são isolados por usuário.

## Requisitos

- Node.js 18 ou superior e npm
- XAMPP com MySQL/MariaDB iniciado (porta padrão 3306)

## Preparar o banco

No XAMPP, inicie **MySQL** e abra `http://localhost/phpmyadmin`. Importe `database.sql` pela opção **Importar**. O script cria o banco `controle_despesas` e as tabelas.

## Configurar e executar

Na pasta `backend-proj`, copie `.env.example` para `.env`. Ajuste as credenciais do MySQL; no XAMPP padrão, usuário `root` e senha vazia. Troque `JWT_SECRET` por uma chave aleatória com pelo menos 32 caracteres.

```powershell
npm install
npm run dev
```

A API sobe em `http://localhost:3000`. Para execução sem reinício automático use `npm start`. `GET /health` verifica se a API está respondendo.

O frontend já aponta para `http://localhost:3000`. Cadastre uma conta na tela de registro e depois faça login; o token JWT é retornado em `POST /auth/login` e enviado pelo frontend como `Authorization: Bearer <token>`.

## Rotas

- `POST /users` — cadastro (`nome`, `email`, `senha`; mínimo 8 caracteres)
- `POST /auth/login` — login (`email`, `senha`)
- `/categories` — GET, POST, PUT `/:id`, DELETE `/:id`
- `/expenses` — GET com filtros `categoria`, `status`, `dataInicio`, `dataFim`, `valorMin`, `valorMax`; POST, PUT `/:id`, DELETE `/:id`
- `GET /dashboard/total-expenses`, `/dashboard/expenses-count`, `/dashboard/expenses-by-category`

Cadastro e login são públicos; as demais rotas requerem JWT. Cada conta tem suas próprias categorias e despesas.
