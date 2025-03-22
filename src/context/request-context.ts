export class RequestContext {
    private static language: string;
  
    static setLanguage(lang: string) {
      this.language = lang;
    }
  
    static getLanguage(): string {
      return this.language || 'en'; // Valeur par défaut si la langue n'est pas définie
    }
  }
  