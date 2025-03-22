import { I18nModule, I18nJsonLoader } from 'nestjs-i18n';
import * as path from 'path';
import * as fs from 'fs';

const translationPath = path.join(__dirname, '..', 'i18n/'); // Charge depuis dist/i18n/;
console.log('Translation files path:', translationPath);

// Vérifiez que le fichier common.json existe
const commonFilePath = path.join(translationPath, 'en/common.json');
if (fs.existsSync(commonFilePath)) {
  console.log('common.json exists!');
  const content = fs.readFileSync(commonFilePath, 'utf-8');
  console.log('common.json content:', content);
} else {
  console.log('common.json does not exist!');
}


export const i18nConfig = {
  fallbackLanguage: 'en', // Langue par défaut
  supportedLanguages: ['en', 'fr'], // Langues supportées
  loaderOptions: {
    path: translationPath, //path.join(__dirname, '/../i18n/'), // Chemin relatif correct, // Chemin vers les fichiers de traduction
    watch: true, // Recharge les traductions en cas de modification
  },
};


  /**
   * export const i18nConfig = {
    fallbackLanguage: 'en',
    supportedLanguages: ['fr', 'en', 'es'], // Langues supportées
  };
   * détecter la langue de l’utilisateur automatiquement, ajoute une config avancée
   * ✅ Utile pour centraliser la config et éviter de tout modifier partout.
    ✅ Permet de changer facilement les langues supportées.
   */