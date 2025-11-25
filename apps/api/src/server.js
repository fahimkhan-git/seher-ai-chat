import cors from "cors";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import { config } from "./config.js";
import leadsRouter from "./routes/leads.js";
import widgetConfigRouter from "./routes/widgetConfig.js";
import eventsRouter from "./routes/events.js";
import chatSessionsRouter from "./routes/chatSessions.js";
import chatRouter from "./routes/chat.js";

function expandAllowedOrigins(origins) {
  const expanded = new Set(origins);

  origins.forEach((origin) => {
    try {
      const url = new URL(origin);

      if (!url.protocol || !url.hostname) {
        return;
      }

      const portSegment = url.port ? `:${url.port}` : "";

      if (url.hostname === "localhost") {
        expanded.add(`${url.protocol}//127.0.0.1${portSegment}`);
      }

      if (url.hostname === "127.0.0.1") {
        expanded.add(`${url.protocol}//localhost${portSegment}`);
      }
    } catch {
      // Ignore entries that are not valid URLs (e.g. "null")
    }
  });

  return Array.from(expanded);
}

async function bootstrap() {
  if (config.dataStore === "mongo") {
    await mongoose.connect(config.mongoUri);
  } else {
    console.log("Using local JSON datastore. Mongo connection skipped.");
  }

  const app = express();
  const expandedOrigins = config.allowedOrigins.includes("*")
    ? ["*"]
    : expandAllowedOrigins(config.allowedOrigins);
  const socketOrigin = expandedOrigins.includes("*") ? "*" : expandedOrigins;

  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: {
      origin: socketOrigin,
    },
  });

  app.use(express.json());
  const corsOptions = expandedOrigins.includes("*")
    ? {
        origin: (_origin, callback) => {
          callback(null, true);
        },
        credentials: true,
      }
    : {
        origin: expandedOrigins,
        credentials: true,
      };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  app.get("/", (_req, res) => {
    res.json({
      status: "ok",
      message:
        "Homesfy API is running. See /health for a simple check or /api/widget-config/:projectId for widget config.",
    });
  });

  app.get("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => {
    res.type("application/json").send("{}");
  });

  io.on("connection", (socket) => {
    const { microsite } = socket.handshake.query;
    if (microsite) {
      socket.join(microsite);
    }
  });

  app.get("/health", async (_req, res) => {
    const aiAvailable = process.env.GEMINI_API_KEY && 
                         process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here' && 
                         process.env.GEMINI_API_KEY.trim();
    res.json({ 
      status: "ok",
      ai: {
        available: !!aiAvailable,
        model: aiAvailable ? "gemini-2.5-flash" : null,
        mode: aiAvailable ? "full-ai" : "fallback-keyword-matching"
      }
    });
  });

  app.use("/api/leads", leadsRouter);
  app.use("/api/widget-config", widgetConfigRouter);
  app.use("/api/events", eventsRouter);
  app.use("/api/chat-sessions", chatSessionsRouter);
  app.use("/api/chat", chatRouter);

  // Check Gemini AI availability on startup
  const checkAIAvailability = async () => {
    try {
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here' && process.env.GEMINI_API_KEY.trim()) {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log("✅ Gemini AI (gemini-2.5-flash) is configured and available");
        console.log("   Chat API will use full AI capabilities with intent understanding");
      } else {
        console.warn("⚠️  GEMINI_API_KEY not set - Chat API will use fallback keyword matching");
        console.warn("   To enable full AI: Set GEMINI_API_KEY in .env (get key from https://makersuite.google.com/app/apikey)");
      }
    } catch (error) {
      console.warn("⚠️  Could not verify Gemini AI availability:", error.message);
    }
  };
  
  checkAIAvailability();

  server.listen(config.port, () => {
    console.log(`API server listening on port ${config.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start API server", error);
  process.exit(1);
});

