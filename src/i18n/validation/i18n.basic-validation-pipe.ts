import { Injectable, ArgumentMetadata, BadRequestException, ValidationPipe, ValidationError } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { RequestContext } from 'src/context/request-context';
import { i18nConfig } from '../i18n.config';

@Injectable()
export class BasicValidationPipe extends ValidationPipe {
  constructor(private readonly i18n: I18nService) {
    super({
      transform: true, // ✅ Active la conversion automatique des types ! a tej si pas besoin (pb conversion implite age nb)
      transformOptions: { enableImplicitConversion: true }, // ✅ Conversion automatique même si `@Type()` est absent
      exceptionFactory: async (errors: ValidationError[]) => {

        console.log("📌 Erreur de validation interceptée !");
  
        errors.forEach(error => {
          console.log(`🔍 Champ: ${error.property}`);
          console.log(`➡️ Valeur reçue:`, error.value);
          console.log(`⚠️ Contraintes:`, error.constraints);
          console.log(`🔹 Contextes:`, error.contexts);
        });

        const lang = RequestContext.getLanguage() || i18nConfig.fallbackLanguage;

        const translatedErrors = await Promise.all(
          errors.map(async (error) => {
            const messages = error.constraints
              ? await Promise.all(
                  Object.entries(error.constraints).map(async ([key, translationKey]) => {
                    console.log(`🔹 Clé reçue: ${translationKey}`);

                    // 📌 Extraire `min` et `max` depuis `contexts`
                    const args = error.contexts?.[key] || {};
                    console.log(`🔹 Arguments extraits après correction:`, args);

                    // 📌 Traduction de la clé avec `args`
                    let translatedText = await this.i18n.translate(translationKey, { lang });

                    console.log(`🔹 Traduction brute: ${translatedText}`);

                    // 🚀 **Forcer le remplacement des variables dynamiques (`{{min}}`, `{{max}}`)**
                    translatedText = (translatedText as string).replace(/{{(\w+)}}/g, (match, p1) => {
                      return args[p1] !== undefined ? args[p1].toString() : match;
                    });

                    console.log(`✅ Traduction finale: ${translatedText}`);

                    return translatedText;
                  })
                )
              : ['Unknown error'];

            return {
              field: error.property,
              messages,
            };
          })
        );

        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: translatedErrors,
        });
      },
    });
  }
}



/*
@Injectable()
export class BasicValidationPipe extends ValidationPipe {
  constructor(private readonly i18n: I18nService) {
    super({
      exceptionFactory: async (errors: ValidationError[]) => {
        const lang = RequestContext.getLanguage() || i18nConfig.fallbackLanguage;

        const translatedErrors = await Promise.all(
          errors.map(async (error) => {
            const messages = error.constraints
              ? await Promise.all(
                  Object.entries(error.constraints).map(async ([key, translationKey]) => {
                    console.log(`🔹 Clé reçue: ${translationKey}`); // Debugging

                    // Récupération de `min` et `max` s'ils existent dans `contexts`
                    const args = error.contexts?.[key] || {};

                    return await this.i18n.translate(translationKey, { lang, args });
                  })
                )
              : ['Unknown error'];

            return {
              field: error.property,
              messages,
            };
          })
        );

        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: translatedErrors,
        });
      },
    });
  }
}*/


/*parfait
@Injectable() // avec traduction mais sans conversion des valeur min max
export class BasicValidationPipe extends ValidationPipe {
  constructor(private readonly i18n: I18nService) {
    super({
      exceptionFactory: async (errors: ValidationError[]) => {
        const lang = RequestContext.getLanguage() || i18nConfig.fallbackLanguage;

        const translatedErrors = await Promise.all(
          errors.map(async (error) => {
            const messages = error.constraints
              ? await Promise.all(
                  Object.values(error.constraints).map(async (translationKey: string) => {
                    console.log(`🔹 Clé de traduction reçue: ${translationKey}`); // String
                    console.log(`🔹 Valeur reçue:`, error.value); // Affichage direct
                    console.log(`🔹 Enfants reçus:`, JSON.stringify(error.children, null, 2)); // JSON.stringify pour voir clairement
                    console.log(`🔹 Contraintes reçues:`, JSON.stringify(error.constraints, null, 2)); 
                    console.log(`🔹 Contextes reçus:`, JSON.stringify(error.contexts, null, 2)); 
                    console.log(`🔹 Cible reçue:`, JSON.stringify(error.target, null, 2)); 
                    
                    return await this.i18n.translate(translationKey, { lang });
                  })
                )
              : ['Unknown error'];

            return {
              field: error.property,
              messages,
            };
          })
        );

        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: translatedErrors,
        });
      },
    });
  }
}*/



/*
@Injectable() ol d sans traduction
export class BasicValidationPipe extends ValidationPipe {
  constructor(private readonly i18n: I18nService) {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        const lang = RequestContext.getLanguage() || i18nConfig.fallbackLanguage;

        const translatedErrors = errors.map((error) => {
          const messages = error.constraints
            ? Object.values(error.constraints).map((translationKey: string) =>
                this.i18n.translate(translationKey, { lang }) // Traduisez la clé
              )
            : ['Unknown error'];

          return {
            field: error.property,
            messages,
          };
        });

        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: translatedErrors,
        });
      },
    });
  }
}*/

