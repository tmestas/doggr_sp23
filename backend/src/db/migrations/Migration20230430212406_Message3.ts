import { Migration } from '@mikro-orm/migrations';

export class Migration20230430212406 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "messages" drop constraint "messages_sender_id_foreign";');
    this.addSql('alter table "messages" drop constraint "messages_receiver_id_foreign";');

    this.addSql('alter table "messages" add column "sending_user_id" int not null, add column "receiving_user_id" int not null;');
    this.addSql('alter table "messages" add constraint "messages_sending_user_id_foreign" foreign key ("sending_user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "messages" add constraint "messages_receiving_user_id_foreign" foreign key ("receiving_user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "messages" drop column "sender_id";');
    this.addSql('alter table "messages" drop column "receiver_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "messages" drop constraint "messages_sending_user_id_foreign";');
    this.addSql('alter table "messages" drop constraint "messages_receiving_user_id_foreign";');

    this.addSql('alter table "messages" add column "sender_id" int not null, add column "receiver_id" int not null;');
    this.addSql('alter table "messages" add constraint "messages_sender_id_foreign" foreign key ("sender_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "messages" add constraint "messages_receiver_id_foreign" foreign key ("receiver_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "messages" drop column "sending_user_id";');
    this.addSql('alter table "messages" drop column "receiving_user_id";');
  }

}
