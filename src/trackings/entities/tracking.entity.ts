import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'trackings' })
export class PgTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  vehicleId: number;

  @Column({ type: 'varchar' })
  latitude: string;

  @Column({ type: 'varchar' })
  longitude: string;

  @Column()
  timestamp: Date;

  @Column({ default: 'ongoing' })
  status: string;

  @Column({ type: 'varchar' })
  fromDestination: string;

  @Column({ type: 'varchar' })
  toDestination: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
