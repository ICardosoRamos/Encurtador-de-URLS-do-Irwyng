import fastify from "fastify";
import { PrismaClient } from "@prisma/client";

const app = fastify();

const prisma = new PrismaClient();

app.get("/urls", async () => {
  const urls = await prisma.url.findMany();

  return { urls };
});

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => console.log("HTTP Server Running"));
