import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";
import FormData from 'form-data';

dotenv.config();

const router = express.Router();
const STABILITY_API_URL = 'https://api.stability.ai/v2beta/stable-image/generate/core';
const apiKey = process.env.STABILITY_API_KEY;

router.route("/").get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt, output_format = 'webp' } = req.body;

    // Create FormData for the request
    const form = new FormData();
    form.append('prompt', prompt);
    form.append('output_format', output_format);

    const response = await axios.post(
      STABILITY_API_URL,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${apiKey}`,
          Accept: 'image/*' // Specify to receive image
        },
        responseType: 'arraybuffer' // Expect image data in the response
      }
    );

    const base64Image = Buffer.from(response.data).toString("base64");
    res.status(200).json({ photo: base64Image });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error?.response.data.error.message || "Something went wrong");
  }
});

export default router;
