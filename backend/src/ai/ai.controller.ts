import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';

@ApiTags('AI')
@Controller('api/ai')
export class AiController {
    constructor(private readonly aiService: AiService) {}

    @Post('chat')
    @ApiOperation({ summary: 'Tư vấn sản phẩm công nghệ qua Gemini' })
    async chat(@Body() body: ChatDto) {
        return { reply: await this.aiService.chat(body.message, body.history ?? []) };
    }
}
