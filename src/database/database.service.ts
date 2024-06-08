import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

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
}
