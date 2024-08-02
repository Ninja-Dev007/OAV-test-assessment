import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperService } from './scraper/scraper.service';
import { ArticlesModule } from './articles/articles.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ArticlesModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScraperService],
})
export class AppModule {}
