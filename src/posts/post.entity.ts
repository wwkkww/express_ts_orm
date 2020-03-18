import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert, ManyToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'
import User from '../users/user.entity';

@Entity()
class Post {

  // @PrimaryGeneratedColumn()
  @PrimaryColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }

  // OneToMany can’t exist without ManyToOne
  @ManyToOne(() => User, (author: User) => author.posts, {
    eager: true
  })
  public author: User;

}

export default Post;
