import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleImageDto } from './dto/create-article_image.dto';
import { UpdateArticleImageDto } from './dto/update-article_image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleImage } from './entities/article_image.entity';
import { Repository } from 'typeorm';
import { Article } from '../article/entities/article.entity';

@Injectable()
export class ArticleImageService {
  constructor(@InjectRepository(ArticleImage) private articleImageRepo: Repository<ArticleImage>,
  @InjectRepository(Article) private articleRepo: Repository<Article>
) { }


  async create(createArticleImageDto: CreateArticleImageDto, files: Express.Multer.File[]) {

    const foundedArticle = await this.articleRepo .  findOne({where:{id:createArticleImageDto.articleId}})
    if(!foundedArticle)throw new NotFoundException("Aticle not found")
      const foundedImage=await this.articleImageRepo.find({
    where:{article:{id:createArticleImageDto.articleId}}
      })

      if(foundedImage.length+files.length>10)throw new BadRequestException("limit has been exceeded")
    let sortOrder:number=foundedImage.length+1
  let result:any[]=[]
    for(const item of files)
  
  for(const item of files){
  const image=  this.articleImageRepo.create({
      url: `http://localhost:4001/uploadfile/${file.filename}`,
      sortorder:sortOrder,article:{id:createArticleImageDto.articleId}})
    sortOrder++
result.push(await this.articleImageRepo.save(image))
  }
    
        return
  }

  findAll() {
    return `This action returns all articleImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleImage`;
  }

  update(id: number, updateArticleImageDto: UpdateArticleImageDto) {
    return `This action updates a #${id} articleImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleImage`;
  }
}
