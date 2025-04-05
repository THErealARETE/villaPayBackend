import { PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseBaseEntity } from '.';

export abstract class DatabaseBaseUUIDEntity extends DatabaseBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
