"use strict";
const path = require("path");
require("dotenv").config({ path: path.join("./config", ".env") });
const fastify = require("fastify")({
  logger: true,
});
fastify.register(require("./db-connection"));
fastify.register(require("./controller/weather"));

//fastify.mongo.db.collection().deleteOne()
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
