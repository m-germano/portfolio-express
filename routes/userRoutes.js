const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

// GET: Listar todos os usuários (somente admin)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, isAdmin: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).send("Erro interno ao listar usuários.");
  }
});

// DELETE: Excluir usuário (somente admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Evita que o admin exclua a si mesmo
    if (userId === req.user.id) {
      return res.status(400).send("Você não pode excluir a si mesmo.");
    }

    await prisma.user.delete({ where: { id: userId } });
    res.redirect("/messages"); // Redireciona de volta ao painel admin
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).send("Erro ao deletar usuário.");
  }
});

module.exports = router;
