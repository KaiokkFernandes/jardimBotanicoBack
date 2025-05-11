import { PrismaClient } from "@prisma/client"
import fastify from "fastify";
import {z} from "zod";

const app = fastify();  
const prisma = new PrismaClient();


app.get("/Users", async (request, reply) => {   
    const users = await prisma.user.findMany();

    return users;
});

app.post("/Users", async (request, reply) => {

    const userSchema = z.object({
        name: z.string(),
        email: z.string().email(),
    });

    const { name, email } = userSchema.parse(request.body);

    await prisma.user.create({
        data: {
            name,
            email,
        },
    }); 

    return reply.status(201).send({ message: "User created successfully" });
});


app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
}).then(() => {
    console.log('Server is runnin');
})