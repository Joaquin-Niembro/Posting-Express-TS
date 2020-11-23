import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn} from 'typeorm'
import {Comment} from './Comment'
@Entity()
export class Post{
    @PrimaryGeneratedColumn("increment")
    id: number
    @Column("varchar", {length: 50})
    content: string
    @OneToMany(()=> Comment, comments => comments.post)    
    comments: Comment[]
}