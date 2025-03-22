// src/scripts/translation/translate-i18n.ts
import * as fs from 'fs';
import * as path from 'path';
import { LibreTranslationProvider } from './providers/libre.provider';
import { ArgosTranslationProvider } from './providers/argos.provider';
import { TranslationService } from './translation.service';
import { GoogleTranslationProvider } from './providers/google.provider';


const LANG_DIR = path.join(__dirname, '../../i18n/'); // Chemin relatif
const BASE_LANG = 'en'; // Langue de base pour la traduction (anglais)

// Initialisation des fournisseurs
const googleProvider = new GoogleTranslationProvider('your-google-project-id');
const libreProvider = new LibreTranslationProvider();
const argosProvider = new ArgosTranslationProvider();

const translationService = new TranslationService([googleProvider, libreProvider, argosProvider]);

// Fonction pour traduire un fichier
const translateFile = async (filePath: string, newLang: string) => {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const translatedContent = {};

  for (const key in content) {
    if (typeof content[key] === 'string') {
      translatedContent[key] = await translationService.translate(content[key], newLang);
    } else if (typeof content[key] === 'object') {
      translatedContent[key] = {};
      for (const subKey in content[key]) {
        translatedContent[key][subKey] = await translationService.translate(content[key][subKey], newLang);
      }
    }
  }

  return translatedContent;
};

// Fonction pour traduire une langue
const translateLanguage = async (lang: string) => {
  const langPath = path.join(LANG_DIR, lang);

  if (!fs.existsSync(langPath)) {
    console.log(`❌ La langue "${lang}" n'existe pas. Lance d'abord "npm run generate:i18n ${lang}"`);
    return;
  }

  const baseLangPath = path.join(LANG_DIR, BASE_LANG);

  for (const file of fs.readdirSync(baseLangPath)) {
    const filePath = path.join(baseLangPath, file);
    const newFilePath = path.join(langPath, file);

    console.log(`🔄 Traduction de ${file} vers ${lang}...`);
    const translatedData = await translateFile(filePath, lang);
    fs.writeFileSync(newFilePath, JSON.stringify(translatedData, null, 2), 'utf8');
    console.log(`✅ ${file} traduit et sauvegardé.`);
  }

  console.log(`🎉 Traduction complète pour ${lang} !`);
};

// Choix du fournisseur
const [, , newLang, providerChoice] = process.argv;

if (!newLang) {
  console.error('❌ Veuillez spécifier une langue (ex: npm run translate es)');
  process.exit(1);
}

(async () => {
  if (providerChoice === 'google') {
    await translationService.setProvider(googleProvider);
  } else if (providerChoice === 'libre') {
    await translationService.setProvider(libreProvider);
  } else if (providerChoice === 'argos') {
    await translationService.setProvider(argosProvider);
  } else {
    console.log('🔍 Sélection automatique du fournisseur...');
    await translationService.autoSelectProvider();
  }

  await translateLanguage(newLang);
})();