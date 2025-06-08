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

// GET: Painel Admin (mensagens + usuários)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });

    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, isAdmin: true },
      orderBy: { createdAt: "desc" },
    });

    res.render("pages/messages", { messages, users });
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
