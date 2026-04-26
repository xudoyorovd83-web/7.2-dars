import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ArticleImageService } from './article_image.service';
import { CreateArticleImageDto } from './dto/create-article_image.dto';
import { UpdateArticleImageDto } from './dto/update-article_image.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { RoleUser } from 'src/shared/enums/roles.enum';
import { AuthGuard } from 'src/common/guards/auth-guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles-decorstors';
import { diskStorage } from 'multer';
import path from 'path';
import { CreateImageDto } from './dto/create_image.dto';
import { FilesInterceptor } from '@nestjs/platform-express';


@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Imternal  server error" })
@Controller('article-image')
export class ArticleImageController {
  constructor(private readonly articleImageService: ArticleImageService) { }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  @ApiOkResponse()
  @ApiBody({ type: CreateImageDto })
  @HttpCode(200)
  @Post()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FilesInterceptor("file", 10, {
      storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const uniqueSuffix = `${file.originalname}${Date.now()}`
          const ext = path.extname(file.originalname)
          cb(null, `${uniqueSuffix}${ext}`)
        }
      })
    })
  )

  create(@Body() createArticleImageDto: CreateArticleImageDto,
   @UploadedFiles() files: Express.Multer.File[]) {
    return this.articleImageService.create(createArticleImageDto, files);
  }

  @Get()
  findAll() {
    return this.articleImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleImageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleImageDto: UpdateArticleImageDto) {
    return this.articleImageService.update(+id, updateArticleImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleImageService.remove(+id);
  }
}
