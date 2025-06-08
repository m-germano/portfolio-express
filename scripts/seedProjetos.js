const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.projeto.createMany({
    data: [
      {
        nome: "API 1° Semestre",
        descricao:
          "Desenvolver um site informativo simples e funcional sobre a Metodologia Ágil que contenha conceitos e fundamentos, assim como exemplos práticos e avaliações para o usuário.",
        imagem: "/images/api1.png",
        githubUrl: "https://github.com/m-germano/projetoAPI-horus",
      },
      {
        nome: "API 2° Semestre",
        descricao:
          "O objetivo deste API é desenvolver um software para automatizar a extração de informações de documentos usando modelos de linguagem e visão.",
        imagem: "/images/api2.png",
        githubUrl: "https://github.com/equipeAdalove/API-SEMESTRE2",
      },
    ],
  });

  console.log("Projetos inseridos com sucesso!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
