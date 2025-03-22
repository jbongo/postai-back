//avec python
import { TranslationProvider } from './translation-provider.interface';

export class ArgosTranslationProvider implements TranslationProvider {
  async translate(text: string, targetLang: string): Promise<string> {
    // Implémentez l'appel à Argos Translate ici (via un script Python ou autre).
    throw new Error('Argos Translate non implémenté dans cet exemple.');
  }
}