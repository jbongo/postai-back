import { IsString, IsArray, IsEnum, IsBoolean } from 'class-validator';

export enum AvailableLanguages {
  FR = 'fr',
  EN = 'en',
  ES = 'es'
}

export enum Tone {
  FORMAL = 'Formel',
  INFORMAL = 'Informel',
  HUMOROUS = 'Humoristique'
}

export class CreatePostDto {
  @IsString()
  subject: string;

  @IsArray()
  messages: string[];

  @IsString()
  goal: string;

  @IsString()
  audience: string;

  @IsString()
  length: string;

  @IsEnum(AvailableLanguages)
  default_language: AvailableLanguages;

  @IsBoolean()
  multilingual_support: boolean;

  @IsArray()
  @IsEnum(AvailableLanguages, { each: true })
  translations: AvailableLanguages[];
  
  @IsEnum(Tone)
  tone: Tone;
}
