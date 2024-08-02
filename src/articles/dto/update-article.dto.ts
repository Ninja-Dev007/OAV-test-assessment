import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({ description: 'The title of the article', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'The content of the article', required: false })
  @IsOptional()
  @IsString()
  content?: string;

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
