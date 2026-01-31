import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'users.json');

// Initialize users database if it doesn't exist
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]), 'utf-8');
  }
}

function getUsers() {
  initDB();
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function findUserByEmail(email) {
  const users = getUsers();
  return users.find((u) => u.email === email.toLowerCase());
}

export async function findUserById(id) {
  const users = getUsers();
  return users.find((u) => u.id === id);
}

export async function createUser(email, password, name) {
  const users = getUsers();

  // Check if user already exists
  if (users.find((u) => u.email === email.toLowerCase())) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    password: hashedPassword,
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
