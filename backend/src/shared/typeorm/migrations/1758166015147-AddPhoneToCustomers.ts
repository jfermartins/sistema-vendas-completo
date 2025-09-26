import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhoneToCustomers1651234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        isNullable: true, // ← Deixe como true primeiro
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('customers', 'phone');
  }
}
