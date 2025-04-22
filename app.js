require("dotenv").config(); // Carregar as variáveis do .env

const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

// Configurações do Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const quote = "Simplicity is the soul of efficiency.";
  const quoteAuthor = "Austin Freeman";
  res.render("index", { quote, quoteAuthor, status: null });
});

app.post("/", async (req, res) => {
  console.log(req.body); // Adicione isso para verificar o que está sendo enviado
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Nodemailer - Contato" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: subject || "Novo Contato do Portfólio",
    text: `Nome: ${name}\nEmail: ${email}\nMensagem:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    // Envia a resposta JSON indicando sucesso
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    // Envia a resposta JSON indicando erro
    res.json({ success: false });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`),
);
