import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dreamAIRoutes from './routes/dreamAIRoutes.js';

dotenv.config();

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "https://dream-ai-nine.vercel.app"],
  methods: ["GET", "POST"]
}

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dreamAI', dreamAIRoutes);

app.get("/", async (req, res) => {
  res.send("Hello there");
});

const startServer = async () => {

  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () =>
      console.log("Server has started on port http://localhost:8080")
    );
  } catch (error) {
    console.log(error);
  }

};

startServer();