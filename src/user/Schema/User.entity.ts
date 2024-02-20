import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email']) // Ensures that the email column is unique
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullNames: string;

  @Column()
  email: string;

  @Column()
  country: string;

  @Column()
  phoneNumber: string;

  @Column()
  profilePhoto: string;
}
