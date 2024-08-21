import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import fastifyCors from "@fastify/cors";

const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const app = fastify();

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST"],
});

const prisma = new PrismaClient();

const ERROR_MESSAGES = {
  user_exists:
    "Este nome de usuário já existe em nossos cadastros, faça login ou, se não for você, crie outro com nome diferente!",
  username_is_empty: "Campo nome de usuário não informado!",
  user_dont_exists:
    "O usuário com esse nome não existe no banco, crie um primeiro e então faça login com o mesmo!",
  fields_not_informed:
    "Campos obrigatporios não informados, por favor, informe-os, se o erro persistir contate o suporte!",
  id_url_is_empty: "Campo idUrl não informado!, ",
};

async function verifyUser(username: string) {
  const existingUser = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!existingUser) {
    return null;
  }

  return existingUser;
}

// POR ENQUANTO O GET USERS SÓ RETORNA UM USER POR VEZ, VAI SER COMO FAZER LOGIN, É INFORMADO O USERNAME ATRAVES DE UM CAMPO NO FRONT,
// A REQUISIÇÃO É ENVIADA, RETORNA O USER OU NÃO E SE RETORNAR ALGUÉM VALIDO, USA ESSE USER ENT PARA MOSTRAR AS URLS ENCURTADAS DO MESMO.
app.get("/users", async (request, reply) => {
  try {
    const createUserSchema = z.object({
      username: z.string(),
    });

    const { username } = createUserSchema.parse(request.query);

    if (!username) {
      return reply.status(400).send({
        message: ERROR_MESSAGES["username_is_empty"],
      });
    }

    const user = await verifyUser(username);

    if (!user) {
      return reply.status(404).send({
        message: ERROR_MESSAGES["user_dont_exists"],
      });
    }

    return reply.status(200).send(user);
  } catch (error) {
    console.error(error);
    return reply.status(500).send(error);
  }
});

app.post("/login", async (request, reply) => {
  try {
    const createUrlSchema = z.object({
      username: z.string(),
    });

    const { username } = createUrlSchema.parse(request.body);

    if (!username) {
      return reply.status(400).send({
        message: ERROR_MESSAGES["username_is_empty"],
      });
    }

    const user = await prisma.user.findUnique({
      where: { username: username },
      include: { urls: true },
    });

    if (!user) {
      return reply.status(404).send({
        message: ERROR_MESSAGES["user_dont_exists"],
      });
    }

    return reply.status(200).send(user);
  } catch (error) {
    console.error(error);
    return reply.status(500).send(error);
  }
});

// AQUI A API POST DE USERS CADASTRA UM USER NOVO.
app.post("/users", async (request, reply) => {
  try {
    const createUrlSchema = z.object({
      username: z.string(),
    });

    const { username } = createUrlSchema.parse(request.body);

    if (!username) {
      return reply.status(400).send({
        message: ERROR_MESSAGES["username_is_empty"],
      });
    }

    const existsUser = await verifyUser(username); // verifica existencia de um user com mesmo username

    if (existsUser) {
      return reply.status(400).send({
        message: ERROR_MESSAGES["user_exists"],
      });
    }

    await prisma.user.create({
      data: {
        username: username,
      },
    });

    const user = await prisma.user.findUnique({
      where: { username: username },
      include: { urls: true },
    });

    return reply.status(201).send({
      user: user,
      message: "Usuário criado com sucesso!",
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send(error);
  }
});

// AQUI É RETORNADA A URL ENCURTADA QUANDO O USUÁRIO TENTA ACESSAR A MESMA.
app.get("/urls", async (request, reply) => {
  try {
    const createUserSchema = z.object({
      idUrl: z.string(),
    });

    const { idUrl } = createUserSchema.parse(request.query);

    if (!idUrl) {
      return reply.status(400).send({
        message: ERROR_MESSAGES["id_url_is_empty"],
      });
    }

    const url = await prisma.url.findUnique({ where: { idUrl } });

    return reply.status(200).send(url);
  } catch (error) {
    console.error(error);
    return reply.status(500).send(error);
  }
});

async function verifyExistingUUIDinDatabase(urlId: string) {
  const existingUrl = await prisma.url.findUnique({
    where: {
      idUrl: urlId,
    },
  });

  if (existingUrl) {
    const newUrlId = nanoid(); // Gerando um novo UUID
    return await verifyExistingUUIDinDatabase(newUrlId); // Recursividade
  }

  return urlId;
}

app.post("/urls", async (request, reply) => {
  try {
    const createUrlSchema = z.object({
      originalUrl: z.string(),
      username: z.string(),
    });

    const { originalUrl, username } = createUrlSchema.parse(request.body);

    if (!username || !originalUrl) {
      return reply.status(400).send({
        message: ERROR_MESSAGES["fields_not_informed"],
      });
    }

    const user = await verifyUser(username);

    if (!user) {
      return reply.status(404).send({
        message: ERROR_MESSAGES["user_dont_exists"],
      });
    }

    const urlId = nanoid();

    const urlIdVerificado = await verifyExistingUUIDinDatabase(urlId); // AQUI É RETORNADO UM URL_ID UNICO

    await prisma.url.create({
      data: {
        originalUrl: originalUrl,
        idUrl: urlIdVerificado,
        userId: user?.id as number,
      },
    });

    const urls = (await prisma.url.findMany()).filter(
      (url) => url.userId === user?.id
    );

    return reply.status(201).send({
      urls: urls,
      message: "URL encurtada com sucesso!",
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send(error);
  }
});

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => console.log("HTTP Server Running"));
