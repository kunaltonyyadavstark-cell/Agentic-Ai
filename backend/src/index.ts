import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config";
import { connectDatabase } from "./config/database";
import exerciseRoutes from "./routes/exercises";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import {
  httpLogger,
  errorLogger,
  logServerStart,
  logDatabaseConnection,
} from "./middleware/logger.middleware";
import logger from "./config/logger.config";
import { generalLimiter } from "./middleware/rateLimiter";
import { applySecurity } from "./middleware/security";
import { validateEnv } from "./config/env.config";
import aiRoutes from "./routes/ai";
import testExecutionRoutes from "./routes/testExecution";
import gamificationRoutes from "./routes/gamification";
import analyticsRoutes from "./routes/analytics";
import seedRoutes from "./routes/seed";

dotenv.config();

try {
  validateEnv();
} catch (error) {
  console.error("Error in environment variables:", error);
  process.exit(1);
}

function createApp(): Express {
  const app = express();
  app.set("trust proxy", true);

  applySecurity(app);
  app.use(httpLogger);
  app.use(generalLimiter);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ✅ FIX H3: Swagger only in development
  if (process.env.NODE_ENV !== 'production') {
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "AgentLogic API Docs",
      }),
    );

    app.get("/api-docs.json", (_req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });
  }

  app.get("/health", (_req, res) => {
    logger.info("Health check solicitado");
    res.json({
      success: true,
      message: "API is working correctly",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/exercises", exerciseRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/test-execution", testExecutionRoutes);
  app.use("/api/gamification", gamificationRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api", seedRoutes);

  app.use(notFoundHandler);
  app.use(errorLogger);
  app.use(errorHandler);

  return app;
}

async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    logDatabaseConnection(true);

    const app = createApp();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT,"0.0.0.0", () => {
      logServerStart(PORT);
      // ✅ FIX H3: Log Swagger only in development
      if (process.env.NODE_ENV !== 'production') {
        logger.info(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
      }
    });
  } catch (error) {
    logDatabaseConnection(false, error as Error);
    logger.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", () => {
  logger.warn("⚠️ Received SIGTERM, shutting down the server...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.warn("⚠️ Received SIGINT, shutting down the server...");
  process.exit(0);
});

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { createApp };