import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertFolderSchema, insertMediaFileSchema, insertReminderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Tasks
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const task = insertTaskSchema.parse(req.body);
    const created = await storage.createTask(task);
    res.json(created);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const task = insertTaskSchema.partial().parse(req.body);
    const updated = await storage.updateTask(id, task);
    res.json(updated);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTask(id);
    res.sendStatus(204);
  });

  // Media Files
  app.get("/api/media", async (req, res) => {
    const folderId = req.query.folderId ? parseInt(req.query.folderId as string) : undefined;
    const files = await storage.getMediaFiles(folderId);
    res.json(files);
  });

  app.post("/api/media", async (req, res) => {
    const file = insertMediaFileSchema.parse(req.body);
    const created = await storage.createMediaFile(file);
    res.json(created);
  });

  app.delete("/api/media/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteMediaFile(id);
    res.sendStatus(204);
  });

  // Folders
  app.get("/api/folders", async (_req, res) => {
    const folders = await storage.getFolders();
    res.json(folders);
  });

  app.post("/api/folders", async (req, res) => {
    const folder = insertFolderSchema.parse(req.body);
    const created = await storage.createFolder(folder);
    res.json(created);
  });

  app.delete("/api/folders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteFolder(id);
    res.sendStatus(204);
  });

  // Reminders
  app.get("/api/reminders", async (_req, res) => {
    const reminders = await storage.getReminders();
    res.json(reminders);
  });

  app.post("/api/reminders", async (req, res) => {
    const reminder = insertReminderSchema.parse(req.body);
    const created = await storage.createReminder(reminder);
    res.json(created);
  });

  app.patch("/api/reminders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const reminder = insertReminderSchema.partial().parse(req.body);
    const updated = await storage.updateReminder(id, reminder);
    res.json(updated);
  });

  const httpServer = createServer(app);
  return httpServer;
}
