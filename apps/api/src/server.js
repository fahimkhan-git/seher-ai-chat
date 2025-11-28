import cors from "cors";
import express from "express";
import http from "http";
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
  // Using file-based storage only
  console.log("📁 Using file-based storage (widget-config.json from git)");

  const app = express();
  const expandedOrigins = config.allowedOrigins.includes("*")
    ? ["*"]
    : expandAllowedOrigins(config.allowedOrigins);
  const socketOrigin = expandedOrigins.includes("*") ? "*" : expandedOrigins;

  // Only create Socket.IO server for non-serverless environments
  let server = null;
  let io = null;
  
  if (!process.env.VERCEL) {
    server = http.createServer(app);
    io = new SocketIOServer(server, {
      cors: {
        origin: socketOrigin,
      },
    });
  }

  app.use(express.json());
  const corsOptions = expandedOrigins.includes("*")
    ? {
        origin: (_origin, callback) => {
          callback(null, true);
        },
        credentials: false, // Must be false when using wildcard origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      }
    : {
        origin: expandedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      };

  // Handle OPTIONS preflight requests FIRST - before CORS middleware
  app.options("*", (req, res) => {
    const origin = req.headers.origin;
    if (expandedOrigins.includes("*")) {
      res.header('Access-Control-Allow-Origin', '*');
    } else if (origin && expandedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-API-Key');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    res.status(200).end();
  });

  app.use(cors(corsOptions));
  
  // Additional CORS headers for all responses
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    // If using wildcard, don't set credentials (browser doesn't allow both)
    if (expandedOrigins.includes("*")) {
      res.header('Access-Control-Allow-Origin', '*');
      // CRITICAL: Never set Access-Control-Allow-Credentials when using wildcard
      // This causes CORS errors in browsers
    } else {
      // Use specific origin and allow credentials
      if (origin && expandedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
      } else {
        res.header('Access-Control-Allow-Origin', '*');
      }
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-API-Key');
    next();
  });

  app.use((req, res, next) => {
    if (io) {
      req.io = io;
    }
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

  // Socket.IO only works in non-serverless environments
  if (io) {
    io.on("connection", (socket) => {
      const { microsite } = socket.handshake.query;
      if (microsite) {
        socket.join(microsite);
      }
    });
  }

  app.get("/health", async (_req, res) => {
    res.json({ 
      status: "ok",
      mode: "keyword-matching"
    });
  });

  app.use("/api/leads", leadsRouter);
  app.use("/api/widget-config", widgetConfigRouter);
  app.use("/api/events", eventsRouter);
  app.use("/api/chat-sessions", chatSessionsRouter);
  app.use("/api/chat", chatRouter);

  console.log("✅ Chat API using keyword matching for responses");

  // Handle favicon requests
  app.get("/favicon.ico", (_req, res) => {
    res.status(204).end();
  });

  // Error handling middleware - MUST set CORS headers before sending response
  app.use((err, req, res, next) => {
    console.error("Error:", err);
    
    // Set CORS headers even for errors
    const origin = req.headers.origin;
    if (expandedOrigins.includes("*")) {
      res.header('Access-Control-Allow-Origin', '*');
    } else if (origin && expandedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-API-Key');
    
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
      status: "error"
    });
  });

  // 404 handler - MUST set CORS headers
  app.use((req, res) => {
    // Set CORS headers even for 404
    const origin = req.headers.origin;
    if (expandedOrigins.includes("*")) {
      res.header('Access-Control-Allow-Origin', '*');
    } else if (origin && expandedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-API-Key');
    
    res.status(404).json({
      error: "Not Found",
      status: "error",
      path: req.path
    });
  });

  // For Vercel serverless, export the app
  if (process.env.VERCEL) {
    return app;
  }

  // For local development, start the server
  if (server) {
    server.listen(config.port, () => {
      console.log(`API server listening on port ${config.port}`);
    });
  }
  
  return app;
}

// For local development
if (!process.env.VERCEL) {
  bootstrap().catch((error) => {
    console.error("Failed to start API server", error);
    process.exit(1);
  });
}

// Export bootstrap function for Vercel serverless
export default bootstrap;

