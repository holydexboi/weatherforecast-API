const axios = require("axios");
require("dotenv").config({ path: "./config/env" });

async function routes(fastify, options) {
  const redis = fastify.redis;

  fastify.get("/weather/forecast/bylocation", async (request, reply) => {
    const { location, start_date, end_date } = request.query;
    if (!location) {
      return reply.code(400).send("Please provide location");
    }
    const redisQuery = await redis.get(location, (err, val) => {
      return err || val;
    });

    if (redisQuery !== null) return JSON.parse(redisQuery);
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}${
        start_date ? "/" + start_date : ""
      }${end_date ? "/" + end_date : ""}?key=${process.env.APIKEY}`
    );
    console.log("reach");
    await redis.set(location, JSON.stringify(response.data), (err) => {
      if (err) reply.send(err);
    });
    return response.data;
  });

  fastify.get("/weather/forecast/bycoordinate", async (request, reply) => {
    const { latitude, longitude } = request.query;
    if (!latitude) {
      return reply.code(400).send("Please provide latitude");
    }
    if (!longitude) {
      return reply.code(400).send("Please provide longitude");
    }
    const redisQuery = await redis.get(
      `${latitude} ${longitude}`,
      (err, val) => {
        return err || val;
      }
    );

    if (redisQuery !== null) return JSON.parse(redisQuery);
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?key=${process.env.APIKEY}`
    );

    await redis.set(
      `${latitude} ${longitude}`,
      JSON.stringify(response.data),
      (err) => {
        if (err) reply.send(err);
      }
    );
    return response.data;
  });
}

module.exports = routes;
