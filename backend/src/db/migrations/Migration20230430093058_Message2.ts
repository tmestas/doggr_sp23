import { Migration } from '@mikro-orm/migrations';

export class Migration20230430093058 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "messages" ("id" serial primary key, "sender_id" int not null, "receiver_id" int not null, "created_at" timestamptz(0) not null);');

    this.addSql('alter table "messages" add constraint "messages_sender_id_foreign" foreign key ("sender_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "messages" add constraint "messages_receiver_id_foreign" foreign key ("receiver_id") references "users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "messages" cascade;');
  }

}
