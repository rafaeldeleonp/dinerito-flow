// import { Injectable } from '@nestjs/common';
// import { User } from '@dinerito-flow/shared';
// import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
// import { DatabaseService } from '../database/database.service';

// interface UserRow extends User, RowDataPacket {}

// @Injectable()
// export class UsersRepository {
//   constructor(private databaseService: DatabaseService) {}

//   async findById(id: number): Promise<User | null> {
//     const rows = await this.databaseService.query<UserRow[]>('SELECT * FROM users WHERE id = ?', [id]);
//     return rows.length > 0 ? rows[0] : null;
//   }

//   async find(email?: string): Promise<User | null> {
//     const rows = await this.databaseService.query<UserRow[]>('SELECT * FROM users WHERE email = ?', [email]);
//     return rows.length > 0 ? rows[0] : null;
//   }

//   async create(userData: Partial<User>): Promise<User> {
//     const { email, password, firstName, lastName } = userData;

//     const result = await this.databaseService.execute<ResultSetHeader>(
//       'INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?, ?)',
//       [email, password, firstName, lastName]
//     );

//     return {
//       id: result.insertId,
//       ...userData,
//     } as User;
//   }

//   async update(id: number, userData: Partial<User>): Promise<boolean> {
//     const entries = Object.entries(userData);

//     if (entries.length === 0) return false;

//     const fields = entries.map(([key]) => `${key} = ?`).join(', ');
//     const values = entries.map(([_, value]) => value);

//     const result = await this.databaseService.execute<ResultSetHeader>(`UPDATE users SET ${fields} WHERE id = ?`, [
//       ...values,
//       id,
//     ]);

//     return result.affectedRows > 0;
//   }

//   async delete(id: number): Promise<boolean> {
//     const result = await this.databaseService.execute<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);

//     return result.affectedRows > 0;
//   }

//   // Example of a complex query using named parameters
//   async findActiveUsersByRole(role: string, days: number): Promise<User[]> {
//     return this.databaseService.queryWithNamedParams<UserRow[]>(
//       `SELECT * FROM users
//        WHERE role = :role
//        AND lastLogin > DATE_SUB(NOW(), INTERVAL :days DAY)`,
//       { role, days }
//     );
//   }
// }
