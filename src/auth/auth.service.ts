import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { I18nTranslationService } from 'src/i18n/i18n.service';
import { RequestContext } from 'src/context/request-context';
import { AuthSignInDto, AuthSignUpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    
    constructor(private prisma: PrismaService,private jwtService: JwtService, private readonly translationService: I18nTranslationService) { }

    async signUp(authSignUpDto: AuthSignUpDto) {
        // Destructuration de l'objet authSignUpDto
        const { email, password, confirmPassword, firstName, lastName, phone, dateOfBirth } = authSignUpDto;
    
         // ✅ Vérifier si `password` et `confirmPassword` correspondent
    if (password !== confirmPassword) {
        const lang = RequestContext.getLanguage();
        throw new BadRequestException(
            await this.translationService.translateAsync('common.validation.password_mismatch', { lang })
        );
    }

    
        // Hacher le mot de passe avant de le stocker
        const hash = await argon.hash(password);
    
        try {
            // Création de l'utilisateur avec les informations extraites du DTO
            const user = await this.prisma.user.create({
                data: {
                    email,
                    hash,
                    firstName,
                    lastName,
                    phone: phone || null, // Si `phone` est fourni, l'utiliser, sinon mettre `null`
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, // Conversion de `dateOfBirth` en `Date` si présent
                },
            });
    
            // Supprimer le champ hash avant de renvoyer la réponse
            const { hash: _, ...userWithoutHash } = user;
    
            return userWithoutHash; // Retourner l'utilisateur sans le champ hash
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    // Récupère la langue dynamique depuis le contexte de la requête
                    const lang = RequestContext.getLanguage();
                    throw new ForbiddenException(
                        await this.translationService.translateAsync('common.error.credentials_taken', { lang })
                    );
                }
            }
            throw error; // Si une autre erreur se produit, la relancer
        }
    }


    async signIn(authSignInDto: AuthSignInDto) {
        const { email, password } = authSignInDto;
    
        // ✅ Vérifier si l'utilisateur existe
        const user = await this.prisma.user.findUnique({
          where: { email },
        });
    
        if (!user) {
          const lang = RequestContext.getLanguage();
          throw new UnauthorizedException(
            await this.translationService.translateAsync('common.auth.user_does_not_exist', { lang })
          );
        }
    
        // ✅ Vérifier si le mot de passe est correct
        const passwordMatches = await argon.verify(user.hash, password);
        if (!passwordMatches) {
          const lang = RequestContext.getLanguage();
          throw new UnauthorizedException(
            await this.translationService.translateAsync('common.auth.invalid_credentials', { lang })
          );
        }
    
          // ✅ Générer les tokens d'accès et de rafraîchissement
        const tokens = await this.generateTokens(user.id, user.email);

        // ✅ Stocker le `refreshToken` haché dans la base de données
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
      }

      async refreshToken(userId: string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });
    
        if (!user || !user.refreshToken) {
          throw new ForbiddenException('common.auth.invalid_refresh_token');
        }
    
        // ✅ Vérifier si le refresh token est valide
        const isValid = await argon.verify(user.refreshToken, refreshToken);
        if (!isValid) {
          throw new ForbiddenException('common.auth.invalid_refresh_token');
        }
    
        // ✅ Générer un nouveau `accessToken` et un `refreshToken`
        const tokens = await this.generateTokens(user.id, user.email);
    
        // ✅ Mettre à jour le refresh token haché
        await this.updateRefreshToken(user.id, tokens.refreshToken);
    
        return tokens;
      }


      async logout(userId: string) {
        await this.prisma.user.updateMany({
          where: { id: userId },
          data: { refreshToken: null },
        });
      }
    
      private async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };
    
        const accessToken = await this.jwtService.signAsync(payload, {
          expiresIn: process.env.JWT_EXPIRATION, // ✅ "1h"
          secret: process.env.JWT_SECRET,
        });
    
        const refreshToken = await this.jwtService.signAsync(payload, {
          expiresIn: process.env.JWT_REFRESH_EXPIRATION, // ✅ "7d"
          secret: process.env.JWT_SECRET,
        });
    
        return { accessToken, refreshToken };
      }
    
      private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await argon.hash(refreshToken);
        await this.prisma.user.update({
          where: { id: userId },
          data: { refreshToken: hashedRefreshToken },
        });
      }



      

    async getWelcomeMessage(lang: string) {
        return await {test : this.translationService.translate('common.info.welcome', { lang })};
      }
    async someMethod() {
        const message = await this.translationService.translateAsync('auth.error.credentials_taken', { lang: 'en' });
        console.log(message); // "Credentials already in use."
      }

    //   async getMessage(arg0: string, lang: any) {
    //     return await {test : this.translationService.translate(arg0, { lang })};
    // }
    async getMessage(key: string, lang: string, args?: Record<string, any>) {
        console.log(args);
        return this.translationService.translate(key, { lang, args }).replace("{Name}", args?.Name);
    }
    
    async testTranslate() {
        const message = await this.translationService.translate('common.validation.invalid_length', {
            lang: 'fr',
            args: { min: 8, max: 20 },
        });
    
        return { message };
    }
    
}