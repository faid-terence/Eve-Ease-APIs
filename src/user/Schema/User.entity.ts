import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export default class User {
  [x: string]: any;
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

  @Column()
  password: string;

  @Column()
  verificationToken: string;

  @Column({ default: false })
  isVerified: boolean;
}
