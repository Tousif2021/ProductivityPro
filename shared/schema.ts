import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  priority: text("priority").notNull().default("medium"),
  completed: boolean("completed").notNull().default(false),
});

export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  folderId: integer("folder_id").references(() => folders.id),
});

export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  parentId: integer("parent_id").references(() => folders.id),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id),
  reminderTime: timestamp("reminder_time").notNull(),
  notified: boolean("notified").default(false),
});

// Create a modified schema for task insertion that properly handles dates
export const insertTaskSchema = createInsertSchema(tasks, {
  dueDate: z.string().nullable().transform((val) => val ? new Date(val) : null),
}).omit({ id: true });

export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({ id: true });
export const insertFolderSchema = createInsertSchema(folders).omit({ id: true });
export const insertReminderSchema = createInsertSchema(reminders).omit({ id: true });

export type Task = typeof tasks.$inferSelect;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type Folder = typeof folders.$inferSelect;
export type Reminder = typeof reminders.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type InsertReminder = z.infer<typeof insertReminderSchema>;