import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createPool, Pool } from 'mysql2/promise';

import { BaseRepository } from './base.repository';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('Database Module');

        logger.log('Creating database connection pool...');

        const pool = createPool({
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 3306),
          user: configService.get<string>('DB_USERNAME', 'root'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_NAME', 'dinerito'),
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          namedPlaceholders: true,
          dateStrings: true,
        });

        try {
          const connection = await pool.getConnection();
          connection.release();
          logger.log('Database connection established!!');
          return pool;
        } catch (error) {
          logger.error('Unable to connect to database:', error);
          throw error;
        }
      },
    },
    {
      provide: BaseRepository,
      useFactory: (connection: Pool) => new BaseRepository(connection),
      inject: ['DATABASE_CONNECTION'],
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
