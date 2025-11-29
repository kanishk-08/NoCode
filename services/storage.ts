import { User, Expense, Category } from '../types';

const USERS_KEY = 'trackit_users';
const DATA_PREFIX = 'trackit_data_';

// Default categories for new users
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', budget: 500, color: '#FF6B6B' },
  { id: '2', name: 'Transportation', budget: 300, color: '#4ECDC4' },
  { id: '3', name: 'Utilities', budget: 200, color: '#45B7D1' },
  { id: '4', name: 'Entertainment', budget: 150, color: '#96CEB4' },
  { id: '5', name: 'Shopping', budget: 400, color: '#FFEEAD' },
];

export const storage = {
  // --- User Management ---

  getUsers: (): any[] => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
      return [];
    }
  },

  createUser: (user: User, password?: string) => {
    const users = storage.getUsers();
    if (users.find((u: any) => u.email === user.email)) {
      throw new Error("User with this email already exists");
    }
    
    // Save user (In a real app, passwords should be hashed!)
    users.push({ ...user, password }); 
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Initialize default data for the new user
    const initialData = {
      expenses: [],
      categories: DEFAULT_CATEGORIES
    };
    localStorage.setItem(DATA_PREFIX + user.email, JSON.stringify(initialData));
    
    return user;
  },

  verifyCredentials: (email: string, password?: string): User | null => {
    const users = storage.getUsers();
    const user = users.find((u: any) => u.email === email);
    
    if (!user) return null;
    
    // If password provided (custom auth), check it. 
    // If not provided (simulating Google auth success), skip check.
    if (password && user.password !== password) return null;

    return { name: user.name, email: user.email };
  },

  // --- Data Management ---

  getUserData: (email: string) => {
    const data = localStorage.getItem(DATA_PREFIX + email);
    if (!data) {
        // Fallback if data is missing but user exists
        return { expenses: [], categories: DEFAULT_CATEGORIES };
    }
    return JSON.parse(data);
  },

  saveUserData: (email: string, expenses: Expense[], categories: Category[]) => {
    localStorage.setItem(DATA_PREFIX + email, JSON.stringify({ expenses, categories }));
  }
};
