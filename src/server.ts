import fastify from "fastify";
import { userRoutes } from "./routes/users/users";
import { especimeRoutes } from "./routes/especime/especime";
import { visitaRoutes } from "./routes/visitas/visitas";
import cors from '@fastify/cors'
const app = fastify();
import fastifyJwt from '@fastify/jwt';

app.register(fastifyJwt, {
  secret: 'b1d7e2c8f9a4e6b3c5f1a8d2e7c4b9f6a3d8e1c7b5f2a6d4e9c3b7f5a2d6e8c1', 
});

app.register(cors, {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
})
app.register(userRoutes);
app.register(especimeRoutes);
app.register(visitaRoutes);



app.listen({
  host: "0.0.0.0",
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log("✅ Server is running on port 3333");
});