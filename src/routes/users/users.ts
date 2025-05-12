import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
  app.get("/users", async () => {
    return prisma.user.findMany();
  });


  app.get("/users/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().cuid() });
    const { id } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return reply.code(404).send({ error: "Not found" });

    return user;
  });


  app.post("/users", async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });
    const data = bodySchema.parse(request.body);

    await prisma.user.create({ data });

    return reply.code(201).send({ message: "User created successfully" });
  });

  app.put("/users/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().cuid() });
    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    });
    const data = bodySchema.parse(request.body);

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    return updated;
  });


  app.delete("/users/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().cuid() });
    const { id } = paramsSchema.parse(request.params);

    await prisma.user.delete({ where: { id } });

    return reply.code(204).send();
  });
}
