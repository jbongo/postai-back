import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nService } from 'nestjs-i18n'; // Importez I18nService
import { BasicValidationPipe } from './i18n/validation/i18n.basic-validation-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 const i18n = app.get<I18nService>(I18nService); 
   // 📌 Utilisation de BasicValidationPipe (pour validation classique)
  app.useGlobalPipes(new BasicValidationPipe(i18n));
  const cors = require("cors");
  app.use(cors());
  
  const port = process.env.PORT ?? 3000;
  await await app.listen(3333, "0.0.0.0");//  app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on: http://localhost:${port}`);
}
bootstrap();

/*

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const translationService = app.get<I18nTranslationService>(I18nTranslationService); 

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true //remove all field that doesn't exist in dto 
  })) //activate validation pipe
  // Définissez la langue
  RequestContext.setLanguage('en');

  console.log(await translationService.translateAsync('common.welcome', { lang: RequestContext.getLanguage() }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
*/

