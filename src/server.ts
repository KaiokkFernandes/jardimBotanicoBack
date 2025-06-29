import fastify from "fastify";
import { userRoutes } from "./routes/users/users";
import { especimeRoutes } from "./routes/especime/especime";
import { visitaRoutes } from "./routes/visitas/visitas";
import cors from '@fastify/cors'
const app = fastify();

app.register(cors, {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
})
app.register(userRoutes);
app.register(especimeRoutes);
app.register(visitaRoutes);



app.listen({
  host: "0.0.0.0",
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
}).then(() => {
  console.log("✅ Server is running on port 3000");
});