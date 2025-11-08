import dotenv from "dotenv";

dotenv.config();

const normalizedPort =
  process.env.API_PORT && process.env.API_PORT.trim()
    ? Number(process.env.API_PORT.trim())
    : 4000;

export const config = {
  port: Number.isFinite(normalizedPort) ? normalizedPort : 4000,
  mongoUri:
    (process.env.MONGO_URI && process.env.MONGO_URI.trim()) ||
    "mongodb://localhost:27017/homesfy_chat",
  allowedOrigins: ((process.env.ALLOWED_ORIGINS || "*").trim())
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  dataStore:
    (process.env.DATA_STORE && process.env.DATA_STORE.trim().toLowerCase()) ||
    "file",
};


