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

    // ✅ Criar nova visita
    app.post("/visitas", async (request, reply) => {
        const bodySchema = z.object({
            visitor_name: z.string(),
            group_size: z.number().min(1).default(1),
            course: z.string().nullable().optional(),
            country: z.string().default("BRAZIL"),
            state: z.string().default("RIO GRANDE DO SUL"),
            city: z.string().default("SANTA MARIA"),
            purpose: z.string().nullable().optional()
        });

        const data = bodySchema.parse(request.body);

        const visita = await prisma.visitas.create({ data });

        return reply.status(201).send(visita);
    });

    // ✅ Atualizar visita
    app.put("/visitas/:id", async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().cuid()
        });

        const bodySchema = z.object({
            visitor_name: z.string(),
            group_size: z.number().min(1),
            course: z.string().nullable().optional(),
            country: z.string(),
            state: z.string(),
            city: z.string(),
            purpose: z.string().nullable().optional()
        });

        const { id } = paramsSchema.parse(request.params);
        const data = bodySchema.parse(request.body);

        const updated = await prisma.visitas.update({
            where: { id },
            data
        });

        return updated;
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
