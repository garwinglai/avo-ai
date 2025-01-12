const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");
require("dotenv").config();
const OpenAI = require("openai");

exports.chatOpenAI = onRequest(async (req, res) => {
  logger.log("Request received:", req.body);
  const openAIKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({
    apiKey: openAIKey,
  });

  const { message, model, response_format } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: message,
      response_format: response_format,
    });

    const response = completion.choices[0].message;
    logger.log("response", response);

    res.status(200).send(response);
  } catch (error) {
    logger.error("Error fetching openAI Response:", error);
    console.error("Error fetching OpenAI response:", error);
    res.status(500).send("Error fetching OpenAI response");
  }
});
