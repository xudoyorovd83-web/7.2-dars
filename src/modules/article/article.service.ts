import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article) private articleRepo: Repository<Article>,
        @InjectRepository(Tag) private tagRepo: Repository<Tag>
    ) { }
    async create(createArticleDto: CreateArticleDto, file: Express.Multer.File, userId) {

        const foundedTeg = await this.tagRepo.findBy({ id: In(createArticleDto.tags) })

        if (!foundedTeg) throw new BadGatewayException()


        const article = this.articleRepo.create({
            ...createArticleDto,
            author: userId,
            tags: foundedTeg
        });

        article.backroundImage = `http://localhost:4001/uploadfile/${file.filename}`
        return await this.articleRepo.save(article)
    }

    async findAll(): Promise<Article[]> {
        return await this.articleRepo.find()
    }

    async findOne(id: number): Promise<Article> {
        const foundedArticle = await this.articleRepo.findOne({
            where: { id },
            relations: ["author","tags"]
        })

        if (!foundedArticle) throw new NotFoundException("not found")
        return foundedArticle
    }



   async update(
  id: number,
  updateArticleDto: UpdateArticleDto,
): Promise<{ message: string }> {
  const article = await this.articleRepo.findOne({
    where: { id },
    relations: ['tags'], // muhim
  });

  if (!article) throw new NotFoundException("not found");

  // oddiy fieldlar
  Object.assign(article, updateArticleDto);

  // 🔥 tags ni map qilish
  if (updateArticleDto.tags) {
    article.tags = updateArticleDto.tags.map((id) => ({ id } as any));
  }

  await this.articleRepo.save(article);

  return { message: "updated" };
}

    async remove(id: number): Promise<{ message: string }> {
        const foundedArticle = await this.articleRepo.findOne({ where: { id } })

        if (!foundedArticle) throw new NotFoundException("not found")
        await this.articleRepo.delete({ id })
        return { message: "deleted" }
    }
}
