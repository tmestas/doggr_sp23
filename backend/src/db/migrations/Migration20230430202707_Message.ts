import { Migration } from '@mikro-orm/migrations';

export class Migration20230430202707 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "messages" add column "message" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "messages" drop column "message";');
  }

}
