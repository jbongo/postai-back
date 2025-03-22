import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { IAiProvider } from './ai.provider.interface';
// Vous pouvez utiliser axios ou fetch pour appeler l'API de ChatGPT.
import axios from 'axios';

@Injectable()
export class ChatGptProvider implements IAiProvider {
  private readonly logger = new Logger(ChatGptProvider.name);
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly model = 'gpt-3.5-turbo';

  async getPostIdea(theme: string, keywords: string[], language: string): Promise<string> {
    const prompt = `Give me an idea for a post about "${theme}" in ${language}` +
                   (keywords.length ? `, focusing on these keywords: ${keywords.join(', ')}` : '');
                   console.log("Key : "+process.env.CHATGPT_API_KEY);
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error: any) {
      this.logger.error('Error calling ChatGPT API', error.response?.data || error.message);
      if (error.response && error.response.data && error.response.data.error) {
        const errData = error.response.data.error;
        if (errData.code === 'insufficient_quota') {
          throw new ForbiddenException(
            'You exceeded your current quota, please check your plan and billing details. For more information, see https://platform.openai.com/docs/guides/error-codes/api-errors.'
          );
        }
      }
      throw error;
    }
  }

  async imitatePostStyle(sourcePost: string, targetTheme: string, language: string): Promise<string> {
    // Implémentation similaire avec gestion des erreurs
    const prompt = `Imitate the style of the following post and create a new post on the theme "${targetTheme}" in ${language}:\n\n${sourcePost}`;
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error: any) {
      this.logger.error('Error calling ChatGPT API for imitatePostStyle', error.response?.data || error.message);
      if (error.response && error.response.data && error.response.data.error?.code === 'insufficient_quota') {
        throw new ForbiddenException(
          'You exceeded your current quota, please check your plan and billing details.'
        );
      }
      throw error;
    }
  }

  async createPostFromScratch(prompt: string): Promise<string> {
    return this.callOpenAiApi(prompt);
  }

  async translatePost(prompt: string): Promise<string> {
    return this.callOpenAiApi(prompt);
  }

  private async callOpenAiApi(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error: any) {
      this.logger.error('Erreur OpenAI', error.response?.data || error.message);
      throw error;
    }
  }

  /*
  async createPostFromScratch(prompt: string, language: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error: any) {
      this.logger.error('Erreur lors de l’appel à l’API OpenAI', error.response?.data || error.message);
      if (error.response && error.response.data?.error?.code === 'insufficient_quota') {
        throw new ForbiddenException('Quota OpenAI dépassé. Vérifiez votre abonnement.');
      }
      throw error;
    }
  }*/
}