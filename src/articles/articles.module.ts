import { Module } from '@nestjs/common';

import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ScraperService } from '../scraper/scraper.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, ScraperService],
  imports: [PrismaModule],
})
export class ArticlesModule {}
