import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { I18nTranslationModule } from './i18n/i18n.module';
import { I18nTranslationMiddleware } from './i18n/i18n.middleware';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Charge `.env` globalement
    AuthModule, PrismaModule, I18nTranslationModule, UserModule, PostModule, AiModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(I18nTranslationMiddleware).forRoutes('*'); // Applique le middleware à toutes les routes
  }
}
