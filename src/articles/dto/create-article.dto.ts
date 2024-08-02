import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ description: 'The title of the article' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'The content of the article' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The publication date of the article',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiProperty({ description: 'The URL of the article image', required: false })
  @IsOptional()
  @IsString()
  imgSrc?: string;
}
