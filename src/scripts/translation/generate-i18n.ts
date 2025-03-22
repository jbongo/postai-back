// src/scripts/translation/generate-i18n.ts
import * as fs from 'fs';
import * as path from 'path';

const LANG_DIR = path.join(__dirname, '../../i18n/'); // Chemin relatif
const DEFAULT_LANG = 'en'; // Langue de base pour la copie (anglais)
const FILES = ['common.json', 'http.json', 'auth.json', 'user.json', 'admin.json']; //penser à jouter les nouvaux module de tractuction ici

const addLanguage = (lang: string) => {
  const langPath = path.join(LANG_DIR, lang);

  // Vérifie si le dossier existe déjà
  if (fs.existsSync(langPath)) {
    console.log(`❌ La langue "${lang}" existe déjà.`);
    return;
  }

  // Crée le dossier de la nouvelle langue
  fs.mkdirSync(langPath, { recursive: true });
  console.log(`📁 Dossier créé : ${langPath}`);

  // Copie les fichiers de la langue par défaut (en)
  FILES.forEach((file) => {
    const defaultFilePath = path.join(LANG_DIR, DEFAULT_LANG, file);
    const newFilePath = path.join(langPath, file);

    if (fs.existsSync(defaultFilePath)) {
      fs.copyFileSync(defaultFilePath, newFilePath);
      console.log(`📄 Copié : ${file} vers ${lang}`);
    } else {
      fs.writeFileSync(newFilePath, '{}');
      console.log(`🆕 Créé vide : ${file} pour ${lang}`);
    }
  });

  console.log(`✅ Langue "${lang}" ajoutée avec succès !`);
};

// Récupère la langue depuis la ligne de commande
const [, , newLang] = process.argv;

if (!newLang) {
  console.error('❌ Veuillez spécifier une langue (ex: npm run generate:i18n es)');
  process.exit(1);
}

addLanguage(newLang);