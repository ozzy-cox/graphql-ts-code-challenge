import { Migration } from '@mikro-orm/migrations';

export class Migration20230427202056 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `reaction` (`id` integer not null primary key autoincrement, `created_at` datetime not null, `type` text check (`type` in (\'THUMBSUP\', \'THUMBSDOWN\', \'ROCKET\', \'HEART\')) not null, `post_id` integer not null, constraint `reaction_post_id_foreign` foreign key(`post_id`) references `post`(`id`) on update cascade);');
    this.addSql('create index `reaction_post_id_index` on `reaction` (`post_id`);');

    this.addSql('alter table `post` add column `parent_id` integer null constraint `post_parent_id_foreign` references `post` (`id`) on update cascade on delete set null;');
    this.addSql('create index `post_parent_id_index` on `post` (`parent_id`);');
  }

}
