import fastify from "fastify";
import { userRoutes } from "./routes/users/users";
import { especimeRoutes } from "./routes/especime/especime";


const app = fastify();

app.register(userRoutes);
app.register(especimeRoutes);

app.listen({
  host: "0.0.0.0",
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
}).then(() => {
  console.log("✅ Server is running on port 3000");
});
