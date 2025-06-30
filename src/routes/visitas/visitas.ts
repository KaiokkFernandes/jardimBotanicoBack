import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function visitaRoutes(app: FastifyInstance) {
    // ✅ Obter todas as visitas
    app.get("/visitas", async () => {
        return prisma.visitas.findMany();
    });
    // ✅ Obter uma visita por ID
    app.get("/visitas/:id", async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().cuid()
        });
        const { id } = paramsSchema.parse(request.params);

        const visita = await prisma.visitas.findUnique({ where: { id } });

        if (!visita) {
            return reply.status(404).send({ error: "Visita não encontrada" });
        }

        return visita;
    });

    // Rota para criar uma visita
  app.post("/visitas", async (request, reply) => {
    const bodySchema = z.object({
      visitor_name: z.string(),
      group_size: z.number().min(1).default(1),
      course: z.string().nullable().optional(),
      country: z.string().default("BRAZIL"),
      state: z.string().default("RIO GRANDE DO SUL"),
      city: z.string().default("SANTA MARIA"),
      purpose: z.string().nullable().optional(),
      gender: z.enum(["MASCULINO", "FEMININO", "OUTRO"]).optional(),
    });

    const data = bodySchema.parse(request.body);

    await prisma.visitas.create({ data });

    return reply.code(201).send({ message: "Visita criada com sucesso" });
  });

  // Rota para atualizar uma visita existente
  app.put("/visitas/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      visitor_name: z.string(),
      group_size: z.number().min(1),
      course: z.string().nullable().optional(),
      country: z.string(),
      state: z.string(),
      city: z.string(),
      purpose: z.string().nullable().optional(),
      gender: z.enum(["MASCULINO", "FEMININO", "OUTRO"]).optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    await prisma.visitas.update({
      where: { id },
      data,
    });

    return reply.send({ message: "Visita atualizada com sucesso" });
  });

    // ✅ Deletar visita
    app.delete("/visitas/:id", async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().cuid()
        });

        const { id } = paramsSchema.parse(request.params);

        await prisma.visitas.delete({
            where: { id }
        });

        return reply.status(204).send();
    });
  // Rota para obter estatísticas de visitas 

  app.get("/estatisticas/genero", async (request, reply) => {
    const result = await prisma.visitas.groupBy({
      by: ["gender"],
      _count: { gender: true },
    });
    return result.map(r => ({ genero: r.gender, total: r._count.gender }));
  });

  app.get("/estatisticas/curso", async (request, reply) => {
    const result = await prisma.visitas.groupBy({
      by: ["course"],
      _count: { course: true },
      orderBy: { _count: { course: "desc" } },
      take: 10,
      where: { course: { not: "" } },
    });
    return result.map(r => ({ curso: r.course, total: r._count.course }));
  });

  app.get("/estatisticas/estado", async (request, reply) => {
    const result = await prisma.visitas.groupBy({
      by: ["state"],
      _count: { state: true },
      orderBy: { _count: { state: "desc" } },
    });
    return result.map(r => ({ estado: r.state, total: r._count.state }));
  });

  app.get("/estatisticas/data", async (request, reply) => {
    const result = await prisma.visitas.groupBy({
      by: ["createdAt"],
      _count: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return result.map(r => ({
      data: r.createdAt.toISOString().split("T")[0],
      total: r._count.createdAt,
    }));
  });

app.get("/estatisticas/total-visitas", async (request, reply) => {
  const querySchema = z.object({
    ano: z.string().optional(), // permite ?ano=2024
  });
  const { ano } = querySchema.parse(request.query);
  const anoSelecionado = parseInt(ano ?? "") || new Date().getFullYear();

  const inicioDoAno = new Date(`${anoSelecionado}-01-01T00:00:00.000Z`);
  const fimDoAno = new Date(`${anoSelecionado}-12-31T23:59:59.999Z`);

  try {
    const total = await prisma.visitas.count({
      where: {
        createdAt: {
          gte: inicioDoAno,
          lte: fimDoAno,
        },
      },
    });

    return { ano: anoSelecionado, total};
  } catch (error) {
    console.error("Erro ao buscar total de visitas:", error);
    return reply.status(500).send({ error: "Erro ao buscar total de visitas" });
  }
});



}
