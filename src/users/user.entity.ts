import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import Address from '../address/address.entity';
import Post from '../posts/post.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  // One-To-One relatioship with Address
  // cascade: true Typeorm will User object containing nested address data (save rows in 2 distinct table)
  @OneToOne(() => Address, (address: Address) => address.user, {
    cascade: true,
    eager: true
  })
  @JoinColumn()
  public address: Address;


  // OneToMany can’t exist without ManyToOne
  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];

}

export default User;