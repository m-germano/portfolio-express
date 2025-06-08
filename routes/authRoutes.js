const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET: Página de registro
router.get("/register", (req, res) => {
  res.render("partials/register"); // Corrigido
});

// POST: Registro
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) return res.status(400).send("Usuário já existe.");

  const hashedPassword = bcrypt.hashSync(password, 10);

  await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  res.redirect("/login");
});

// GET: Página de login
router.get("/login", (req, res) => {
  res.render("partials/login"); // Corrigido
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { username: email }],
    },
  });

  if (!user) return res.status(400).send("Usuário não encontrado.");

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(400).send("Senha incorreta.");

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
});

// POST: Logout
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.redirect("/");
});

module.exports = router;
