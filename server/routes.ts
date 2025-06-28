import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since we're using Google Apps Script as the backend API,
  // we don't need to implement server routes here.
  // All API calls will be made directly to the Google Apps Script endpoint
  // from the frontend.

  // If we needed server-side proxy routes, we could implement them here
  // to handle CORS or add additional security layers

  const httpServer = createServer(app);

  return httpServer;
}
