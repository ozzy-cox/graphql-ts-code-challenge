import { Migration } from '@mikro-orm/migrations';

export class Migration20230415182015 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `post` (`id` integer not null primary key autoincrement, `created_at` datetime not null, `content` text not null, unique (`id`));');
  }

}
