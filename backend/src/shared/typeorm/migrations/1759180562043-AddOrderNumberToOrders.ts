import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrderNumberToOrders1759180562043 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'order_number',
        type: 'int',
        isUnique: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'order_number');
  }
}
