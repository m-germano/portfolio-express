const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🔄 LISTAR TODOS — GET /projetos/json
router.get("/json", async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany();
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar projetos." });
  }
});

// 🔍 BUSCAR POR ID — GET /projetos/json/:id
router.get("/json/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const projeto = await prisma.projeto.findUnique({ where: { id } });
    if (!projeto)
      return res.status(404).json({ erro: "Projeto não encontrado" });
    res.json(projeto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar projeto." });
  }
});

// ✍️ CRIAR NOVO — POST /projetos/json
router.post("/json", async (req, res) => {
  const { nome, descricao, imagem, githubUrl } = req.body;
  try {
    const novoProjeto = await prisma.projeto.create({
      data: { nome, descricao, imagem, githubUrl },
    });
    res.status(201).json(novoProjeto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar projeto." });
  }
});

// ✏️ ATUALIZAR — PUT /projetos/json/:id
router.put("/json/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, descricao, imagem, githubUrl } = req.body;
  try {
    const projeto = await prisma.projeto.update({
      where: { id },
      data: { nome, descricao, imagem, githubUrl },
    });
    res.json({ mensagem: "Projeto atualizado com sucesso", projeto });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar projeto." });
  }
});

// 🗑️ DELETAR — DELETE /projetos/json/:id
router.delete("/json/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.projeto.delete({ where: { id } });
    res.json({ mensagem: "Projeto excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir projeto." });
  }
});

// 🌐 RENDERIZAR HTML — GET /projetos
router.get("/", async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany();
    res.render("pages/projetos", { projetos });
  } catch (error) {
    res.status(500).send("Erro ao carregar a página de projetos.");
  }
});

module.exports = router;
