import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../app.module';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesService } from './articles.service';
import { ScraperService } from '../scraper/scraper.service';

describe('ArticlesController (e2e)', () => {
  let app: INestApplication;
  let articlesService: ArticlesService;
  let scraperService: ScraperService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    articlesService = moduleFixture.get<ArticlesService>(ArticlesService);
    scraperService = moduleFixture.get<ScraperService>(ScraperService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /articles', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        content: 'Test content of the article.',
        publishedAt: new Date().toISOString(),
        imgSrc: 'https://example.com/image.jpg',
      };

      return request(app.getHttpServer())
        .post('/articles')
        .send(createArticleDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.title).toBe(createArticleDto.title);
          expect(res.body.content).toBe(createArticleDto.content);
          expect(res.body.publishedAt).toBe(createArticleDto.publishedAt);
          expect(res.body.imgSrc).toBe(createArticleDto.imgSrc);
        });
    });

    it('should return 400 for invalid data', async () => {
      const createArticleDto = {
        title: '',
        content: 'Test content of the article.',
      };

      return request(app.getHttpServer())
        .post('/articles')
        .send(createArticleDto)
        .expect(400);
    });
  });

  describe('GET /articles', () => {
    it('should return an array of articles', async () => {
      return request(app.getHttpServer())
        .get('/articles')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /articles/scrape', () => {
    it('should scrape and save articles', async () => {
      jest.spyOn(scraperService, 'scrapeArticles').mockResolvedValue([
        {
          title: 'Scraped Article',
          content: 'Scraped content',
          publishedAt: new Date().toISOString(),
          imgSrc: 'https://example.com/scraped-image.jpg',
        },
      ]);

      return request(app.getHttpServer())
        .get('/articles/scrape')
        .expect(200)
        .expect((res) => {
          expect(res.text).toBe('Scraper job running in backgroung');
        });
    });
  });

  describe('GET /articles/:id', () => {
    it('should return an article by id', async () => {
      const article = await articlesService.create({
        title: 'Test Article',
        content: 'Test content',
        publishedAt: new Date().toISOString(),
        imgSrc: 'https://example.com/image.jpg',
      });

      return request(app.getHttpServer())
        .get(`/articles/${article.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Test Article');
        });
    });

    it('should return 404 if article is not found', async () => {
      return request(app.getHttpServer()).get('/articles/999').expect(404);
    });
  });

  describe('PATCH /articles/:id', () => {
    it('should update an article', async () => {
      const article = await articlesService.create({
        title: 'Test Article',
        content: 'Test content',
        publishedAt: new Date().toISOString(),
        imgSrc: 'https://example.com/image.jpg',
      });

      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      return request(app.getHttpServer())
        .patch(`/articles/${article.id}`)
        .send(updateArticleDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Title');
          expect(res.body.content).toBe('Updated content');
        });
    });

    it('should return 404 if article is not found', async () => {
      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      return request(app.getHttpServer())
        .patch('/articles/999')
        .send(updateArticleDto)
        .expect(404);
    });
  });

  describe('DELETE /articles/:id', () => {
    it('should delete an article', async () => {
      const article = await articlesService.create({
        title: 'Test Article',
        content: 'Test content',
        publishedAt: new Date().toISOString(),
        imgSrc: 'https://example.com/image.jpg',
      });

      return request(app.getHttpServer())
        .delete(`/articles/${article.id}`)
        .expect(200);
    });

    it('should return 404 if article is not found', async () => {
      return request(app.getHttpServer()).delete('/articles/999').expect(404);
    });
  });
});
