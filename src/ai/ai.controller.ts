// src/ai/ai.controller.ts
import { Controller, Post, Body } from '@nestjs/common';

import { CreateIdeaDto } from './dto/create-idea.dto';

import { CreatePostDto } from './dto/create-post.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('idea')
  async getIdea(@Body() createIdeaDto: CreateIdeaDto): Promise<{ idea: string }> {
    const { theme, keywords, language } = createIdeaDto;
    // Convertir la chaîne de mots-clés en tableau, si fournie
    const keywordsArray = keywords ? keywords.split(',').map(keyword => keyword.trim()) : [];
    
    const idea = await this.aiService.findIdea(theme, keywordsArray, language);
    return { idea };
  }

  @Post('create-post')
  async createPost(@Body() createPostDto: CreatePostDto): Promise<{ post: { [key: string]: string } }> {
    const post = await this.aiService.createPost(createPostDto);
    return { post };
  }
}
