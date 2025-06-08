require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const app = express();
const prisma = new PrismaClient();

// Cria o admin padrão se não existir
async function createDefaultAdmin() {
  const bcrypt = require("bcryptjs");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@admin.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync("admin", 10);

    await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@admin.com",
        password: hashedPassword,
        isAdmin: true,
      },
    });

    console.log(
      "✅ Usuário admin criado (email: admin@admin.com | senha: admin)",
    );
  } else {
    console.log("ℹ️ Usuário admin já existe.");
  }
}

createDefaultAdmin(); // Executa ao iniciar o servidor

// Middlewares globais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware para repassar o user para as views
app.use((req, res, next) => {
  const token = req.cookies.accessToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded;
    } catch (err) {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
});

// Rotas
app.use("/", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/messages", require("./routes/messageRoutes"));
app.use("/projetos", require("./routes/projetosRoutes"));

// Página inicial
app.get("/", async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany();
    const quote = "Simplicity is the soul of efficiency.";
    const quoteAuthor = "Austin Freeman";

    res.render("pages/index", {
      quote,
      quoteAuthor,
      status: null,
      projetos, // passa os projetos para o EJS
    });
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.render("pages/index", {
      quote: "Erro ao carregar projetos.",
      quoteAuthor: "",
      status: "error",
      projetos: [], // fallback para evitar erro no EJS
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Página não encontrada");
});

// Start do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`),
);
