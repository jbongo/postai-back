//avec google mais il faut payer l'api et installer dans les dep avec yarn
import { v2 } from '@google-cloud/translate';
const { Translate } = v2;
import { TranslationProvider } from './translation-provider.interface';

export class GoogleTranslationProvider implements TranslationProvider {
  private translateClient: v2.Translate;

  constructor(private projectId: string) {
    this.translateClient = new Translate({ projectId });
  }

  async translate(text: string, targetLang: string): Promise<string> {
    const [translation] = await this.translateClient.translate(text, targetLang);
    return translation;
  }
}