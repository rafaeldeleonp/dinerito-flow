import { Injectable, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { Pool, ResultSetHeader, PoolConnection, QueryResult } from 'mysql2/promise';
import { BaseRepository } from './base.repository';

@Injectable()
export class DatabaseService<T> implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @Inject(BaseRepository) private repository: BaseRepository<T>,
    @Inject('DATABASE_CONNECTION') private connection: Pool
  ) {}

  async onModuleDestroy() {
    this.logger.log('Database service being destroyed');
  }

  async query(sql: string, params?: any[]): Promise<T[] | ResultSetHeader> {
    const rows = await this.repository.query(sql, params);
    return rows;
  }

  async execute(sql: string, params?: any[]): Promise<QueryResult> {
    const [result] = await this.connection.execute(sql, params);
    return result;
  }

  async transaction(callback: (connection: PoolConnection) => Promise<T>): Promise<T> {
    return this.repository.transaction(callback);
  }

  async findOne(table: string, conditions: Record<string, any>): Promise<T | null> {
    return this.repository.findOne(table, conditions);
  }

  async findAll(table: string, conditions?: Record<string, any>): Promise<T[]> {
    return this.repository.findAll(table, conditions);
  }

  async findById(table: string, id: number): Promise<T | null> {
    return this.repository.findById(table, id);
  }

  async create(table: string, data: Partial<T>): Promise<T> {
    return this.repository.create(table, data);
  }

  async update(table: string, id: number, data: Partial<T>): Promise<boolean> {
    return this.repository.update(table, id, data);
  }

  async delete(table: string, id: number): Promise<boolean> {
    return this.repository.delete(table, id);
  }
}
