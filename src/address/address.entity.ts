import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import User from '../users/user.entity';

@Entity()
class Address {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public street: string;

  @Column()
  public city: string;

  @Column()
  public country: string;

  // Inverse relationship with user
  @OneToOne(() => User, (user: User) => user.address)
  public user: User
}

export default Address;