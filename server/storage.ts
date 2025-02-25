import {
  type Task, type InsertTask,
  type MediaFile, type InsertMediaFile,
  type Folder, type InsertFolder,
  type Reminder, type InsertReminder
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private mediaFiles: Map<number, MediaFile>;
  private folders: Map<number, Folder>;
  private reminders: Map<number, Reminder>;
  private currentIds: {
    task: number;
    mediaFile: number;
    folder: number;
    reminder: number;
  };

  constructor() {
    this.tasks = new Map();
    this.mediaFiles = new Map();
    this.folders = new Map();
    this.reminders = new Map();
    this.currentIds = {
      task: 1,
      mediaFile: 1,
      folder: 1,
      reminder: 1
    };
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentIds.task++;
    const task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updateData: Partial<InsertTask>): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error("Task not found");
    const updatedTask = { ...task, ...updateData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    this.tasks.delete(id);
  }

  // Media Files
  async getMediaFiles(folderId?: number): Promise<MediaFile[]> {
    const files = Array.from(this.mediaFiles.values());
    return folderId ? files.filter(f => f.folderId === folderId) : files;
  }

  async createMediaFile(insertFile: InsertMediaFile): Promise<MediaFile> {
    const id = this.currentIds.mediaFile++;
    const file = { ...insertFile, id };
    this.mediaFiles.set(id, file);
    return file;
  }

  async deleteMediaFile(id: number): Promise<void> {
    this.mediaFiles.delete(id);
  }

  // Folders
  async getFolders(): Promise<Folder[]> {
    return Array.from(this.folders.values());
  }

  async createFolder(insertFolder: InsertFolder): Promise<Folder> {
    const id = this.currentIds.folder++;
    const folder = { ...insertFolder, id };
    this.folders.set(id, folder);
    return folder;
  }

  async deleteFolder(id: number): Promise<void> {
    this.folders.delete(id);
  }

  // Reminders
  async getReminders(): Promise<Reminder[]> {
    return Array.from(this.reminders.values());
  }

  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = this.currentIds.reminder++;
    const reminder = { ...insertReminder, id };
    this.reminders.set(id, reminder);
    return reminder;
  }

  async updateReminder(id: number, updateData: Partial<InsertReminder>): Promise<Reminder> {
    const reminder = this.reminders.get(id);
    if (!reminder) throw new Error("Reminder not found");
    const updatedReminder = { ...reminder, ...updateData };
    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }
}

export const storage = new MemStorage();
