import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from './Post';
@Entity()
export class Comment {
	@PrimaryGeneratedColumn('increment')
	id: number;
	@Column('varchar', { length: 70 })
	comment: string;
	@ManyToOne(() => Post, (post) => post.comments)
	post: Post;
}
