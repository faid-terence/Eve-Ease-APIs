import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectDataSource } from '@nestjs/typeorm';
import { Connection, DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async deleteAllRelations() {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      const tables = await queryRunner.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema='public'
      `);

      for (const table of tables) {
        const tableName = table.table_name;
        await queryRunner.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
      }

      console.log('All tables deleted successfully');
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteRelations() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Drop views first
      await queryRunner.query(
        'DROP VIEW IF EXISTS "pg_stat_statements_info" CASCADE',
      );

      // Drop tables next
      await queryRunner.query('DROP TABLE IF EXISTS "ticket" CASCADE');
      await queryRunner.query('DROP TABLE IF EXISTS "user" CASCADE');

      // Add any other tables or views you need to drop here
    } catch (error) {
      console.error('Error deleting all relations:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
