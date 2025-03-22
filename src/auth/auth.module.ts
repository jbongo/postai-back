import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    //imports: [PrismaModule], to global
    imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule], // ✅ Permet d'utiliser les variables d'environnement
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'), // ✅ Utilisation de `JWT_SECRET` depuis .env
            signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '1h' },
          }),
        }),
      ],
    controllers : [AuthController],
    providers : [AuthService]
})
export class AuthModule {}