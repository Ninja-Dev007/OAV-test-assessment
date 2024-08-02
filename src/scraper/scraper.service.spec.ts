import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import fetch from 'node-fetch';

import { ScraperService } from './scraper.service';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and return HTML', async () => {
    const mockHtml = '<html><body>test</body></html>';
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response(mockHtml),
    );

    const result = await service['fetchPage'](
      'https://www.teachermagazine.com/sea_en/category/short-articles',
    );
    expect(result).toBe(mockHtml);
  });

  it('should throw an error if fetch fails', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
      new Error('Fetch failed'),
    );

    await expect(
      service['fetchPage'](
        'https://www.teachermagazine.com/sea_en/category/short-articlesm',
      ),
    ).rejects.toThrow(HttpException);
  });

  it('should extract articles from page correctly', () => {
    const mockHtml = `
      <div class="article-listing-card">
        <div class="article-heading"><span>Test Article</span></div>
        <div class="article-tags min-margin-top">Jan 01, 2022</div>
        <div class="article-listing-image">
          <picture>
            <img src="https://example.com/image.jpg" alt="Article Image">
          </picture>
        </div>
        <div class="teacher-summary">
          <span><p>Test content of the article.</p></span>
        </div>
      </div>
    `;

    const articles = service['extractArticlesFromPage'](mockHtml);
    expect(articles.length).toBe(1);
    const article = articles[0];
    expect(article.title).toBe('Test Article');
    expect(article.publishedAt).toBe(new Date('Jan 01, 2022').toISOString());
    expect(article.imgSrc).toBe('https://example.com/image.jpg');
    expect(article.content).toBe('Test content of the article.');
  });

  it('should extract articles from HTML', () => {
    const mockHtml = `
      <div class="article-listing-card">
        <div class="article-heading"><span>Test Article</span></div>
        <div class="article-tags min-margin-top">Jan 01, 2022</div>
        <div class="article-listing-image">
          <picture><img src="https://example.com/image.jpg" alt="Article Image"></picture>
        </div>
        <div class="teacher-summary"><span><p>Test content</p></span></div>
      </div>
    `;

    const result = service['extractArticlesFromPage'](mockHtml);
    expect(result.length).toBe(1);
    expect(result[0]).toMatchObject({
      title: 'Test Article',
      publishedAt: new Date('Jan 01, 2022').toISOString(),
      imgSrc: 'https://example.com/image.jpg',
      content: 'Test content',
    });
  });
});
