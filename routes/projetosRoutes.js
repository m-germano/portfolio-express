const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE
router.post("/", async (req, res) => {
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

// READ ALL
router.get("/", async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany();
    res.render("pages/projetos", { projetos });
  } catch (error) {
    res.status(500).send("Erro ao buscar projetos.");
  }
});

// READ por ID
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const projeto = await prisma.projeto.findUnique({ where: { id } });
    if (!projeto) return res.status(404).send("Projeto não encontrado.");
    res.json(projeto);
  } catch (error) {
    res.status(500).send("Erro ao buscar projeto.");
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, descricao, imagem, githubUrl } = req.body;
  try {
    await prisma.projeto.update({
      where: { id },
      data: { nome, descricao, imagem, githubUrl },
    });
    res.json({ mensagem: "Projeto atualizado com sucesso." });
  } catch (error) {
    res.status(500).send("Erro ao atualizar projeto.");
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.projeto.delete({ where: { id } });
    res.json({ mensagem: "Projeto excluído com sucesso." });
  } catch (error) {
    res.status(500).send("Erro ao excluir projeto.");
  }
});

module.exports = router;
