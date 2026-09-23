import "dotenv/config";
import express from "express";
import cors from "cors";
import pino from "pino-http";

const app = express();

const PORT = process.env.PORT ?? 3000;

// Middleware для обработки JSON
app.use(express.json());

// CORS
app.use(cors());

// Логирование HTTP-запросов
app.use(
  pino({
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
        messageFormat:
          "{req.method} {req.url} {res.statusCode} - {responseTime}ms",
        hideObject: true,
      },
    },
  }),
);

// GET /notes
app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes",
  });
});

// GET /notes/:noteId
app.get("/notes/:noteId", (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// GET /test-error
app.get("/test-error", () => {
  throw new Error("Simulated server error");
});

// Middleware для неіснуючих маршрутів
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Middleware для обробки помилок
app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd
      ? "Something went wrong. Please try again later."
      : err.message,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
