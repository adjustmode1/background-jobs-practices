import { Column, Entity, PrimaryColumn } from 'typeorm';
import { FileStatusEnum } from '../enums/file.enum';

@Entity('files')
export class FileEntity {
  @PrimaryColumn({
    type: 'varchar',
  })
  id: string;

  @Column()
  name: string;

  @Column()
  fileType: string;

  @Column()
  fileSize: number;

  @Column()
  checksum: string;

  @Column({
    type: 'enum',
    enum: FileStatusEnum,
  })
  status: FileStatusEnum;

  @Column()
  folder: string;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  createdAt = new Date();

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  updatedAt = new Date();

  @Column({
    type: 'varchar',
    nullable: true,
  })
  deletedAt?: string;

  @Column({
    type: 'varchar',
  })
  createdBy: string;
}
