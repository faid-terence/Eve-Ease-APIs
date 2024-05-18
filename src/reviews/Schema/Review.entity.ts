import User from 'src/user/Schema/User.entity';
import { Entity , PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne} from 'typeorm';

@Entity()

export default class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    review: string;

    @Column()
    rating: number;

    // user who reviewed
    @ManyToOne(() => User, (user) => user.reviews)
    reviewer: User; 

    @Column({default: () => 'CURRENT_TIMESTAMP'})
    reviewDate: Date;

}