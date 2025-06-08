const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

// POST: Enviar mensagem (usuário logado)
router.post("/", authenticateToken, async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Salvar no banco de dados
    await prisma.message.create({
      data: {
        name,
        email,
        subject,
        content: message,
        userId: req.user.id,
      },
    });

    // Enviar e-mail com Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Portfólio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: subject || "Novo Contato",
      text: `Nome: ${name}\nEmail: ${email}\nMensagem:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    res.json({ success: false });
  }
});

// GET: Painel Admin (mensagens + usuários formatados)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Formatar as datas
    const formattedMessages = messages.map((msg) => ({
      ...msg,
      formattedCreatedAt: new Date(msg.createdAt).toLocaleDateString("pt-BR"),
    }));

    const formattedUsers = users.map((user) => ({
      ...user,
      formattedCreatedAt: new Date(user.createdAt).toLocaleDateString("pt-BR"),
      formattedLastLogin: user.lastLogin
        ? new Date(user.lastLogin).toLocaleDateString("pt-BR")
        : null,
    }));

    res.render("pages/messages", {
      user: req.user,
      users: formattedUsers,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Erro ao carregar o painel admin:", error);
    res.status(500).send("Erro interno do servidor.");
  }
});

// DELETE: Deletar mensagem
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.message.delete({ where: { id } });
    res.redirect("/messages");
  } catch (error) {
    console.error("Erro ao deletar mensagem:", error);
    res.status(500).send("Erro ao deletar.");
  }
});

module.exports = router;
