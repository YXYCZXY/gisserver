import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat')
export class Cat {
    /**
     * 自增主键
     */
    @PrimaryGeneratedColumn({
        comment: '自增ID'
    })
    id: number;

    @Column({
        comment: '断面名称'
    })
    SectionName: string;

    @Column({
        comment: '河流名称'
    })
    RiverName: string;

    @Column({
        comment: '年份'
    })
    Year: string;

    @Column({
        comment: '季度'
    })
    Quarter: string;

    @Column({
        comment: '镇区'
    })
    Township: string;

    @Column({
        comment: '氨氮(mg/l)'
    })
    AmmoniaNitrogen: string;

    @Column({
        comment: '总磷(mg/l)'
    })
    TotalPhosphorus: string;

    @Column({
        comment: '高锰酸盐(mg/l)'
    })
    PermanganateIndex: string;

    @Column({
        comment: '溶解氧(mg/l)'
    })
    DissolvedOxygen: string;

    @Column({
        comment: '达标情况'
    })
    ComplianceStatus : string;


}