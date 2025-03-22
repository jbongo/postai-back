//définit un contrat que tous les fournisseurs de traduction doivent respecter. Elle garantit que chaque fournisseur implémente une méthode translate pour traduire du texte

export interface TranslationProvider {
    translate(text: string, targetLang: string): Promise<string>;
  }