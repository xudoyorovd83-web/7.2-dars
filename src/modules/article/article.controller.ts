import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseInterceptors, UploadedFile, UseGuards, Req, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { ArticleResponseDto } from './dto/article-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer"
import path from "path"
import { CreateArticlFileDto } from './dto/article-file-dto';
import { AuthGuard } from 'src/common/guards/auth-guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles-decorstors';
import { RoleUser } from 'src/shared/enums/roles.enum';
import { QuerryDto } from './dto/querry.dto';

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Imternal  server error" })
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  @ApiOkResponse()
  @ApiBody({ type: CreateArticlFileDto })
  @HttpCode(200)
  @Post()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
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
  create(@Body() createArticleDto: CreateArticleDto, @UploadedFile() file: Express.Multer.File,@Req()req) {
    return this.articleService.create(createArticleDto, file,req.user.id);
  }

  @ApiOkResponse({
    description: "list of articles",
    type: [ArticleResponseDto]
  })
  @HttpCode(200)
  @Get()
  findAll(@Query()QuerryDto:QuerryDto) {
    return this.articleService.findAll(QuerryDto);
  }
  @ApiNotFoundResponse({ description: "Article not found" })
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  @ApiOkResponse({ description: "Updated" })
  @ApiNotFoundResponse({ description: "Article not found" })
  @HttpCode(200)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  @ApiOkResponse({ description: "Deleted" })
  @ApiNotFoundResponse({ description: "Article not found" })
  @HttpCode(200)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
