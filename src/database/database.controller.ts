import { Controller, Delete } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Delete('delete-all-relations')
  async deleteAllRelations() {
    await this.databaseService.deleteAllRelations();
    return { message: 'All tables deleted successfully' };
  }
}
