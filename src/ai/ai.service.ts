import { Inject, Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { IAiProvider } from './providers/ai.provider.interface';
import { CreatePostDto } from './dto/create-post.dto';

//from module root to dist path     combine module root to dist
//const aiPath = path.join(__dirname, '..', 'ai/'); // Charge depuis dist/i18n/;
//const templatePath = path.join(aiPath, 'promt-templates/post-template.json');

//const templatePath = path.join(process.cwd(), 'dist/assets/post-template.json'); think to asset later
/**nest-cli {
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "assets": ["src/assets/**//*"], //
  "compilerOptions": {
    "deleteOutDir": true
  }
}
 */



@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly template: any;
  constructor(@Inject('IAiProvider') private readonly aiProvider: IAiProvider) {
    //const templatePathv2 = path.join(process.cwd(), 'dist/ai/promt-templates/post-template.json');
    // Charger le template JSON
    //this.template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

    const templatePath = path.join(__dirname, '../ai/promt-templates/post-template.json');
    this.template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  }

  async findIdea(theme: string, keywords: string[], language: string): Promise<string> {
    return this.aiProvider.getPostIdea(theme, keywords, language);
  }

  async imitatePostStyle(sourcePost: string, targetTheme: string, language: string): Promise<string> {
    return this.aiProvider.imitatePostStyle(sourcePost, targetTheme, language);
  }

  async createPost(createPostDto: CreatePostDto): Promise<{ [key: string]: string }> {
    const { subject, messages, goal, audience, length, default_language, multilingual_support, translations, tone } = createPostDto;

    // Vérifier si la langue principale est supportée
    if (!this.template.output_language.available_languages.includes(default_language)) {
      throw new Error(`La langue par défaut ${default_language} n'est pas supportée.`);
    }

    // Construire le prompt pour la langue par défaut
    const prompt = `
    ${this.template.prompt}

    📌 **Informations fournies :**
    - Sujet : ${subject}
    - Messages principaux : ${messages.join(', ')}
    - Objectif : ${goal}
    - Audience : ${audience}
    - Longueur : ${length}
    - Langue : ${default_language}
    - Ton : ${tone}

    🎯 **Instructions de rédaction :**
    ${this.template.writing_instructions.map(instruction => `- ${instruction}`).join('\n')}
    
    📝 **Structure attendue :**
    - ${this.template.expected_structure.title}
    - ${this.template.expected_structure.content}
    - ${this.template.expected_structure.multilingual}
    `;

    // Génération du post principal en default_language
    const postInDefaultLanguage = await this.aiProvider.createPostFromScratch(prompt);
    
    let generatedPosts: { [key: string]: string } = {};
    generatedPosts[default_language] = postInDefaultLanguage;

    // Optimisation : Traduire toutes les langues en un seul appel si nécessaire
    if (multilingual_support && translations.length > 0) {
      const targetLanguages = translations.filter(lang => lang !== default_language);
      
      //plan si pb traduction après test il faut creer un end poin de traduction pour laisser la main au user s'il valid la traduction
      //sinon ça consome plus de token
      const translationPrompt = `
      Translate the following post into the following languages: ${targetLanguages.join(', ')}.
      Keep the structure, tone, and message identical.
      Provide the translations in JSON format with language codes as keys.
  
      Original post:
      ${postInDefaultLanguage}
      `;

      const translationsResult = await this.aiProvider.translatePost(translationPrompt);

      console.log("🚀 Traduction OpenAI : ", translationsResult);
      // Associer chaque traduction à la bonne langue
     /* targetLanguages.forEach((lang, index) => {
        generatedPosts[lang] = translationsResult[index];
      });*/

       // Vérifier si OpenAI a renvoyé un JSON valide
    try {
      const parsedTranslations = JSON.parse(translationsResult);
      Object.assign(generatedPosts, parsedTranslations);
    } catch (error) {
      this.logger.error("La traduction OpenAI n'est pas en JSON, récupération manuelle en cours...");
      // Si OpenAI renvoie une réponse brute, extraire chaque partie de la réponse manuellement
      const translationParts = translationsResult.split("\n\n");
      targetLanguages.forEach((lang, index) => {
        generatedPosts[lang] = translationParts[index] || "Traduction indisponible";
      });
    }
    }

    return generatedPosts;
  }
/*
  async createPost(createPostDto: CreatePostDto): Promise<string> {
    const { subject, messages, goal, audience, length, language, tone } = createPostDto;

    // Vérifier si la langue demandée est supportée
    if (!this.template.output_language.available_languages.includes(language)) {
      throw new Error(`La langue ${language} n'est pas supportée.`);
    }

    // Construire le prompt basé sur le template
    const prompt = `
    ${this.template.prompt}

    📌 **Informations fournies :**
    - Sujet : ${subject}
    - Messages principaux : ${messages.join(', ')}
    - Objectif : ${goal}
    - Audience : ${audience}
    - Longueur : ${length}
    - Langue : ${language}
    - Ton : ${tone}

    🎯 **Instructions de rédaction :**
    ${this.template.writing_instructions.map(instruction => `- ${instruction}`).join('\n')}
    
    📝 **Structure attendue :**
    - ${this.template.expected_structure.title}
    - ${this.template.expected_structure.content}
    - ${this.template.expected_structure.multilingual}
    `;

    // Appel à l'API OpenAI pour générer le post
    const generatedPost = await this.aiProvider.createPostFromScratch(prompt, language);

    return generatedPost;
  }*/
}
