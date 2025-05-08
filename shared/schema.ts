import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Games table for storing game data
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  embedUrl: text("embed_url").notNull(),
  likes: integer("likes").default(0).notNull(),
  dislikes: integer("dislikes").default(0).notNull(),
  size: text("size").default("medium"),
  tag: text("tag"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  title: true,
  category: true,
  imageUrl: true,
  embedUrl: true,
  size: true,
  tag: true,
});

export const updateGameStatsSchema = createInsertSchema(games).pick({
  likes: true,
  dislikes: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
export type UpdateGameStats = z.infer<typeof updateGameStatsSchema>;

// Categories
export const GAME_CATEGORIES = [
  "action",
  "adventure",
  "puzzle",
  "strategy",
  "racing",
  "sports"
] as const;

export type GameCategory = typeof GAME_CATEGORIES[number];
