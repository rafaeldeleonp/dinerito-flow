export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Optional for login
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
