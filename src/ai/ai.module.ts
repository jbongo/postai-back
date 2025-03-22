import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatGptProvider } from './providers/chatgpt.provider';
import { AiController } from './ai.controller';


@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: 'IAiProvider',
      useClass: ChatGptProvider,
    },
  ],
  exports: [AiService],
})
export class AiModule {}

