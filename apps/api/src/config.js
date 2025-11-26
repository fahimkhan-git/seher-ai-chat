import dotenv from "dotenv";

dotenv.config();

const normalizedPort =
  process.env.API_PORT && process.env.API_PORT.trim()
    ? Number(process.env.API_PORT.trim())
    : 4000;

const isVercel = Boolean(process.env.VERCEL);

const resolvedDataStore = (() => {
  const raw = process.env.DATA_STORE;
  if (raw) {
    // Trim whitespace and newlines, then convert to lowercase
    const cleaned = raw.trim().toLowerCase();
    if (cleaned) {
      return cleaned;
    }
  }
  // Always use file storage - config file is committed to git and deployed with API
  // This is simpler and more secure than MongoDB for just widget config
  return "file";
})();

// MongoDB is no longer used - we use file-based storage for widget config
// The config file (apps/api/data/widget-config.json) is committed to git
// and deployed with the API. Updates require committing and pushing to git.

export const config = {
  port: Number.isFinite(normalizedPort) ? normalizedPort : 4000,
  mongoUri:
    (process.env.MONGO_URI && process.env.MONGO_URI.trim()) ||
    "mongodb://localhost:27017/homesfy_chat",
  allowedOrigins: ((process.env.ALLOWED_ORIGINS || "*").trim())
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  dataStore: resolvedDataStore,
  widgetConfigApiKey: (process.env.WIDGET_CONFIG_API_KEY && process.env.WIDGET_CONFIG_API_KEY.trim()) || null,
};


