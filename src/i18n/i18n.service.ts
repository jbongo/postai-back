import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { RequestContext } from '../context/request-context';

@Injectable()
export class I18nTranslationService {
  constructor(private readonly i18n: I18nService) {
    console.log('I18nTranslationService initialized'); // Log pour vérifier l'initialisation
  }

  // ✅ Version Async (cas général)
  async translateAsync(key: string, args?: Record<string, any>): Promise<string> {
    const lang = this.getLang();
    console.log(`Translating key: ${key}, ${lang}`); // Log pour vérifier la clé et la langue
    return this.i18n.translate(key, { lang, args });
  }

  translate(key: string, options?: { lang: string; args?: Record<string, any> }): string {
    const lang = options?.lang || this.getLang(); // Détermine la langue
    let translatedText = this.i18n.translate(key, { lang }) as string;

    console.log(`🔹 Key: ${key}, Lang: ${lang}, Raw Translation: ${translatedText}`);
    console.log(`🔹 Args:`, options?.args);

    if (options?.args) {
        translatedText = translatedText.replace(/{{(\w+)}}/g, (match, p1) => {
            return options.args![p1] !== undefined ? options.args![p1] : match;
        });
    }

    console.log(`✅ Final Translation: ${translatedText}`);
    return translatedText;
}


//   translate(key: string, options?: { lang: string; args?: Record<string, any> }): string {
//     const lang = options?.lang || this.getLang(); // Détermine la langue
//     return this.i18n.translate(key, { lang, args: options?.args }) as string;
// }



  // ✅ Version Synchrone (utile pour validation/errors)
  // translate(key: string, args?: Record<string, any>): string {
  //   const lang = this.getLang();
  //   console.log(`Translating key: ${key}, ${lang}`);  // Log pour vérifier la clé et la langue
   
  //   return this.i18n.translate(key, { lang, args }) as string;
  // }

  // 🛠️ Récupérer automatiquement la langue
  private getLang(): string {
    return RequestContext.getLanguage(); // ✅ Utilisation de la langue stockée globalement
  }
}


/**
 * Ce service permet d’injecter la traduction partout dans ton code.
 * Simplifie l'accès aux traductions en injectant CustomI18nService.
✅ Permet d’utiliser des variables dynamiques (args).
✅ Réutilisable partout → Controllers, Services, Guards, Middlewares.


throw new Error(await this.translationService.translateAsync('auth.error.invalid_credentials', req));


#en mode validation dto
export class RegisterDto {
  @IsNotEmpty({ message: async () => await new I18nTranslationService().translate('validation.required', 'fr') })
  
#en mode console
console.log(await this.translationService.translate('common.system.starting', lang));


----




const message = await this.i18n.translate('user.welcome_user', {
  args: { name: 'John' },
});

const errorMessage = await this.i18n.translate('auth.error.invalid_credentials', { lang: 'fr' });
console.log(errorMessage); // "Identifiants invalides."


const warningMessage = await this.i18n.translate('auth.warning.too_many_attempts', { lang: 'fr' });
console.log(warningMessage); // "Trop de tentatives de connexion. Réessayez plus tard."



const infoMessage = await this.i18n.translate('user.info.profile_updated', { lang: 'fr' });
console.log(infoMessage); // "Votre profil a été mis à jour."


const notFoundMessage = await this.i18n.translate('http.client_error.404.not_found', { lang: 'fr' });
console.log(notFoundMessage); // "Ressource non trouvée."



import { Injectable, Scope } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST }) // Rend le service accessible par requête
export class I18nTranslationService {
  constructor(
    private readonly i18n: I18nService,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  async translate(key: string, args?: Record<string, any>): Promise<string> {
    const lang = this.request.headers['accept-language']?.split(',')[0] || 'fr'; // Langue par défaut
    return this.i18n.translate(key, { lang, args });
  }
}

 */