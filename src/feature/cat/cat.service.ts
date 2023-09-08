import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cat } from './cat.entity';

@Injectable()
export class CatService {
    constructor(
        @InjectRepository(Cat) private readonly catRepo: Repository<Cat>,  // 使用泛型注入对应类型的存储库实例
    ) { }

    /**
     * 创建
     *
     * @param cat Cat 实体对象
     */
    async createCat(cat: Cat): Promise<Cat> {
        /**
         * 创建新的实体实例，并将此对象的所有实体属性复制到新实体中。 请注意，它仅复制实体模型中存在的属性。
         */
        // this.catRepo.create(cat);

        // 插入数据时，删除 id，以避免请求体内传入 id
        delete cat.id;
        return this.catRepo.save(this.catRepo.create(cat));

        /**
         * 将给定实体插入数据库。与save方法不同，执行原始操作时不包括级联，关系和其他操作。
         * 执行快速有效的INSERT操作。不检查数据库中是否存在实体，因此如果插入重复实体，本次操作将失败。
         */
        // await this.catRepo.insert(cat);
    }

    /**
     * 删除
     *
     * @param id ID
     */
    async deleteCat(id: number): Promise<void> {
        await this.findOneById(id);
        this.catRepo.delete(id);
    }

    /**
     * 更新
     *
     * @param cat Cat 实体对象
     */
    async updateCat(id: number, cat: Cat): Promise<void> {
        const existCat = await this.findOneById(id);
        // 当传入空数据时，避免覆盖原数据
        existCat.SectionName = cat && cat.SectionName ? cat.SectionName : existCat.SectionName;
        existCat.RiverName = cat && cat.RiverName ? cat.RiverName : existCat.RiverName;
        existCat.Year = cat && cat.Year ? cat.Year: existCat.Year;
        existCat.Quarter = cat && cat.Quarter ? cat.Quarter : existCat.Quarter;
        existCat.Township = cat && cat.Township ? cat.Township : existCat.Township;
        existCat.AmmoniaNitrogen = cat && cat.AmmoniaNitrogen ? cat.AmmoniaNitrogen : existCat.AmmoniaNitrogen;
        existCat.TotalPhosphorus = cat && cat.TotalPhosphorus ? cat.TotalPhosphorus : existCat.TotalPhosphorus;
        existCat.PermanganateIndex = cat && cat.PermanganateIndex ? cat.PermanganateIndex : existCat.PermanganateIndex;
        existCat.DissolvedOxygen = cat && cat.DissolvedOxygen ? cat.DissolvedOxygen : existCat.DissolvedOxygen;
        existCat.ComplianceStatus  = cat && cat.ComplianceStatus  ? cat.ComplianceStatus  : existCat.ComplianceStatus ;
        this.catRepo.save(existCat);
    }

    /**
     * 根据ID查询
     *
     * @param id ID
     */
    async findOneCat(id: number): Promise<Cat> {
        return this.findOneById(id);
    }

    /**
     * 查询所有
     *
     * 
     */
    async findAllCats(): Promise<Cat[]> {
        const allCats = await this.catRepo.find();
        return allCats;
    }

    /**
     * 多条件查询
     *
     * 
     */
    async findConditionsCats(conditions: Partial<Cat>): Promise<Cat[]> {
        return this.findCatsByConditions(conditions);
    }

    /**
     * 根据ID查询单个信息，如果不存在则抛出404异常
     * @param id ID
     */
    private async findOneById(id: number): Promise<Cat> {
        const catInfo = await this.catRepo.findOne({ where: { id } });
        if (!catInfo) {
            throw new HttpException(`数据不存在`, 404);
        }
        return catInfo;
    }

    /**
     * 多条件查询
     * @param conditions  = {
            Year: 2023, // 以年份为条件
            Township: 'Some Township', // 以镇区为条件
            ComplianceStatus: 'Compliant', // 以达标情况为条件
        };
     */
    private async findCatsByConditions(conditions: Partial<Cat>): Promise<Cat[]> {
        const cats = await this.catRepo.find({
            where: conditions,
        });
        return cats;
    }
}