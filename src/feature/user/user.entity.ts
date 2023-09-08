import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from '../post/post.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    account: string;

    @Column()
    password: string;

    @Column()
    name: string;

    //这是一个 TypeORM 中的装饰器 @OneToMany，用于在用户实体中定义一个与帖子实体之间的一对多关系。
    //这表示一个用户可以拥有多篇帖子。
    @OneToMany(type => Post, post => post.user)
    posts: Post[];

    @Column({
        default: 'regular'
    })
    role: string;
}