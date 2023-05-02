import { Migration } from '@mikro-orm/migrations';

export class Migration20230502040633 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "messages" drop constraint "messages_sending_user_id_foreign";');
    this.addSql('alter table "messages" drop constraint "messages_receiving_user_id_foreign";');

    this.addSql('alter table "messages" add constraint "messages_sending_user_id_foreign" foreign key ("sending_user_id") references "users" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "messages" add constraint "messages_receiving_user_id_foreign" foreign key ("receiving_user_id") references "users" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "messages" drop constraint "messages_sending_user_id_foreign";');
    this.addSql('alter table "messages" drop constraint "messages_receiving_user_id_foreign";');

    this.addSql('alter table "messages" add constraint "messages_sending_user_id_foreign" foreign key ("sending_user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "messages" add constraint "messages_receiving_user_id_foreign" foreign key ("receiving_user_id") references "users" ("id") on update cascade;');
  }

}
