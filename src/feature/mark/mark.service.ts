import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Mark } from './mark.entity';

const fs = require('fs');
const path = require('path');



@Injectable()
export class MarkService {
    constructor(
        @InjectRepository(Mark) private readonly markRepo: Repository<Mark>,  // 使用泛型注入对应类型的存储库实例
    ) { }

    /**
     * 创建
     *
     * @param mark Mark 实体对象
     */
    async createMark(mark: Mark): Promise<Mark> {
        /**
         * 创建新的实体实例，并将此对象的所有实体属性复制到新实体中。 请注意，它仅复制实体模型中存在的属性。
         */
        // this.markRepo.create(mark);

        // 插入数据时，删除 id，以避免请求体内传入 id
        delete mark.id;
        return this.markRepo.save(this.markRepo.create(mark));

        /**
         * 将给定实体插入数据库。与save方法不同，执行原始操作时不包括级联，关系和其他操作。
         * 执行快速有效的INSERT操作。不检查数据库中是否存在实体，因此如果插入重复实体，本次操作将失败。
         */
        // await this.markRepo.insert(mark);
    }

    /**
     * 删除
     *
     * @param id ID
     */
    async deleteMark(id: number): Promise<void> {
        await this.findOneById(id);
        this.markRepo.delete(id);
    }

    /**
     * 更新
     *
     * @param mark Mark 实体对象
     */
    async updateMark(id: number, mark: Mark): Promise<void> {
        const existMark = await this.findOneById(id);
        // 当传入空数据时，避免覆盖原数据
        existMark.SectionName = mark && mark.SectionName ? mark.SectionName : existMark.SectionName;
        existMark.Answer = mark && mark.Answer ? mark.Answer : existMark.Answer;
        existMark.Bol = mark && mark.Bol ? mark.Bol: existMark.Bol;
        existMark.Source = mark && mark.Source ? mark.Source : existMark.Source;
        existMark.Respond = mark && mark.Respond ? mark.Respond : existMark.Respond;
        this.markRepo.save(existMark);
    }

    /**
     * 根据ID查询
     *
     * @param id ID
     */
    async findOneMark(id: number): Promise<Mark> {
        return this.findOneById(id);
    }

    /**
     * 查询所有
     *
     * 
     */
    async findAllMarks(): Promise<Mark[]> {
        const allMarks = await this.markRepo.find();
        return allMarks;
    }

    /**
     * 多条件查询
     *
     * 
     */
    async findConditionsMarks(conditions: Partial<Mark>): Promise<Mark[]> {
        return this.findMarksByConditions(conditions);
    }

    /**
     * 根据ID查询单个信息，如果不存在则抛出404异常
     * @param id ID
     */
    private async findOneById(id: number): Promise<Mark> {
        const markInfo = await this.markRepo.findOne({ where: { id } });
        if (!markInfo) {
            throw new HttpException(`数据不存在`, 404);
        }
        return markInfo;
    }

    /**
     * 多条件查询
     * @param conditions  = {
            Year: 2023, // 以年份为条件
            Township: 'Some Township', // 以镇区为条件
            ComplianceStatus: 'Compliant', // 以达标情况为条件
        };
     */
    private async findMarksByConditions(conditions: Partial<Mark>): Promise<Mark[]> {
        const marks = await this.markRepo.find({
            where: conditions,
        });
        return marks;
    }

    /**
     * @description: 初始化
     * @return {*}
     */
    async createInitMark(): Promise<void> {
        const self = this;
        const directoryPath = path.join(__dirname, '../../../docs');
        fs.readdir(directoryPath, async function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
    
            // 遍历所有文件
            let sections = [];
            let processedFiles = 0; // 用于跟踪已处理的文件数
    
            files.forEach(async function (file) {
                // 检查文件是否是 .md 文件
                if (path.extname(file) === '.md') {
                    console.log(file);
                    // 构建完整的文件路径
                    let filePath = path.join(directoryPath, file);
                    // 读取文件内容
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log(`Content of ${file}:`);
                        // 将文件内容按行分割成数组
                        const lines = data.split('\n');
                        let currentSection = null;
                        // 遍历每一行
                        for (let i = 0; i < lines.length; i++) {
                            if(i < 2){
                                continue;
                            }
                            const line = lines[i].trim(); // 去除行首尾的空格
    
                            if (/^#+/.test(line)) {
                                // 创建一个新的 section 对象，存储标题和正文
                                currentSection = { SectionName: line.replace(/^#+/, '').trim(), Answer: '', Bol:false,Source:file,Respond:''};
                                sections.push(currentSection);
                            } else if (currentSection) {
                                if(line !== ''){
                                    currentSection.Answer = JSON.stringify(line)
                                } 
                            }
                        }
                        
                        // 标记文件处理完成
                        processedFiles++;
    
                        // 当所有文件都处理完毕时执行以下操作
                        if (processedFiles === files.length) {
                            // 在这里可以执行你的操作，例如删除第一个元素和打印数组
                            sections.splice(0, 1);
                            console.log(sections, sections.length);
                            sections.forEach(async (item) => {
                                await self.markRepo.save(self.markRepo.create(item));
                            });
                        }
                    });
                }
            });
        });
    }
    
    
    
}