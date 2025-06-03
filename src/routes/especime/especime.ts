import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function especimeRoutes(app: FastifyInstance) {
  app.get("/especimes", async () => {
    return prisma.especime.findMany();
  });

  app.get("/especimes/tipo/:type", async (request, reply) => {
    const paramsSchema = z.object({
      type: z.enum(['FAUNA', 'FLORA']),
    });
    const { type } = paramsSchema.parse(request.params);

    const especimes = await prisma.especime.findMany({
      where: {
        specimen_type: type, 
      },
    });

    return especimes;
  });


  app.get("/especimes/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().cuid() });
    const { id } = paramsSchema.parse(request.params);

    const especime = await prisma.especime.findUnique({ where: { id } });
    if (!especime) return reply.code(404).send({ error: "Not found" });

    return especime;
  });

  app.post("/especimes", async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      scientific_name: z.string(),
      category: z.string(),
      description: z.string().optional(),
      habitat: z.string().optional(),
      curiosity: z.string().optional(),
      imagem_url: z.string().optional(),
      specimen_type: z.enum(['FAUNA', 'FLORA']),
    });
    const data = bodySchema.parse(request.body);

    await prisma.especime.create({ data });
    return reply.code(201).send({ message: "Especime created successfully" });
  });

  app.put("/especimes/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().cuid() });
    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      name: z.string(),
      scientific_name: z.string(),
      category: z.string(),
      description: z.string().optional(),
      habitat: z.string().optional(),
      curiosity: z.string().optional(),
      imagem_url: z.string().optional(),
    });
    const data = bodySchema.parse(request.body);

    const updated = await prisma.especime.update({
      where: { id },
      data,
    });

    return updated;
  });

  app.delete("/especimes/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().cuid() });
    const { id } = paramsSchema.parse(request.params);

    await prisma.especime.delete({ where: { id } });

    return reply.code(204).send();
  });
}
