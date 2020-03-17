import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'

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
}

export default Post;
