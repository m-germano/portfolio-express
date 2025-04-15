# Portfólio Acadêmico

Este é um portfólio acadêmico desenvolvido em **Node.js + Express + EJS**, como atividade proposta para a disciplina de Engenharia de Software 2.

## 📚 Tecnologias Utilizadas

<div align="left">
  <img src="https://skillicons.dev/icons?i=nodejs,express,html,css,tailwind" height="60" />
</div>

## 🛠️ Bibliotecas Utilizadas

- **EJS**: Motor de templates que permite gerar HTML com JavaScript de forma simples e dinâmica.
- **Dotenv**: Carrega variáveis de ambiente de um arquivo `.env` para `process.env`, facilitando a configuração do ambiente da aplicação.
- **Nodemailer**: Biblioteca para envio de e-mails via Node.js, usada para funcionalidades como formulários de contato.


## 🚀 Executando o Projeto

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Instale o nodemon para desenvolvimento:

   ```bash
   npm install --save-dev nodemon
   ```

3. Adicione este script ao seu `package.json`:

   ```json
   "scripts": {
     "dev": "nodemon app.js"
   }
   ```

4. Renomeie o arquivo `.env-example` para `.env` e preencha as variáveis de ambiente conforme necessário.

5. Inicie o servidor:

   ```bash
   npm run dev
   ```

6. Acesse:

   ```
   http://localhost:3000
   ```
