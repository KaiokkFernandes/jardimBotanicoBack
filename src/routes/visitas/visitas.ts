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
}
