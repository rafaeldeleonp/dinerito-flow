import { Injectable } from '@nestjs/common';
import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

@Injectable()
export class BaseRepository<T> {
  constructor(private connection: Pool) {}

  async query(sql: string, params?: any[]): Promise<T[] | ResultSetHeader> {
    try {
      const [rows] = await this.connection.query<RowDataPacket[] | ResultSetHeader>(sql, params);

      return rows && 'affectedRows' in rows ? rows : (rows as T[]);
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }

  async findAll(table: string, conditions?: Record<string, any>): Promise<T[]> {
    let sql = `SELECT * FROM ${table}`;
    const params: any[] = [];

    // Add WHERE clause if conditions exist
    if (conditions && Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .filter((key) => conditions[key] !== undefined)
        .map((key) => `${key} = ?`)
        .join(' AND ');

      if (whereClause) {
        sql += ` WHERE ${whereClause}`;
        Object.keys(conditions)
          .filter((key) => conditions[key] !== undefined)
          .forEach((key) => params.push(conditions[key]));
      }
    }

    const [rows] = await this.connection.query<RowDataPacket[]>(sql, params);
    return rows as T[];
  }

  async findById(table: string, id: number): Promise<T | null> {
    const results = await this.connection.query<RowDataPacket[]>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return results.length > 0 ? (results[0] as T) : null;
  }

  async findOne(table: string, conditions: Record<string, any>): Promise<T | null> {
    const keys = Object.keys(conditions);
    const where = keys.map((key) => `${key} = ?`).join(' AND ');
    const values = Object.values(conditions);

    const [results] = await this.connection.query<RowDataPacket[]>(
      `SELECT * FROM ${table} WHERE ${where} LIMIT 1`,
      values
    );
    return results.length > 0 ? (results[0] as T) : null;
  }

  async create(table: string, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const [result] = await this.connection.query<ResultSetHeader>(
      `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`,
      values
    );

    return { id: result.insertId, ...data } as T;
  }

  async update(table: string, id: number, data: Partial<T>): Promise<boolean> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');

    const [result] = await this.connection.query<ResultSetHeader>(`UPDATE ${table} SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ]);

    return result.affectedRows > 0;
  }

  async delete(table: string, id: number): Promise<boolean> {
    const [result] = await this.connection.query<ResultSetHeader>(`DELETE FROM ${table} WHERE id = ?`, [id]);

    return result.affectedRows > 0;
  }

  // For transaction support
  async transaction<R>(callback: (connection: any) => Promise<R>): Promise<R> {
    const connection = await this.connection.getConnection();
    await connection.beginTransaction();

    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
