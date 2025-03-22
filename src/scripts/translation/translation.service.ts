// src/scripts/translation/translation.service.ts
import { TranslationProvider } from './providers/translation-provider.interface';

export class TranslationService {
  private provider: TranslationProvider | null = null;

  constructor(private providers: TranslationProvider[]) {}

  async setProvider(provider: TranslationProvider): Promise<void> {
    this.provider = provider;
  }

  async autoSelectProvider(): Promise<void> {
    for (const provider of this.providers) { //test les provider et choisi le premier qui fonctionnne
      try {
        // Teste le fournisseur avec une petite traduction
        await provider.translate('test', 'en');
        this.provider = provider;
        console.log(`Fournisseur sélectionné : ${provider.constructor.name}`);
        return;
      } catch (error) {
        console.warn(`Fournisseur ${provider.constructor.name} indisponible : ${error.message}`);
      }
    }
    throw new Error('Aucun fournisseur de traduction disponible.');
  }

  async translate(text: string, targetLang: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Aucun fournisseur de traduction sélectionné.');
    }
    return this.provider.translate(text, targetLang);
  }
}