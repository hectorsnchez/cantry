import { games, type Game, type InsertGame, users, type User, type InsertUser } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game operations
  getAllGames(): Promise<Game[]>;
  getGameById(id: number): Promise<Game | undefined>;
  getGamesByCategory(category: string): Promise<Game[]>;
  searchGames(term: string): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<Game>): Promise<Game | undefined>;
  deleteGame(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private userCurrentId: number;
  private gameCurrentId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.userCurrentId = 1;
    this.gameCurrentId = 1;
    
    // Add admin user
    this.createUser({
      username: "admin",
      password: "2729" // Admin password as specified
    });
    
    // Add initial games
    this.addInitialGames();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Game methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getGameById(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async getGamesByCategory(category: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.category === category);
  }
  
  async searchGames(term: string): Promise<Game[]> {
    const searchTerm = term.toLowerCase();
    return Array.from(this.games.values()).filter(game => 
      game.title.toLowerCase().includes(searchTerm)
    );
  }
  
  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.gameCurrentId++;
    const game: Game = { 
      ...insertGame, 
      id, 
      likes: 0, 
      dislikes: 0 
    };
    this.games.set(id, game);
    return game;
  }
  
  async updateGame(id: number, partialGame: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame = { ...game, ...partialGame };
    this.games.set(id, updatedGame);
    return updatedGame;
  }
  
  async deleteGame(id: number): Promise<boolean> {
    return this.games.delete(id);
  }
  
  // Helper to add initial games
  private addInitialGames() {
    const initialGames: InsertGame[] = [
      {
        title: "Space Adventure",
        category: "action",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        embedUrl: "https://www.addictinggames.com/embed/html5-games/23635",
      },
      {
        title: "Puzzle Master",
        category: "puzzle",
        imageUrl: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        embedUrl: "https://www.addictinggames.com/embed/html5-games/24825",
      },
      {
        title: "Turbo Racer",
        category: "racing",
        imageUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        embedUrl: "https://www.addictinggames.com/embed/html5-games/25632",
      },
      {
        title: "Fantasy Quest",
        category: "adventure",
        imageUrl: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        embedUrl: "https://www.addictinggames.com/embed/html5-games/25203",
      },
      {
        title: "Battle Tactics",
        category: "strategy",
        imageUrl: "https://images.unsplash.com/photo-1522069213448-443a614da9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        embedUrl: "https://www.addictinggames.com/embed/html5-games/24030",
      },
      {
        title: "Pro Soccer",
        category: "sports",
        imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        embedUrl: "https://www.addictinggames.com/embed/html5-games/24356",
      },
      {
        title: "Combat Zone",
        category: "action",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        embedUrl: "https://www.addictinggames.com/embed/html5-games/24350",
      },
      {
        title: "Block Blast",
        category: "puzzle",
        imageUrl: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        embedUrl: "https://www.addictinggames.com/embed/html5-games/24674",
      }
    ];
    
    initialGames.forEach(game => this.createGame(game));
  }
}

export const storage = new MemStorage();
