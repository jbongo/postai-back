// src/ai/dto/create-idea.dto.ts
export class CreateIdeaDto {
    theme: string;
    keywords?: string; // Une chaîne de mots-clés séparés par des virgules (optionnel)
    language: string;
  }
  