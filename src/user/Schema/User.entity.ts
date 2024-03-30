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

  @Column({
    nullable: true,
    default:
      'http://res.cloudinary.com/faid-terence/image/upload/v1711803562/aiswa8jcv6rzztbnnly3.jpg',
  })
  profilePhoto: string;

  @Column()
  password: string;

  @Column()
  verificationToken: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpires: Date;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isSubscribed: boolean;
}
