import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

@Injectable()
export class ScraperService {
  private async fetchPage(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpException(
          `Failed to fetch page: ${response.statusText}`,
          HttpStatus.NOT_FOUND,
        );
      }
      const data = await response.text();

      return data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async scrapeArticles() {
    const baseUrl =
      'https://www.teachermagazine.com/sea_en/category/short-articles';
    const articlesPerPage = 10;
    const totalArticles = 60;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const allArticles = [];

    for (let page = 1; page <= totalPages; page++) {
      const url = `${baseUrl}/p${page}`;
      const html = await this.fetchPage(url);
      if (html) {
        const articles = this.extractArticlesFromPage(html);
        allArticles.push(...articles);
      }
    }

    return allArticles;
  }

  private extractArticlesFromPage(html: string) {
    const $ = cheerio.load(html);
    const articles = [];

    $('.article-listing-card').each((index, element) => {
      const title = $(element).find('.article-heading span').text().trim();
      const articleDate = $(element)
        .find('.article-tags.min-margin-top')
        .text()
        .trim();
      const publishedAt = new Date(articleDate).toISOString();
      const imgSrc = $(element)
        .find('.article-listing-image picture img')
        .attr('src');
      const content = $(element).find('.teacher-summary span p').text().trim();

      articles.push({ title, publishedAt, imgSrc, content });
    });

    return articles;
  }
}
