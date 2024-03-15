import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userEmail: string;

  @Column()
  messageSubject: string;

  @Column()
  message: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
