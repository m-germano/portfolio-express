const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET: Página de registro
router.get("/register", (req, res) => {
  res.render("partials/register");
});

// POST: Registro
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validação básica
    if (!username || !email || !password) {
      return res.status(400).send("Todos os campos são obrigatórios.");
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) return res.status(400).send("Usuário já existe.");

    const hashedPassword = bcrypt.hashSync(password, 10);

    await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    res.redirect("/login");
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).send("Erro interno ao registrar usuário.");
  }
});

// GET: Página de login
router.get("/login", (req, res) => {
  res.render("partials/login");
});

// POST: Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email e senha são obrigatórios.");
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: email }],
      },
    });

    if (!user) return res.status(400).send("Usuário não encontrado.");

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).send("Senha incorreta.");

    // Atualiza o campo de último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("/");
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).send("Erro interno ao fazer login.");
  }
});

// POST: Logout
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.redirect("/");
});

module.exports = router;
