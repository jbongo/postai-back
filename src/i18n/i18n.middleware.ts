import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '../context/request-context';
import { i18nConfig } from '../i18n/i18n.config';

@Injectable()
export class I18nTranslationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let lang = req.headers['accept-language']?.split(',')[0] || i18nConfig.fallbackLanguage;

    // Vérifie si la langue est supportée, sinon utilise la langue par défaut
    if (!i18nConfig.supportedLanguages.includes(lang)) {
      lang = i18nConfig.fallbackLanguage;
    }

    RequestContext.setLanguage(lang); // ✅ Stocke la langue dans RequestContext
    

    next();
  }
}



/*
@Injectable()
export class I18nTranslationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const lang = req.headers['accept-language']?.split(',')[0] || 'en'; // Langue par défaut
    req['lang'] = lang; // Stockage de la langue dans la requête
    next();
  }
}
*/
