const path = require("path");
const Fastify = require("fastify");
const fastify = Fastify({ logger: true });

const Next = require("next");
const app = Next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

const jwt = require("@fastify/jwt");
const product_router = require("./api/modules/product_data/router");
const authService = require("./api/modules/auth/service");

// โหลด env ให้ครบ (db + token) ก่อนใช้งาน
require("dotenv").config({ path: path.join(__dirname, "api/config/db.env") });
require("dotenv").config({ path: path.join(__dirname, "api/config/token.env") });

// guard: ถ้าไม่มี secret ให้หยุดเลย จะได้ไม่งง
if (!process.env.AUTH_ACCESS_KEY || !process.env.AUTH_REFRESH_KEY) {
    console.error("Missing AUTH_ACCESS_KEY / AUTH_REFRESH_KEY (token.env)");
    process.exit(1);
}

app
    .prepare()
    .then(async () => {

        // register JWT แบบ namespaced
        fastify.register(jwt, { secret: process.env.AUTH_ACCESS_KEY, namespace: "access" });
        fastify.register(jwt, { secret: process.env.AUTH_REFRESH_KEY, namespace: "refresh" });

        // ====== Auth endpoints ======
        fastify.post("/api/module/auth/signup", async (req, reply) => {
            try {
                const body = req.body?.body || req.body || {};
                const result = await authService.signup(body);
                switch (result.status) {
                    case 201:
                        return reply.code(201).send({ status: 201, error: null, results: result.results });
                    case 400:
                        return reply.code(400).send({ status: 400, error: "Bad Request", results: result.error });
                    default:
                        return reply.code(500).send({ status: 500, error: "Internal Server Error", results: result.error || null });
                }
            } catch (err) {
                return reply.code(500).send({ status: 500, error: err?.message || String(err), results: null });
            }
        });

        fastify.post("/api/module/auth/signin", async (req, reply) => {
            try {
                const body = req.body?.body || req.body || {};
                const result = await authService.signin(body);

                switch (result.status) {
                    case 200: {
                        const payload = {
                            sub: result.results.user_id,
                            username: result.results.user_username,
                            role_id: result.results.fk_role_id || null,
                        };
                        // ใช้ method แบบ namespace ที่ถูก: reply.accessJwtSign / reply.refreshJwtSign
                        const accessToken = await reply.accessJwtSign(payload, { expiresIn: "15m" });
                        const refreshToken = await reply.refreshJwtSign(payload, { expiresIn: "7d" });

                        return reply.code(200).send({
                            status: 200,
                            error: null,
                            results: { user: result.results, tokens: { accessToken, refreshToken } },
                        });
                    }
                    case 400:
                        return reply.code(400).send({ status: 400, error: "Bad Request", results: result.error });
                    case 401:
                        return reply.code(401).send({ status: 401, error: "Unauthorized", results: result.error });
                    case 403:
                        return reply.code(403).send({ status: 403, error: "Forbidden", results: result.error });
                    default:
                        return reply.code(500).send({ status: 500, error: "Internal Server Error", results: result.error || null });
                }
            } catch (err) {
                return reply.code(500).send({ status: 500, error: err?.message || String(err), results: null });
            }
        });

        fastify.addHook("preHandler", (request, reply, done) => {
            console.log("Content-Type:", request.headers["content-type"]);
            done();
        });

        fastify.register(product_router, { prefix: "/api/module/product" });

        fastify.all("/*", (req, reply) => {
            return handle(req.raw, reply.raw)
                .then(() => {
                    reply.sent = true;
                })
                .catch((err) => {
                    console.error("Error handling request:", err);
                    reply.code(500).send("Internal Server Error");
                });
        });






















        fastify
            .listen({ port: 7000, host: "0.0.0.0" })
            .then((address) => {
                console.log(`> Ready on ${address}`);
            })
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });