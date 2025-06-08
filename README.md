# 🎓 Portfólio Acadêmico

Este é um portfólio acadêmico desenvolvido em **Node.js + Express + EJS**, como atividade da disciplina de Engenharia de Software 2. O sistema conta com autenticação, painel administrativo, envio de mensagens, cadastro de projetos e estrutura modularizada com renderização via EJS.

---

## 📚 Tecnologias Utilizadas

<div align="left">
  <img src="https://skillicons.dev/icons?i=nodejs,express,html,css,tailwind,postgres,prisma" height="60" />
</div>

---

## 🛠️ Bibliotecas e Ferramentas

- **Express**: Framework web minimalista e flexível.
- **EJS**: Motor de templates para renderizar HTML com dados dinâmicos.
- **Prisma ORM**: ORM moderno e eficiente para integração com PostgreSQL.
- **PostgreSQL**: Banco de dados relacional utilizado.
- **JWT (jsonwebtoken)**: Geração de tokens de autenticação.
- **Bcryptjs**: Hash de senhas para maior segurança.
- **Dotenv**: Variáveis de ambiente em arquivos `.env`.
- **Nodemailer**: Envio de e-mails para o formulário de contato.
- **Cookie-parser**: Leitura e manipulação de cookies no backend.
- **Method-override**: Suporte a métodos PUT e DELETE em formulários HTML.

---

## 🔐 Funcionalidades

- Cadastro e login de usuários com autenticação JWT.
- Login via **email ou nome de usuário**.
- Criação automática de um usuário **admin**
- Interface protegida para **admin gerenciar projetos**.
- Envio de mensagens de contato com persistência no banco.
- Layout responsivo com **TailwindCSS**.
- Feedback visual para mensagens e ações do usuário.
- Rotas organizadas por funcionalidade.

---

## 📁 Estrutura de Pastas

```
📁 portfolio
│
├── app.js                  # Arquivo principal da aplicação
├── prisma/
│   └── schema.prisma       # Schema do banco de dados (Prisma ORM)
├── public/                 # Arquivos estáticos (CSS, imagens)
├── routes/                 # Arquivos de rotas (auth, users, projetos, mensagens)
├── controllers/            # (opcional) Lógica separada das rotas
├── views/
│   ├── pages/              # Páginas EJS principais (index, login, register)
│   ├── partials/           # Header, Footer e componentes reutilizáveis
│   └── includes/           # Componentes internos (slider, cards, etc)
├── middleware/             # Middlewares (auth, verificação de admin)
├── .env                    # Variáveis de ambiente (não versionado)
└── README.md               # Este arquivo
```

---

## ⚙️ Executando o Projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Instale o `nodemon` para desenvolvimento:**

```bash
npm install --save-dev nodemon
```

4. **Configure o script no `package.json`:**

```json
"scripts": {
  "dev": "nodemon app.js"
}
```

5. **Configure seu banco de dados e variáveis de ambiente:**

Renomeie o `.env-example` para `.env` e edite as variáveis conforme necessário:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/portfolio
JWT_SECRET=umaFraseSecretaParaToken
```

6. **Gere o client do Prisma:**

```bash
npx prisma generate
```

7. **Rode as migrações do banco de dados:**

```bash
npx prisma migrate dev --name init
```

8. **Inicie o servidor:**

```bash
npm run dev
```

9. **Acesse no navegador:**

```
http://localhost:3000
```

---

## 📬 Contato

Este portfólio também conta com um formulário de contato funcional. As mensagens são armazenadas no banco de dados e visíveis para o administrador.

---

## 📌 Licença

Projeto acadêmico sem fins lucrativos. Uso livre com créditos.
