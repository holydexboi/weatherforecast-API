const fastifyPlugin = require("fastify-plugin");

async function dbConnector(fastify, options, next) {
  await fastify.register(require("@fastify/redis"), { host: "127.0.0.1" });
  next()
}

module.exports = fastifyPlugin(dbConnector);
