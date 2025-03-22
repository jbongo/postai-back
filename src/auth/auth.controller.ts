import { Body, Controller, Get, Post, Req, UnauthorizedException,  } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthSignInDto, AuthSignUpDto } from "./dto";
import { RequestContext } from "src/context/request-context";



@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {
    }

    //can get req by @Req() decorator like : @Req() req: Request and acess to data with req.header, req.body
    @Post("signup")
    signUp(@Body() signUpDto: AuthSignUpDto){ 
        //@Req() req: Request console.log(req.body);
        //body with pype @Body('email')  email: string , etc
        //application of pipe without dto @Body('password', ParseInt)  email: string 
        console.log({signUpDto});
        return this.authService.signUp(signUpDto);
    }
    
    @Post("signin")
    async signIn(@Body() authSignInDto: AuthSignInDto) {
        return this.authService.signIn(authSignInDto);
    }


    @Post('refresh')
  async refreshToken(@Req() req) {
    const { userId, refreshToken } = req.body;
    if (!userId || !refreshToken) {
      throw new UnauthorizedException('common.auth.invalid_refresh_token');
    }
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Post('logout')
  async logout(@Req() req) {
    const { userId } = req.body;
    if (!userId) {
      throw new UnauthorizedException('common.auth.invalid_request');
    }
    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }








    @Post("welcome")
    welcome(){
        return this.authService.getWelcomeMessage(RequestContext.getLanguage());
    }
    
    @Get('message')
    async getMessage(@Req() req: Request) {
        const lang = RequestContext.getLanguage();//req['lang'] || 'en';
        const args = { Name: 'John' }; // Paramètre dynamique
    
        return {
            message: await this.authService.getMessage('common.welcome', lang, args),
        };
    }
    
    @Get('test-translate')
    async testTranslate() {
        return this.authService.testTranslate();
    }

    
}