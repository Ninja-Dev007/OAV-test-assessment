import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ScraperService } from '../scraper/scraper.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private scrapperService: ScraperService,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    if (!createArticleDto.publishedAt) {
      createArticleDto.publishedAt = new Date().toISOString();
    }
    return this.prisma.article.create({ data: createArticleDto });
  }

  findAll() {
    return this.prisma.article.findMany();
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article)
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    return article;
  }

  scrapArticles() {
    this.scrapperService.scrapeArticles().then((data) => {
      this.prisma.article
        .createMany({
          data,
        })
        .then(() => {
          console.log('Articles successfully saved in databse');
        });
    });

    return 'Scraper job running in backgroung';
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article)
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);

    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async remove(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article)
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);

    return this.prisma.article.delete({ where: { id } });
  }
}
