import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mark')
export class Mark {
    /**
     * 自增主键
     */
    @PrimaryGeneratedColumn({
        comment: '自增ID'
    })
    id: number;

    @Column({
        comment: '名称'
    })
    SectionName: string;

    @Column({
        comment: '答案'
    })
    Answer: string;

    @Column({
        comment: '是否正确'
    })
    Bol: boolean;

    @Column({
        comment: '来源'
    })
    Source: string;

    @Column({
        comment: '回答'
    })
    Respond: string;
}