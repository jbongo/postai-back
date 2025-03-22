import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //to evoid multiple import of the service file by file  in other module we make the module global with: @Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService] 
})
export class PrismaModule {}
//this become global module for all export services
