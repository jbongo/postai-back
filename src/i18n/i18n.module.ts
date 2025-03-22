import { Module, Global } from '@nestjs/common';
import { I18nModule, I18nJsonLoader, HeaderResolver, AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { I18nTranslationService } from './i18n.service';
import { i18nConfig } from './i18n.config';

@Global() // REND LE MODULE GLOBAL
@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: i18nConfig.fallbackLanguage, // Langue par défaut
      loader: I18nJsonLoader, // Utilisation de JSON pour stocker les traductions
      loaderOptions: {
        path: path.join(__dirname, '/../i18n/'), // Chemin vers les fichiers de traduction
        watch: true, // Recharge les traductions en cas de modification
      },
      resolvers: [
        new QueryResolver(['lang']), // Langue via `?lang=fr`
        new HeaderResolver(), // Langue via `Accept-Language`
        new AcceptLanguageResolver(), // Utilisation du resolver Accept-Language
      ],
    }),
  ],
  providers: [I18nTranslationService],
  exports: [I18nTranslationService], // Exportation pour utilisation globale
})
export class I18nTranslationModule {}
/**
 * 
 * C'est ici qu'on importe et configure nestjs-i18n pour qu'il puisse lire les fichiers JSON.
 * 
 * ✅ Il charge automatiquement les fichiers JSON.
    ✅ Il définit une langue par défaut (fr).
    ✅ Il active le rechargement des fichiers en live.
 * 
 * 
 * 
 */