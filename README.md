# Auth Core API

API RESTful para gerenciamento de autenticação e autorização de
usuários, construída com **Node.js**, **Express**, **TypeScript**,
**Prisma**, **PostgreSQL**, **Zod**, **Bcrypt** e **JWT**.

------------------------------------------------------------------------

## 🚀 Funcionalidades

-   Registro de usuários
-   Login com geração de token JWT
-   Alteração de senha autenticada
-   Exclusão de conta do próprio usuário
-   CRUD de papéis (roles) para administradores
-   Gerenciamento de permissões (usuário padrão, admin, master)
-   Middleware de autenticação e autorização
-   Validações com **Zod**
-   Tratamento de erros personalizado

------------------------------------------------------------------------

## 📂 Estrutura de Pastas

    /node_modules
    /prisma
    /src
      /config        # Configurações do projeto (variáveis de ambiente)
      /controllers   # Controllers (lógica das rotas)
      /database      # Conexão com banco de dados
      /errors        # Classe de erros customizados
      /interfaces    # Interfaces e tipagens
      /middlewares   # Middlewares de autenticação e erro
      /models        # Modelos (regras de negócio)
      /modules       # Funções utilitárias
      /routes        # Definição das rotas
      /schemas       # Schemas de validação (Zod)
      /types         # Tipagem adicional (ex: Express Request)
    .env.example

------------------------------------------------------------------------

## 🛠 Tecnologias

-   **Node.js**
-   **Express 5**
-   **TypeScript**
-   **Prisma ORM**
-   **PostgreSQL**
-   **Zod**
-   **Bcrypt**
-   **JWT (jsonwebtoken)**
-   **dotenv**

------------------------------------------------------------------------

## ⚙️ Instalação e Configuração

1.  Clone o repositório:

``` bash
git clone https://github.com/mateusvcsmoura/auth-core.git
cd auth-core
```

2.  Instale as dependências:

``` bash
npm install
```

3.  Configure o `.env` baseado no `.env.example`:

``` env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/authcore"
JWT_SECRET="sua_chave_secreta"
```

4.  Execute as migrations para criar as tabelas:

``` bash
npx prisma migrate dev
```

5.  Rode a aplicação em modo desenvolvimento:

``` bash
npm run dev
```

------------------------------------------------------------------------



# 📌 Estrutura dos Endpoints e Payloads

---

## 👤 Usuário (`/api/user`)

### `POST /register`
Cria um novo usuário.

**Body JSON:**
```json
{
  "name": "string (mínimo 4 caracteres)",
  "email": "string (formato válido)",
  "password": "string (mínimo 8, 1 minúscula, 1 maiúscula, 1 número, 1 caractere especial)"
}
```

### `POST /login`
Realiza login de usuário e retorna um token JWT.

**Body JSON:**
```json
{
  "email": "string (formato válido)",
  "password": "string (mínimo 8 caracteres)"
}
```

### `POST /change-password` *(autenticado)*
Altera a senha do usuário logado.

**Body JSON:**
```json
{
  "oldPassword": "string (mínimo 8 caracteres)",
  "newPassword": "string (mínimo 8, 1 minúscula, 1 maiúscula, 1 número, 1 caractere especial)"
}
```

### `DELETE /delete-account` *(autenticado)*
Exclui a própria conta.

**Body JSON:** nenhum  
(Apenas precisa do **Bearer Token** no header)

---

## 🛠 Admin (`/api/admin`)

### `POST /create-role`
Cria um novo papel (role).

**Body JSON:**
```json
{
  "name": "string (mínimo 3 caracteres)",
  "description": "string (opcional)"
}
```

### `DELETE /delete-role`
Deleta um papel.

**Body JSON:**
```json
{
  "roleId": "number (id do papel)"
}
```

### `GET /dashboard/users`
Lista todos os usuários.

**Body JSON:** nenhum  
**Query params opcionais:**  
```yaml
take: number (quantidade por página, default 50)
skip: number (pular registros, default 0)
orderBy: "createdAt" | "name" | "email"
order: "asc" | "desc" (default desc)
```

### `POST /dashboard/update-user-role`
Atualiza o papel de um usuário. *(apenas Master)*

**Body JSON:**
```json
{
  "userId": "number",
  "newRole": "Standard" | "Admin"
}
```

### `DELETE /dashboard/delete-user/:userId`
Exclui um usuário pelo id.

**Params (URL):**
```yaml
userId: number
```
**Body JSON:** nenhum

---

## 🏠 Home (`/api/auth/home`)
Retorna mensagem de boas-vindas ao usuário autenticado.

**Método:** `GET`  
**Body JSON:** nenhum  
**Auth:** Bearer Token obrigatório

------------------------------------------------------------------------

## 📜 Scripts

-   `npm run dev` → Inicia em modo desenvolvimento (tsx)
-   `npm run build` → Compila TypeScript
-   `npm start` → Roda versão compilada

------------------------------------------------------------------------

## 👨‍💻 Autor

Projeto desenvolvido por **Mateus Moura (mateusvcsmoura)**.\
Estudante de Análise e Desenvolvimento de Sistemas, apaixonado por
backend e tecnologias modernas.

------------------------------------------------------------------------

## 📄 Licença

Este projeto está sob licença **ISC**.
