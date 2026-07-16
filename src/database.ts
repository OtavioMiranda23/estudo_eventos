import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dataDirectory = path.resolve(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "orders.db");

fs.mkdirSync(dataDirectory, { recursive: true });

export const db = new Database(databasePath);

// Enable WAL mode and foreign keys
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
`);
