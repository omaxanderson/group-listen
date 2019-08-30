import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Party1567131476673 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: "party",
      columns: [
        {
          name: 'party_id',
          type: 'int',
          isPrimary: true,
        },
        {
          name: 'name',
          type: 'varchar',
        },
        {
          name: 'queue_id',
          type: 'varchar',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
