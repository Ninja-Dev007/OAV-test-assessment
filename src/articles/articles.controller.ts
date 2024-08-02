import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'List of articles' })
  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @ApiOperation({ summary: 'Scrape and save articles in database' })
  @ApiResponse({
    status: 200,
    description: 'The articles have been successfully scraped and saved',
  })
  @Get('scrape')
  scrapArticles() {
    return this.articlesService.scrapArticles();
  }

  @ApiOperation({ summary: 'Get an article by id' })
  @ApiResponse({ status: 200, description: 'Requested Article' })
  @ApiResponse({ status: 404, description: 'Article Not Found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an article by id' })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Article Not Found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @ApiOperation({ summary: 'Delete an article by id' })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Article Not Found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
