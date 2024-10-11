import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTrackingEntity1728547538182 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE tracking (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                userId UUID NOT NULL,
                vehicleId VARCHAR NOT NULL,
                latitude DOUBLE PRECISION NOT NULL,
                longitude DOUBLE PRECISION NOT NULL,
                timestamp TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE tracking;`);
    }

}
