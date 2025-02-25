import {
  type Task, type InsertTask,
  type MediaFile, type InsertMediaFile,
  type Folder, type InsertFolder,
  type Reminder, type InsertReminder,
  tasks, mediaFiles, folders, reminders
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  // Media Files
  getMediaFiles(folderId?: number): Promise<MediaFile[]>;
  createMediaFile(file: InsertMediaFile): Promise<MediaFile>;
  deleteMediaFile(id: number): Promise<void>;

  // Folders
  getFolders(): Promise<Folder[]>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  deleteFolder(id: number): Promise<void>;

  // Reminders
  getReminders(): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder>;
}

export class DatabaseStorage implements IStorage {
  // Tasks
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await db.insert(tasks).values(task).returning();
    return created;
  }

  async updateTask(id: number, updateData: Partial<InsertTask>): Promise<Task> {
    const [updated] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    if (!updated) throw new Error("Task not found");
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Media Files
  async getMediaFiles(folderId?: number): Promise<MediaFile[]> {
    if (folderId) {
      return await db
        .select()
        .from(mediaFiles)
        .where(eq(mediaFiles.folderId, folderId));
    }
    return await db.select().from(mediaFiles);
  }

  async createMediaFile(file: InsertMediaFile): Promise<MediaFile> {
    const [created] = await db.insert(mediaFiles).values(file).returning();
    return created;
  }

  async deleteMediaFile(id: number): Promise<void> {
    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
  }

  // Folders
  async getFolders(): Promise<Folder[]> {
    return await db.select().from(folders);
  }

  async createFolder(folder: InsertFolder): Promise<Folder> {
    const [created] = await db.insert(folders).values(folder).returning();
    return created;
  }

  async deleteFolder(id: number): Promise<void> {
    await db.delete(folders).where(eq(folders.id, id));
  }

  // Reminders
  async getReminders(): Promise<Reminder[]> {
    return await db.select().from(reminders);
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const [created] = await db.insert(reminders).values(reminder).returning();
    return created;
  }

  async updateReminder(id: number, updateData: Partial<InsertReminder>): Promise<Reminder> {
    const [updated] = await db
      .update(reminders)
      .set(updateData)
      .where(eq(reminders.id, id))
      .returning();
    if (!updated) throw new Error("Reminder not found");
    return updated;
  }
}

export const storage = new DatabaseStorage();