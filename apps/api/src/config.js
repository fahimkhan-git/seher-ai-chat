import dotenv from "dotenv";

dotenv.config();

const normalizedPort =
  process.env.API_PORT && process.env.API_PORT.trim()
    ? Number(process.env.API_PORT.trim())
    : 4000;

const isVercel = Boolean(process.env.VERCEL);

// Using file-based storage only
// The config file (apps/api/data/widget-config.json) is committed to git
// and deployed with the API. Updates require committing and pushing to git.

export const config = {
  port: Number.isFinite(normalizedPort) ? normalizedPort : 4000,
  allowedOrigins: ((process.env.ALLOWED_ORIGINS || "*").trim())
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  dataStore: "file",
  widgetConfigApiKey: (process.env.WIDGET_CONFIG_API_KEY && process.env.WIDGET_CONFIG_API_KEY.trim()) || null,
};


