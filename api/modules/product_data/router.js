const controller = require('./controller')

module.exports = async function router (fastify, options) {
    fastify.get("/", controller.viwe_all);
    fastify.get("/:id", controller.viwe_by_id);
    fastify.post("/", controller.create);
    fastify.put("/:id", controller.update_by_id);
    fastify.delete("/:id", controller.delete_by_id);

}; 