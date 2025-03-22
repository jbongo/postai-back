//liber api public gratuit
import axios from 'axios';
import { TranslationProvider } from './translation-provider.interface';

export class LibreTranslationProvider implements TranslationProvider {
  private apiUrl: string;

  constructor(apiUrl: string = 'https://libretranslate.com/translate') {
    this.apiUrl = apiUrl;
  }

  async translate(text: string, targetLang: string): Promise<string> {
    const response = await axios.post(this.apiUrl, {
      q: text,
      source: 'auto',
      target: targetLang,
      format: 'text',
    });
    return response.data.translatedText;
  }
}