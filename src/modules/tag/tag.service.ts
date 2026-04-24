import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepo: Repository<Tag>) { }
  async create(createTagDto: CreateTagDto, user_id:any) {
    const foundedTeg = await this.tagRepo.findOne({ where: { name: CreateTagDto.name } })

    if (foundedTeg) throw new BadRequestException("Tag name already exists ")
    const tag = this.tagRepo.create({...createTagDto,createdBy:user_id})
    return await this.tagRepo.save(tag)
  }

  findAll() {
    return this.tagRepo.find()
  }

  async findOne(id: number) {
    const foundedTeg = await this.tagRepo.findOne({ where: { id } })
    if (!foundedTeg) throw new NotFoundException("Tag not found")
    return foundedTeg
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const foundedTeg = await this.tagRepo.findOne({ where: { id } })
    if (!foundedTeg) throw new NotFoundException("Tag not found")

    await this.tagRepo.update(foundedTeg.id, updateTagDto)
    return { message: "Updated" }
  }

  async remove(id: number) {

    const foundedTeg = await this.tagRepo.findOne({ where: { id } })
    if (!foundedTeg) throw new NotFoundException("Tag not found")

    await this.tagRepo.delete(foundedTeg.id)
    return { message: "Deleted" }
  }
}
